package com.myfave.api.domain.payment.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.myfave.api.domain.coupon.entity.Coupon;
import com.myfave.api.domain.coupon.entity.CouponMaster;
import com.myfave.api.domain.coupon.entity.CouponStatus;
import com.myfave.api.domain.coupon.entity.CouponType;
import com.myfave.api.domain.coupon.repository.CouponRepository;
import com.myfave.api.domain.order.entity.Order;
import com.myfave.api.domain.payment.dto.request.PaymentConfirmRequest;
import com.myfave.api.domain.payment.dto.request.PaymentPrepareRequest;
import com.myfave.api.domain.payment.dto.response.PaymentPrepareResponse;
import com.myfave.api.domain.payment.dto.response.PaymentResponse;
import com.myfave.api.domain.payment.entity.Payment;
import com.myfave.api.domain.payment.entity.PaymentStatus;
import com.myfave.api.domain.payment.provider.PaymentProvider.PortOnePaymentInfo;
import com.myfave.api.domain.payment.repository.PaymentRepository;
import com.myfave.api.domain.payment.service.PaymentService;
import com.myfave.api.domain.product.entity.Product;
import com.myfave.api.domain.user.entity.User;
import com.myfave.api.global.error.CustomException;
import com.myfave.api.global.error.ErrorCode;
import com.myfave.api.support.IntegrationTestSupport;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.ZonedDateTime;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;

class PaymentCouponIntegrationTest extends IntegrationTestSupport {

    private static final int PRODUCT_PRICE = 10_000;
    private static final int DELIVERY_FEE = 3_000;    // PaymentService 내부 상수와 일치
    private static final int DISCOUNT_AMOUNT = 5_000;

    @Autowired private PaymentService paymentService;
    @Autowired private PaymentRepository paymentRepository;
    @Autowired private CouponRepository couponRepository;
    @Autowired private ObjectMapper objectMapper;

    // ──────────────────────────────────────────────────────────────────
    // Forward — 쿠폰이 정상 사용되는가
    // ──────────────────────────────────────────────────────────────────

    @Test
    @DisplayName("F1: 할인 쿠폰만 적용 → 쿠폰 USED + discountPrice 반영")
    void f1_discountCouponOnly() {
        User buyer = testDataFactory.createUser("buyer");
        Product product = testDataFactory.createProduct(buyer, PRODUCT_PRICE);
        Order order = testDataFactory.createPendingOrder(buyer, product);
        CouponMaster master = testDataFactory.createCouponMaster("할인5천", CouponType.DISCOUNT, DISCOUNT_AMOUNT, true);
        Coupon coupon = testDataFactory.issueCoupon(buyer, master, ZonedDateTime.now().plusDays(7));

        int expected = PRODUCT_PRICE + DELIVERY_FEE - DISCOUNT_AMOUNT;
        PaymentPrepareResponse prepare = prepare(buyer, order, coupon.getCouponId(), null);
        assertThat(prepare.getDiscountPrice()).isEqualTo(DISCOUNT_AMOUNT);
        assertThat(prepare.getDeliveryFee()).isEqualTo(DELIVERY_FEE);
        assertThat(prepare.getTotalPaymentPrice()).isEqualTo(expected);

        PaymentResponse confirm = confirmAsPaid(buyer, prepare, expected, "pg-f1");
        assertThat(confirm.getPaymentStatus()).isEqualTo(PaymentStatus.COMPLETED);
        assertThat(couponRepository.findById(coupon.getCouponId()).orElseThrow().getStatus())
                .isEqualTo(CouponStatus.USED);
    }

    @Test
    @DisplayName("F2: 배송비 쿠폰만 적용 → 쿠폰 USED + deliveryFee=0")
    void f2_shippingCouponOnly() {
        User buyer = testDataFactory.createUser("buyer");
        Product product = testDataFactory.createProduct(buyer, PRODUCT_PRICE);
        Order order = testDataFactory.createPendingOrder(buyer, product);
        CouponMaster master = testDataFactory.createCouponMaster("배송비무료", CouponType.SHIPPING, DELIVERY_FEE, true);
        Coupon coupon = testDataFactory.issueCoupon(buyer, master, ZonedDateTime.now().plusDays(7));

        int expected = PRODUCT_PRICE; // deliveryFee=0, discount 없음
        PaymentPrepareResponse prepare = prepare(buyer, order, null, coupon.getCouponId());
        assertThat(prepare.getDeliveryFee()).isEqualTo(0);
        assertThat(prepare.getDiscountPrice()).isEqualTo(0);
        assertThat(prepare.getTotalPaymentPrice()).isEqualTo(expected);

        confirmAsPaid(buyer, prepare, expected, "pg-f2");
        assertThat(couponRepository.findById(coupon.getCouponId()).orElseThrow().getStatus())
                .isEqualTo(CouponStatus.USED);
    }

