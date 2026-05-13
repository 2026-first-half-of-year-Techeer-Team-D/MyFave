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
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
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

    // ── 결제 준비 ────────────────────────────────────────────────────────────────
    @Transactional
    public PaymentPrepareResponse preparePayment(Long userId, PaymentPrepareRequest request) {
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

        paymentRepository.findByOrderAndPaymentStatusNotIn(
                order, EnumSet.of(PaymentStatus.FAILED, PaymentStatus.CANCELLED))
                .ifPresent(existing -> { throw new CustomException(ErrorCode.PAYMENT_ALREADY_DONE); });

        Coupon discountCoupon = validateCoupon(request.getDiscountCouponId(), CouponType.DISCOUNT, user);
        Coupon shippingCoupon = validateCoupon(request.getShippingCouponId(), CouponType.SHIPPING, user);

        List<OrderItem> items = orderItemRepository.findByOrder(order);
        int totalProductPrice = items.stream().mapToInt(OrderItem::getPrice).sum();
        int deliveryFee = shippingCoupon != null ? 0 : DELIVERY_FEE;
        int discountPrice = discountCoupon != null
                ? discountCoupon.getCouponMaster().getDiscountPrice()
                : 0;
        int totalPaymentPrice = totalProductPrice + deliveryFee - discountPrice;

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

    // ── 결제 승인 ────────────────────────────────────────────────────────────────
    @Transactional
    public PaymentResponse confirmPayment(Long userId, PaymentConfirmRequest request) {
        if (userId == null) {
            throw new CustomException(ErrorCode.AUTH_UNAUTHORIZED);
        }
        Payment payment = paymentRepository.findById(request.getPaymentId())
                .orElseThrow(() -> new CustomException(ErrorCode.PAYMENT_NOT_FOUND));

        if (!payment.getOrder().getUser().getUserId().equals(userId)) {
            throw new CustomException(ErrorCode.AUTH_FORBIDDEN);
        }

        if (payment.getPaymentStatus() != PaymentStatus.PENDING &&
            payment.getPaymentStatus() != PaymentStatus.AUTHORIZED) {
            throw new CustomException(ErrorCode.PAYMENT_INVALID_STATUS);
        }

        // PortOne API 조회
        PortOnePaymentInfo pgInfo = paymentProvider.getPaymentInfo(request.getPgTransactionId());

        int attemptNo = paymentAttemptRepository.countByPaymentPaymentId(payment.getPaymentId()) + 1;

        // 금액 불일치 또는 PG 결제 실패
        if (!"PAID".equals(pgInfo.status()) || pgInfo.totalAmount() != payment.getTotalPaymentPrice()) {
            if ("PAID".equals(pgInfo.status())) {
                // 금액 불일치 → 자동 환불
                paymentProvider.cancelPayment(pgInfo.pgTransactionId(), pgInfo.totalAmount(), "금액 불일치 자동 환불");
            }
            String failReason = "PG상태: " + pgInfo.status() +
                    ", 예상금액: " + payment.getTotalPaymentPrice() +
                    ", 실제금액: " + pgInfo.totalAmount();
            payment.fail(failReason);
            saveAttempt(payment, attemptNo, PaymentStatus.FAILED, pgInfo.pgTransactionId(), failReason);
            throw new CustomException(ErrorCode.PAYMENT_AMOUNT_MISMATCH);
        }

        // 금액 일치 → 결제 완료
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
        log.info("[Payment] 결제 완료: paymentId={}, orderId={}", payment.getPaymentId(), payment.getOrder().getOrderId());

        return PaymentResponse.from(payment);
    }

    // ── 결제 단건 조회 ────────────────────────────────────────────────────────────
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

    // ── 결제 취소/환불 ────────────────────────────────────────────────────────────
    @Transactional
    public PaymentResponse cancelPayment(Long userId, Long paymentId, PaymentCancelRequest request) {
        if (userId == null) {
            throw new CustomException(ErrorCode.AUTH_UNAUTHORIZED);
        }
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

        paymentProvider.cancelPayment(payment.getPgTransactionId(), cancelAmount, request.getReason());

        if (fullCancel) {
            payment.partialCancel(cancelAmount);
            payment.cancel();
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
                payment.getPaymentId(), cancelAmount, fullCancel);
        return PaymentResponse.from(payment);
    }

    // ── 웹훅 처리 ────────────────────────────────────────────────────────────────
    @Transactional
    public void processWebhook(String webhookId, String timestamp, String signature,
                               String rawBody, PaymentWebhookRequest request) {
        verifyWebhookSignature(webhookId, timestamp, signature, rawBody);

        String pgTransactionId = request.getData().getPaymentId();
        Payment payment = paymentRepository.findByPgTransactionId(pgTransactionId).orElse(null);

        if (payment == null) {
            log.warn("[Webhook] 결제 정보 없음: pgTransactionId={}", pgTransactionId);
            return;
        }

        if (payment.getPaymentStatus() == PaymentStatus.COMPLETED) {
            log.info("[Webhook] 이미 처리된 결제: paymentId={}", payment.getPaymentId());
            return;
        }

        if ("Transaction.Paid".equals(request.getType())) {
            PortOnePaymentInfo pgInfo = paymentProvider.getPaymentInfo(pgTransactionId);
            int attemptNo = paymentAttemptRepository.countByPaymentPaymentId(payment.getPaymentId()) + 1;

            if (pgInfo.totalAmount() != payment.getTotalPaymentPrice()) {
                paymentProvider.cancelPayment(pgTransactionId, pgInfo.totalAmount(), "웹훅: 금액 불일치 자동 환불");
                payment.fail("웹훅 금액 불일치");
                saveAttempt(payment, attemptNo, PaymentStatus.FAILED, pgTransactionId, "웹훅 금액 불일치");
                return;
            }

            payment.authorize(pgTransactionId);
            payment.complete(pgInfo.receiptUrl(), pgInfo.paidAt());
            payment.getOrder().completePay(payment);

            Long userId = payment.getOrder().getUser().getUserId();
            if (payment.getDiscountCoupon() != null) {
                couponService.useCoupon(payment.getDiscountCoupon().getCouponId(), userId);
            }
            if (payment.getShippingCoupon() != null) {
                couponService.useCoupon(payment.getShippingCoupon().getCouponId(), userId);
            }

            saveAttempt(payment, attemptNo, PaymentStatus.COMPLETED, pgTransactionId, null);
            log.info("[Webhook] 결제 완료 처리: paymentId={}", payment.getPaymentId());

        } else if ("Transaction.Failed".equals(request.getType())) {
            payment.fail("웹훅: PG 결제 실패");
            log.info("[Webhook] 결제 실패 처리: paymentId={}", payment.getPaymentId());
        }
    }

    // ── Reconciliation 스케줄러 (10분마다) ──────────────────────────────────────
    @Scheduled(fixedDelay = 600_000)
    @Transactional
    public void reconcile() {
        ZonedDateTime threshold = ZonedDateTime.now().minusMinutes(30);
        List<Payment> pendingPayments = paymentRepository
                .findByPaymentStatusAndCreatedAtBefore(PaymentStatus.PENDING, threshold);

        if (pendingPayments.isEmpty()) return;

        log.info("[Reconciliation] PENDING 결제 {} 건 처리 시작", pendingPayments.size());

        for (Payment payment : pendingPayments) {
            try {
                PortOnePaymentInfo pgInfo = paymentProvider.getPaymentInfo(payment.getIdempotencyKey());
                int attemptNo = paymentAttemptRepository.countByPaymentPaymentId(payment.getPaymentId()) + 1;

                if ("PAID".equals(pgInfo.status()) && pgInfo.totalAmount() == payment.getTotalPaymentPrice()) {
                    payment.authorize(pgInfo.pgTransactionId());
                    payment.complete(pgInfo.receiptUrl(), pgInfo.paidAt());
                    payment.getOrder().completePay(payment);
                    saveAttempt(payment, attemptNo, PaymentStatus.COMPLETED, pgInfo.pgTransactionId(), null);
                    log.info("[Reconciliation] 결제 완료 처리: paymentId={}", payment.getPaymentId());

                } else if ("FAILED".equals(pgInfo.status()) || "CANCELLED".equals(pgInfo.status())) {
                    payment.fail("Reconciliation: PG 상태=" + pgInfo.status());
                    log.info("[Reconciliation] 결제 실패 처리: paymentId={}", payment.getPaymentId());
                }
            } catch (Exception e) {
                log.warn("[Reconciliation] 조회 실패: paymentId={}, error={}", payment.getPaymentId(), e.getMessage());
            }
        }
    }

    // ── 내부 헬퍼 ────────────────────────────────────────────────────────────────
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

    private Coupon validateCoupon(Long couponId, CouponType expectedType, User user) {
        if (couponId == null) return null;

        Coupon coupon = couponRepository.findById(couponId)
                .orElseThrow(() -> new CustomException(ErrorCode.COUPON_NOT_FOUND));

        if (!coupon.getUser().getUserId().equals(user.getUserId())) {
            throw new CustomException(ErrorCode.AUTH_FORBIDDEN);
        }
        if (coupon.getStatus() != CouponStatus.AVAILABLE) {
            throw new CustomException(ErrorCode.COUPON_ALREADY_USED);
        }
        if (coupon.getExpiredAt().isBefore(ZonedDateTime.now())) {
            throw new CustomException(ErrorCode.COUPON_EXPIRED);
        }
        if (coupon.getCouponMaster().getCouponType() != expectedType) {
            throw new CustomException(ErrorCode.PAYMENT_COUPON_TYPE_MISMATCH);
        }
        return coupon;
    }
}
