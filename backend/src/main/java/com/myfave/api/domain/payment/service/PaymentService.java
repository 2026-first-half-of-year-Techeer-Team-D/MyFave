package com.myfave.api.domain.payment.service;

import com.myfave.api.domain.coupon.entity.Coupon;
import com.myfave.api.domain.coupon.entity.CouponStatus;
import com.myfave.api.domain.coupon.entity.CouponType;
import com.myfave.api.domain.coupon.repository.CouponRepository;
import com.myfave.api.domain.coupon.service.CouponService;
import com.myfave.api.domain.order.entity.Order;
import com.myfave.api.domain.order.entity.OrderItem;
import com.myfave.api.domain.order.entity.OrderStatus;
import com.myfave.api.domain.order.repository.OrderItemRepository;
import com.myfave.api.domain.order.repository.OrderRepository;
import com.myfave.api.domain.payment.dto.request.PaymentCancelRequest;
import com.myfave.api.domain.payment.dto.request.PaymentConfirmRequest;
import com.myfave.api.domain.payment.dto.request.PaymentPrepareRequest;
import com.myfave.api.domain.payment.dto.request.PaymentWebhookRequest;
import com.myfave.api.domain.payment.dto.response.PaymentPrepareResponse;
import com.myfave.api.domain.payment.dto.response.PaymentResponse;
import com.myfave.api.domain.payment.entity.Payment;
import com.myfave.api.domain.payment.entity.PaymentAttempt;
import com.myfave.api.domain.payment.entity.PaymentMethod;
import com.myfave.api.domain.payment.entity.PaymentStatus;
import com.myfave.api.domain.payment.provider.PaymentProvider;
import com.myfave.api.domain.payment.provider.PaymentProvider.PortOnePaymentInfo;
import com.myfave.api.domain.payment.repository.PaymentAttemptRepository;
import com.myfave.api.domain.payment.repository.PaymentRepository;
import com.myfave.api.domain.user.entity.User;
import com.myfave.api.domain.user.repository.UserRepository;
import com.myfave.api.global.error.CustomException;
import com.myfave.api.global.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.ZonedDateTime;
import java.util.Base64;
import java.util.EnumSet;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PaymentService {

    private static final int DELIVERY_FEE = 3000;

    private final PaymentRepository paymentRepository;
    private final PaymentAttemptRepository paymentAttemptRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CouponRepository couponRepository;
    private final CouponService couponService;
    private final UserRepository userRepository;
    private final PaymentProvider paymentProvider;

    @Lazy
    private final PaymentService self;

    @Value("${portone.store-id}")
    private String storeId;

    @Value("${portone.channel-key.card}")
    private String cardChannelKey;

    @Value("${portone.channel-key.kakao-pay}")
    private String kakaoPayChannelKey;

    @Value("${portone.channel-key.naver-pay}")
    private String naverPayChannelKey;

    @Value("${portone.channel-key.toss-pay}")
    private String tossPayChannelKey;

    @Value("${portone.api-secret}")
    private String apiSecret;

    private String resolveChannelKey(PaymentMethod method) {
        return switch (method) {
            case CARD -> cardChannelKey;
            case KAKAO_PAY -> kakaoPayChannelKey;
            case NAVER_PAY -> naverPayChannelKey;
            case TOSS_PAY -> tossPayChannelKey;
        };
    }

    // 1. 결제 준비 ────────────────────────────────────────────────────────────────
    @Transactional
    public PaymentPrepareResponse preparePayment(Long userId, PaymentPrepareRequest request) {

        // 1. 요청자 및 주문 유효성 검증
        if (userId == null) {
            throw new CustomException(ErrorCode.AUTH_UNAUTHORIZED);
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new CustomException(ErrorCode.ORDER_NOT_FOUND));

        if (!order.getUser().getUserId().equals(userId)) {
            throw new CustomException(ErrorCode.AUTH_FORBIDDEN);
        }

        if (order.getOrderStatus() != OrderStatus.PENDING) {
            throw new CustomException(ErrorCode.ORDER_INVALID_STATUS);
        }

        // 2. 결제 중복 방지 체크
        paymentRepository.findByOrderAndPaymentStatusNotIn(
                order, EnumSet.of(PaymentStatus.FAILED, PaymentStatus.CANCELLED))
                .ifPresent(existing -> { throw new CustomException(ErrorCode.PAYMENT_ALREADY_DONE); });

        Coupon discountCoupon = validateCoupon(request.getDiscountCouponId(), CouponType.DISCOUNT, user);
        Coupon shippingCoupon = validateCoupon(request.getShippingCouponId(), CouponType.SHIPPING, user);


        // 3. 쿠폰 적용 및 최종 결제 금액 산정
        List<OrderItem> items = orderItemRepository.findByOrder(order);
        int totalProductPrice = items.stream().mapToInt(OrderItem::getPrice).sum();
        int deliveryFee = shippingCoupon != null ? 0 : DELIVERY_FEE;
        int discountPrice = discountCoupon != null
                ? discountCoupon.getCouponMaster().getDiscountPrice()
                : 0;
        int totalPaymentPrice = totalProductPrice + deliveryFee - discountPrice;
        if (totalPaymentPrice < 0) {
            throw new CustomException(ErrorCode.PAYMENT_NEGATIVE_AMOUNT);
        }


        // 4. Idempotency Key 발급 및 결제 대기 저장
        String idempotencyKey = UUID.randomUUID().toString();

        Payment payment = Payment.builder()
                .order(order)
                .discountCoupon(discountCoupon)
                .shippingCoupon(shippingCoupon)
                .idempotencyKey(idempotencyKey)
                .pgProvider("PORTONE")
                .paymentMethod(request.getPaymentMethod())
                .totalProductPrice(totalProductPrice)
                .deliveryFee(deliveryFee)
                .discountPrice(discountPrice)
                .totalPaymentPrice(totalPaymentPrice)
                .build();

        try {
            paymentRepository.save(payment);
        } catch (OptimisticLockingFailureException e) {
            throw new CustomException(ErrorCode.PAYMENT_LOCK_CONFLICT);
        }

        return PaymentPrepareResponse.of(payment, storeId, resolveChannelKey(request.getPaymentMethod()));
    }

    public record ConfirmContext(Long paymentId, int totalPaymentPrice) {}

    // 2. 결제 승인 (오케스트레이터: 외부 호출은 트랜잭션 밖) ──────────────────────
    @Transactional(propagation = Propagation.NOT_SUPPORTED)
    public PaymentResponse confirmPayment(Long userId, PaymentConfirmRequest request) {
        if (userId == null) {
            throw new CustomException(ErrorCode.AUTH_UNAUTHORIZED);
        }
        // 1. DB에서 유저와 결제 상태 확인
        ConfirmContext ctx = self.validateForConfirm(userId, request.getPaymentId());

        // 2. 외부 PG사 통신
        PortOnePaymentInfo pgInfo = paymentProvider.getPaymentInfo(request.getPgTransactionId());

        //  3. 데이터 무결성 검증 및 롤백
        if (!"PAID".equals(pgInfo.status()) || pgInfo.totalAmount() != ctx.totalPaymentPrice()) {
            if ("PAID".equals(pgInfo.status())) {
                paymentProvider.cancelPayment(pgInfo.pgTransactionId(), pgInfo.totalAmount(), "금액 불일치 자동 환불");
            }
            String failReason = "PG상태: " + pgInfo.status() +
                    ", 예상금액: " + ctx.totalPaymentPrice() +
                    ", 실제금액: " + pgInfo.totalAmount();
            self.failConfirm(ctx.paymentId(), pgInfo.pgTransactionId(), failReason);
            throw new CustomException(ErrorCode.PAYMENT_AMOUNT_MISMATCH);
        }

        // 4. 최종 성공 반영
        return self.completeConfirm(ctx.paymentId(), pgInfo, userId);
    }

    // DB에서 유저와 결제 상태 확인
    @Transactional(readOnly = true)
    public ConfirmContext validateForConfirm(Long userId, Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new CustomException(ErrorCode.PAYMENT_NOT_FOUND));
        if (!payment.getOrder().getUser().getUserId().equals(userId)) {
            throw new CustomException(ErrorCode.AUTH_FORBIDDEN);
        }
        if (payment.getPaymentStatus() != PaymentStatus.PENDING &&
                payment.getPaymentStatus() != PaymentStatus.AUTHORIZED) {
            throw new CustomException(ErrorCode.PAYMENT_INVALID_STATUS);
        }
        return new ConfirmContext(payment.getPaymentId(), payment.getTotalPaymentPrice());
    }

    // 최종 성공 반영
    @Transactional
    public PaymentResponse completeConfirm(Long paymentId, PortOnePaymentInfo pgInfo, Long userId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new CustomException(ErrorCode.PAYMENT_NOT_FOUND));
        int attemptNo = paymentAttemptRepository.countByPaymentPaymentId(paymentId) + 1;

        payment.authorize(pgInfo.pgTransactionId());
        payment.complete(pgInfo.receiptUrl(), pgInfo.paidAt());
        payment.getOrder().completePay(payment);

        if (payment.getDiscountCoupon() != null) {
            couponService.useCoupon(payment.getDiscountCoupon().getCouponId(), userId);
        }
        if (payment.getShippingCoupon() != null) {
            couponService.useCoupon(payment.getShippingCoupon().getCouponId(), userId);
        }

        saveAttempt(payment, attemptNo, PaymentStatus.COMPLETED, pgInfo.pgTransactionId(), null);
        log.info("[Payment] 결제 완료: paymentId={}, orderId={}", paymentId, payment.getOrder().getOrderId());
        return PaymentResponse.from(payment);
    }

    // 데이터 무결성 검증 및 롤백
    @Transactional
    public void failConfirm(Long paymentId, String pgTransactionId, String failReason) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new CustomException(ErrorCode.PAYMENT_NOT_FOUND));
        int attemptNo = paymentAttemptRepository.countByPaymentPaymentId(paymentId) + 1;
        payment.fail(failReason);
        saveAttempt(payment, attemptNo, PaymentStatus.FAILED, pgTransactionId, failReason);
    }


    // 3. 결제 단건 조회 ────────────────────────────────────────────────────────────
    public PaymentResponse getPayment(Long userId, Long paymentId) {
        if (userId == null) {
            throw new CustomException(ErrorCode.AUTH_UNAUTHORIZED);
        }
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new CustomException(ErrorCode.PAYMENT_NOT_FOUND));

        if (!payment.getOrder().getUser().getUserId().equals(userId)) {
            throw new CustomException(ErrorCode.AUTH_FORBIDDEN);
        }
        return PaymentResponse.from(payment);
    }

    public record CancelContext(Long paymentId, String pgTransactionId, int cancelAmount, boolean fullCancel) {}

    // 4. 결제 취소/환불 (오케스트레이터: 외부 호출은 트랜잭션 밖) ─────────────────
    @Transactional(propagation = Propagation.NOT_SUPPORTED)
    public PaymentResponse cancelPayment(Long userId, Long paymentId, PaymentCancelRequest request) {
        if (userId == null) {
            throw new CustomException(ErrorCode.AUTH_UNAUTHORIZED);
        }

        // 1. 결제 취소
        CancelContext ctx = self.validateForCancel(userId, paymentId, request);

        paymentProvider.cancelPayment(ctx.pgTransactionId(), ctx.cancelAmount(), request.getReason());

        // 2. 환불
        return self.applyCancelResult(ctx.paymentId(), ctx.cancelAmount(), ctx.fullCancel(), userId);
    }

    // 결제 취소
    @Transactional(readOnly = true)
    public CancelContext validateForCancel(Long userId, Long paymentId, PaymentCancelRequest request) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new CustomException(ErrorCode.PAYMENT_NOT_FOUND));

        if (!payment.getOrder().getUser().getUserId().equals(userId)) {
            throw new CustomException(ErrorCode.AUTH_FORBIDDEN);
        }

        if (payment.getPaymentStatus() == PaymentStatus.CANCELLED) {
            throw new CustomException(ErrorCode.PAYMENT_CANCELLED);
        }
        if (payment.getPaymentStatus() != PaymentStatus.COMPLETED
                && payment.getPaymentStatus() != PaymentStatus.PARTIAL_CANCELLED) {
            throw new CustomException(ErrorCode.PAYMENT_INVALID_STATUS);
        }

        int remaining = payment.getTotalPaymentPrice() - payment.getRefundedAmount();
        Integer requested = request.getRefundAmount();
        boolean fullCancel = requested == null || requested >= remaining;
        int cancelAmount = fullCancel ? remaining : requested;

        if (cancelAmount <= 0) {
            throw new CustomException(ErrorCode.PAYMENT_INVALID_STATUS);
        }

        return new CancelContext(payment.getPaymentId(), payment.getPgTransactionId(), cancelAmount, fullCancel);
    }

    // 환불
    @Transactional
    public PaymentResponse applyCancelResult(Long paymentId, int cancelAmount, boolean fullCancel, Long userId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new CustomException(ErrorCode.PAYMENT_NOT_FOUND));

        if (fullCancel) {
            payment.partialCancel(cancelAmount);
            payment.cancel();
            payment.getOrder().refund();
            if (payment.getDiscountCoupon() != null) {
                couponService.restoreCoupon(payment.getDiscountCoupon().getCouponId(), userId);
            }
            if (payment.getShippingCoupon() != null) {
                couponService.restoreCoupon(payment.getShippingCoupon().getCouponId(), userId);
            }
        } else {
            payment.partialCancel(cancelAmount);
        }

        log.info("[Payment] 결제 취소: paymentId={}, cancelAmount={}, fullCancel={}",
                paymentId, cancelAmount, fullCancel);
        return PaymentResponse.from(payment);
    }

    public record WebhookContext(Long paymentId, PaymentStatus status, int totalPaymentPrice) {}

    // 5. 웹훅 처리 (오케스트레이터: 외부 호출은 트랜잭션 밖) ──────────────────────
    @Transactional(propagation = Propagation.NOT_SUPPORTED)
    public void processWebhook(String webhookId, String timestamp, String signature,
                               String rawBody, PaymentWebhookRequest request) {

        // 1. 신원 확인
        verifyWebhookSignature(webhookId, timestamp, signature, rawBody);

        String pgTransactionId = request.getData().getPaymentId();
        WebhookContext ctx = self.loadForWebhook(pgTransactionId);

        // 2. 멱등성 방어
        if (ctx == null) {
            log.warn("[Webhook] 결제 정보 없음: pgTransactionId={}", pgTransactionId);
            return;
        }
        if (ctx.status() == PaymentStatus.COMPLETED) {
            log.info("[Webhook] 이미 처리된 결제: paymentId={}", ctx.paymentId());
            return;
        }

        // 3. 결제 상태 분기 및 교차 검증
        if ("Transaction.Paid".equals(request.getType())) {
            PortOnePaymentInfo pgInfo = paymentProvider.getPaymentInfo(pgTransactionId);

            if (pgInfo.totalAmount() != ctx.totalPaymentPrice()) {
                paymentProvider.cancelPayment(pgTransactionId, pgInfo.totalAmount(), "웹훅: 금액 불일치 자동 환불");
                self.failWebhook(ctx.paymentId(), pgTransactionId, "웹훅 금액 불일치");
                return;
            }

            // 4. 최종 상태 반영
            self.completeWebhook(ctx.paymentId(), pgInfo);

        } else if ("Transaction.Failed".equals(request.getType())) {
            self.recordWebhookFailed(ctx.paymentId());
        }
    }

    // 신원 확인
    @Transactional(readOnly = true)
    public WebhookContext loadForWebhook(String pgTransactionId) {
        Payment payment = paymentRepository.findByPgTransactionId(pgTransactionId).orElse(null);
        if (payment == null) return null;
        return new WebhookContext(payment.getPaymentId(), payment.getPaymentStatus(), payment.getTotalPaymentPrice());
    }

    // 최종 상태 반영
    @Transactional
    public void completeWebhook(Long paymentId, PortOnePaymentInfo pgInfo) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new CustomException(ErrorCode.PAYMENT_NOT_FOUND));
        int attemptNo = paymentAttemptRepository.countByPaymentPaymentId(paymentId) + 1;

        payment.authorize(pgInfo.pgTransactionId());
        payment.complete(pgInfo.receiptUrl(), pgInfo.paidAt());
        payment.getOrder().completePay(payment);

        Long userId = payment.getOrder().getUser().getUserId();
        if (payment.getDiscountCoupon() != null) {
            couponService.useCoupon(payment.getDiscountCoupon().getCouponId(), userId);
        }
        if (payment.getShippingCoupon() != null) {
            couponService.useCoupon(payment.getShippingCoupon().getCouponId(), userId);
        }

        saveAttempt(payment, attemptNo, PaymentStatus.COMPLETED, pgInfo.pgTransactionId(), null);
        log.info("[Webhook] 결제 완료 처리: paymentId={}", paymentId);
    }

    // 결제 실패 후 이력 테이블에 저장
    @Transactional
    public void failWebhook(Long paymentId, String pgTransactionId, String failReason) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new CustomException(ErrorCode.PAYMENT_NOT_FOUND));
        int attemptNo = paymentAttemptRepository.countByPaymentPaymentId(paymentId) + 1;
        payment.fail(failReason);
        saveAttempt(payment, attemptNo, PaymentStatus.FAILED, pgTransactionId, failReason);
    }

    // 결제 실패 후 취소 로그 기록
    @Transactional
    public void recordWebhookFailed(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new CustomException(ErrorCode.PAYMENT_NOT_FOUND));
        payment.fail("웹훅: PG 결제 실패");
        log.info("[Webhook] 결제 실패 처리: paymentId={}", paymentId);
    }

    public record ReconcileTarget(Long paymentId, String idempotencyKey, int totalPaymentPrice) {}

    // ── Reconciliation 스케줄러 (10분마다, 오케스트레이터: 건당 독립 트랜잭션) ──
    @Scheduled(fixedDelay = 600_000)
    public void reconcile() {

        // 미결제 건 탐색
        ZonedDateTime threshold = ZonedDateTime.now().minusMinutes(30);
        List<ReconcileTarget> targets = self.findPendingReconcileTargets(threshold);

        if (targets.isEmpty()) return;

        log.info("[Reconciliation] PENDING 결제 {} 건 처리 시작", targets.size());

        for (ReconcileTarget target : targets) {
            try {
                // PG사에 결제 진위 여부 확인
                PortOnePaymentInfo pgInfo = paymentProvider.getPaymentInfo(target.idempotencyKey());
                // 상태 동기화 및 수습
                self.reconcileOne(target.paymentId(), target.totalPaymentPrice(), pgInfo);
            } catch (Exception e) {
                log.warn("[Reconciliation] 조회 실패: paymentId={}, error={}", target.paymentId(), e.getMessage());
            }
        }
    }

    // 미결제 건 탐색
    @Transactional(readOnly = true)
    public List<ReconcileTarget> findPendingReconcileTargets(ZonedDateTime threshold) {
        return paymentRepository
                .findByPaymentStatusAndCreatedAtBefore(PaymentStatus.PENDING, threshold)
                .stream()
                .map(p -> new ReconcileTarget(p.getPaymentId(), p.getIdempotencyKey(), p.getTotalPaymentPrice()))
                .toList();
    }

    // 상태 동기화 및 수습
    @Transactional
    public void reconcileOne(Long paymentId, int expectedAmount, PortOnePaymentInfo pgInfo) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new CustomException(ErrorCode.PAYMENT_NOT_FOUND));
        int attemptNo = paymentAttemptRepository.countByPaymentPaymentId(paymentId) + 1;

        if ("PAID".equals(pgInfo.status()) && pgInfo.totalAmount() == expectedAmount) {
            payment.authorize(pgInfo.pgTransactionId());
            payment.complete(pgInfo.receiptUrl(), pgInfo.paidAt());
            payment.getOrder().completePay(payment);
            saveAttempt(payment, attemptNo, PaymentStatus.COMPLETED, pgInfo.pgTransactionId(), null);
            log.info("[Reconciliation] 결제 완료 처리: paymentId={}", paymentId);

        } else if ("FAILED".equals(pgInfo.status()) || "CANCELLED".equals(pgInfo.status())) {
            payment.fail("Reconciliation: PG 상태=" + pgInfo.status());
            log.info("[Reconciliation] 결제 실패 처리: paymentId={}", paymentId);
        }
    }

    // ── 내부 헬퍼 ────────────────────────────────────────────────────────────────

    // 결제 실패 이력 로그 저장
    private void saveAttempt(Payment payment, int attemptNo, PaymentStatus status,
                             String pgTransactionId, String failReason) {
        PaymentAttempt attempt = PaymentAttempt.builder()
                .payment(payment)
                .attemptNo(attemptNo)
                .attemptStatus(status)
                .pgTransactionId(pgTransactionId)
                .failReason(failReason)
                .build();
        paymentAttemptRepository.save(attempt);
    }

    // PG사 웹훅 검증
    private void verifyWebhookSignature(String webhookId, String timestamp, String signature, String rawBody) {
        try {
            String message = webhookId + "." + timestamp + "." + rawBody;
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(apiSecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            String computed = Base64.getEncoder().encodeToString(mac.doFinal(message.getBytes(StandardCharsets.UTF_8)));
            if (!computed.equals(signature)) {
                throw new CustomException(ErrorCode.PAYMENT_WEBHOOK_INVALID_SIGNATURE);
            }
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException(ErrorCode.PAYMENT_WEBHOOK_INVALID_SIGNATURE);
        }
    }

    // 사용 가능한 유효한 쿠폰인지 확인
    private Coupon validateCoupon(Long couponId, CouponType expectedType, User user) {

        // 1. Null 체크 : 쿠폰을 안 썼으면 그냥 통과
        if (couponId == null) return null;

        // 2. 존재 체크 : DB에 있는 쿠폰인지 확인
        Coupon coupon = couponRepository.findById(couponId)
                .orElseThrow(() -> new CustomException(ErrorCode.COUPON_NOT_FOUND));

        // 3. 소유권 체크 : 내 쿠폰인지 남의 쿠폰ID를 조작해서 보냈는지 확인
        if (!coupon.getUser().getUserId().equals(user.getUserId())) {
            throw new CustomException(ErrorCode.AUTH_FORBIDDEN);
        }

        // 4. 상태/기한 체크 : 이미 사용했거나, 유효기간이 지났으면 차단
        if (coupon.getStatus() != CouponStatus.AVAILABLE) {
            throw new CustomException(ErrorCode.COUPON_ALREADY_USED);
        }
        if (coupon.getExpiredAt().isBefore(ZonedDateTime.now())) {
            throw new CustomException(ErrorCode.COUPON_EXPIRED);
        }

        // 5. 타입 체크 : 배송비 할인 칸에 일반 상품 할인 쿠폰을 억지로 욱여넣으려 하면 차단
        if (coupon.getCouponMaster().getCouponType() != expectedType) {
            throw new CustomException(ErrorCode.PAYMENT_COUPON_TYPE_MISMATCH);
        }
        return coupon;
    }
}