    @Test
    @DisplayName("F3: 할인 + 배송비 동시 적용 → 둘 다 USED + 금액 합산 정확")
    void f3_bothCoupons() {
        User buyer = testDataFactory.createUser("buyer");
        Product product = testDataFactory.createProduct(buyer, PRODUCT_PRICE);
        Order order = testDataFactory.createPendingOrder(buyer, product);
        CouponMaster discMaster = testDataFactory.createCouponMaster("할인5천", CouponType.DISCOUNT, DISCOUNT_AMOUNT, true);
        CouponMaster shipMaster = testDataFactory.createCouponMaster("배송비무료", CouponType.SHIPPING, DELIVERY_FEE, true);
        Coupon disc = testDataFactory.issueCoupon(buyer, discMaster, ZonedDateTime.now().plusDays(7));
        Coupon ship = testDataFactory.issueCoupon(buyer, shipMaster, ZonedDateTime.now().plusDays(7));

        int expected = PRODUCT_PRICE - DISCOUNT_AMOUNT; // 배송비 0
        PaymentPrepareResponse prepare = prepare(buyer, order, disc.getCouponId(), ship.getCouponId());
        assertThat(prepare.getTotalPaymentPrice()).isEqualTo(expected);

        confirmAsPaid(buyer, prepare, expected, "pg-f3");
        assertThat(couponRepository.findById(disc.getCouponId()).orElseThrow().getStatus())
                .isEqualTo(CouponStatus.USED);
        assertThat(couponRepository.findById(ship.getCouponId()).orElseThrow().getStatus())
                .isEqualTo(CouponStatus.USED);
    }

    @Test
    @DisplayName("F4: 쿠폰 미적용 결제 — prepare/confirm 모두 성공, Payment 쿠폰 필드 null")
    void f4_noCoupon() {
        User buyer = testDataFactory.createUser("buyer");
        Product product = testDataFactory.createProduct(buyer, PRODUCT_PRICE);
        Order order = testDataFactory.createPendingOrder(buyer, product);

        int expected = PRODUCT_PRICE + DELIVERY_FEE;
        PaymentPrepareResponse prepare = prepare(buyer, order, null, null);
        assertThat(prepare.getDiscountPrice()).isEqualTo(0);
        assertThat(prepare.getDeliveryFee()).isEqualTo(DELIVERY_FEE);
        assertThat(prepare.getTotalPaymentPrice()).isEqualTo(expected);

        PaymentResponse confirm = confirmAsPaid(buyer, prepare, expected, "pg-f4");
        assertThat(confirm.getPaymentStatus()).isEqualTo(PaymentStatus.COMPLETED);

        Payment saved = paymentRepository.findById(prepare.getPaymentId()).orElseThrow();
        assertThat(saved.getDiscountCoupon()).isNull();
        assertThat(saved.getShippingCoupon()).isNull();
    }

    // ──────────────────────────────────────────────────────────────────
    // Guard — 잘못된 쿠폰 차단
    // ──────────────────────────────────────────────────────────────────

    @Test
    @DisplayName("G1: 만료된 쿠폰 적용 시도 → COUPON_EXPIRED")
    void g1_expiredCoupon() {
        User buyer = testDataFactory.createUser("buyer");
        Product product = testDataFactory.createProduct(buyer, PRODUCT_PRICE);
        Order order = testDataFactory.createPendingOrder(buyer, product);
        CouponMaster master = testDataFactory.createCouponMaster("할인5천", CouponType.DISCOUNT, DISCOUNT_AMOUNT, true);
        Coupon expired = testDataFactory.issueExpiredCoupon(buyer, master);

        assertThatThrownBy(() -> prepare(buyer, order, expired.getCouponId(), null))
                .isInstanceOf(CustomException.class)
                .hasFieldOrPropertyWithValue("errorCode", ErrorCode.COUPON_EXPIRED);
    }

    @Test
    @DisplayName("G2: 타입 불일치 (DISCOUNT 슬롯에 SHIPPING 쿠폰) → PAYMENT_COUPON_TYPE_MISMATCH")
    void g2_typeMismatch() {
        User buyer = testDataFactory.createUser("buyer");
        Product product = testDataFactory.createProduct(buyer, PRODUCT_PRICE);
        Order order = testDataFactory.createPendingOrder(buyer, product);
        CouponMaster shippingMaster = testDataFactory.createCouponMaster("배송비무료", CouponType.SHIPPING, DELIVERY_FEE, true);
        Coupon ship = testDataFactory.issueCoupon(buyer, shippingMaster, ZonedDateTime.now().plusDays(7));

        // SHIPPING 쿠폰을 discountCouponId(=DISCOUNT 슬롯)에 넣음
        assertThatThrownBy(() -> prepare(buyer, order, ship.getCouponId(), null))
                .isInstanceOf(CustomException.class)
                .hasFieldOrPropertyWithValue("errorCode", ErrorCode.PAYMENT_COUPON_TYPE_MISMATCH);
    }

    @Test
    @DisplayName("G3: 소유자 아닌 쿠폰 적용 → AUTH_FORBIDDEN")
    void g3_notOwner() {
        User buyer = testDataFactory.createUser("buyer");
        User otherUser = testDataFactory.createUser("other");
        Product product = testDataFactory.createProduct(buyer, PRODUCT_PRICE);
        Order order = testDataFactory.createPendingOrder(buyer, product);
        CouponMaster master = testDataFactory.createCouponMaster("할인5천", CouponType.DISCOUNT, DISCOUNT_AMOUNT, true);
        Coupon othersCoupon = testDataFactory.issueCoupon(otherUser, master, ZonedDateTime.now().plusDays(7));

        assertThatThrownBy(() -> prepare(buyer, order, othersCoupon.getCouponId(), null))
                .isInstanceOf(CustomException.class)
                .hasFieldOrPropertyWithValue("errorCode", ErrorCode.AUTH_FORBIDDEN);
    }

    @Test
    @DisplayName("G4: 이미 사용된(USED) 쿠폰 재적용 → COUPON_ALREADY_USED")
    void g4_alreadyUsed() {
        User buyer = testDataFactory.createUser("buyer");
        Product product = testDataFactory.createProduct(buyer, PRODUCT_PRICE);
        Order order = testDataFactory.createPendingOrder(buyer, product);
        CouponMaster master = testDataFactory.createCouponMaster("할인5천", CouponType.DISCOUNT, DISCOUNT_AMOUNT, true);
        Coupon used = testDataFactory.issueUsedCoupon(buyer, master);

        assertThatThrownBy(() -> prepare(buyer, order, used.getCouponId(), null))
                .isInstanceOf(CustomException.class)
                .hasFieldOrPropertyWithValue("errorCode", ErrorCode.COUPON_ALREADY_USED);
    }

    // ──────────────────────────────────────────────────────────────────
    // Negative Path — 결제 실패 시 쿠폰이 잘못 USED 되지 않는가
    // ──────────────────────────────────────────────────────────────────

    @Test
    @DisplayName("N1: PG 금액 불일치 → 결제 실패 + 쿠폰 AVAILABLE 유지")
    void n1_pgAmountMismatch() {
        User buyer = testDataFactory.createUser("buyer");
        Product product = testDataFactory.createProduct(buyer, PRODUCT_PRICE);
        Order order = testDataFactory.createPendingOrder(buyer, product);
        CouponMaster master = testDataFactory.createCouponMaster("할인5천", CouponType.DISCOUNT, DISCOUNT_AMOUNT, true);
        Coupon coupon = testDataFactory.issueCoupon(buyer, master, ZonedDateTime.now().plusDays(7));

        PaymentPrepareResponse prepare = prepare(buyer, order, coupon.getCouponId(), null);
        int wrongAmount = prepare.getTotalPaymentPrice() + 1_000;

        given(paymentProvider.getPaymentInfo(anyString())).willReturn(new PortOnePaymentInfo(
                "pg-n1", "PAID", wrongAmount, "https://receipt", ZonedDateTime.now()
        ));
        PaymentConfirmRequest confirmReq = readJson("""
                {"paymentId": %d, "pgTransactionId": "pg-n1"}
                """.formatted(prepare.getPaymentId()), PaymentConfirmRequest.class);

        assertThatThrownBy(() -> paymentService.confirmPayment(buyer.getUserId(), confirmReq))
                .isInstanceOf(CustomException.class)
                .hasFieldOrPropertyWithValue("errorCode", ErrorCode.PAYMENT_AMOUNT_MISMATCH);

        assertThat(couponRepository.findById(coupon.getCouponId()).orElseThrow().getStatus())
                .isEqualTo(CouponStatus.AVAILABLE);
    }

    @Test
    @DisplayName("N2: PG 상태가 PAID 아님 (FAILED) → 결제 실패 + 쿠폰 AVAILABLE 유지")
    void n2_pgNotPaid() {
        User buyer = testDataFactory.createUser("buyer");
        Product product = testDataFactory.createProduct(buyer, PRODUCT_PRICE);
        Order order = testDataFactory.createPendingOrder(buyer, product);
        CouponMaster master = testDataFactory.createCouponMaster("할인5천", CouponType.DISCOUNT, DISCOUNT_AMOUNT, true);
        Coupon coupon = testDataFactory.issueCoupon(buyer, master, ZonedDateTime.now().plusDays(7));

        PaymentPrepareResponse prepare = prepare(buyer, order, coupon.getCouponId(), null);

        // 금액은 일치, status만 PAID 아님
        given(paymentProvider.getPaymentInfo(anyString())).willReturn(new PortOnePaymentInfo(
                "pg-n2", "FAILED", prepare.getTotalPaymentPrice(), null, null
        ));
        PaymentConfirmRequest confirmReq = readJson("""
                {"paymentId": %d, "pgTransactionId": "pg-n2"}
                """.formatted(prepare.getPaymentId()), PaymentConfirmRequest.class);

        assertThatThrownBy(() -> paymentService.confirmPayment(buyer.getUserId(), confirmReq))
                .isInstanceOf(CustomException.class)
                .hasFieldOrPropertyWithValue("errorCode", ErrorCode.PAYMENT_AMOUNT_MISMATCH);

        assertThat(couponRepository.findById(coupon.getCouponId()).orElseThrow().getStatus())
                .isEqualTo(CouponStatus.AVAILABLE);
    }

    // ──────────────────────────────────────────────────────────────────
    // 헬퍼
    // ──────────────────────────────────────────────────────────────────

    private PaymentPrepareResponse prepare(User buyer, Order order, Long discountId, Long shippingId) {
        PaymentPrepareRequest req = readJson("""
                {"orderId": %d, "paymentMethod": "CARD",
                 "discountCouponId": %s, "shippingCouponId": %s}
                """.formatted(
                        order.getOrderId(),
                        discountId == null ? "null" : discountId.toString(),
                        shippingId == null ? "null" : shippingId.toString()
                ), PaymentPrepareRequest.class);
        return paymentService.preparePayment(buyer.getUserId(), req);
    }

    private PaymentResponse confirmAsPaid(User buyer, PaymentPrepareResponse prepare, int amount, String pgTxId) {
        given(paymentProvider.getPaymentInfo(anyString())).willReturn(new PortOnePaymentInfo(
                pgTxId, "PAID", amount, "https://receipt", ZonedDateTime.now()
        ));
        PaymentConfirmRequest req = readJson("""
                {"paymentId": %d, "pgTransactionId": "%s"}
                """.formatted(prepare.getPaymentId(), pgTxId), PaymentConfirmRequest.class);
        return paymentService.confirmPayment(buyer.getUserId(), req);
    }

    private <T> T readJson(String json, Class<T> type) {
        try {
            return objectMapper.readValue(json, type);
        } catch (Exception e) {
            throw new IllegalStateException("Test JSON parse failed", e);
        }
    }
}
