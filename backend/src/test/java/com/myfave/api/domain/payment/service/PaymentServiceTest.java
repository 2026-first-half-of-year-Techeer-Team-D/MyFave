package com.myfave.api.domain.payment.service;

import com.myfave.api.domain.coupon.entity.Coupon;
import com.myfave.api.domain.coupon.repository.CouponRepository;
import com.myfave.api.domain.coupon.service.CouponService;
import com.myfave.api.domain.order.entity.Order;
import com.myfave.api.domain.order.repository.OrderItemRepository;
import com.myfave.api.domain.order.repository.OrderRepository;
import com.myfave.api.domain.payment.dto.request.PaymentCancelRequest;
import com.myfave.api.domain.payment.dto.response.PaymentResponse;
import com.myfave.api.domain.payment.entity.Payment;
import com.myfave.api.domain.payment.entity.PaymentStatus;
import com.myfave.api.domain.payment.provider.PaymentProvider;
import com.myfave.api.domain.payment.repository.PaymentAttemptRepository;
import com.myfave.api.domain.payment.repository.PaymentRepository;
import com.myfave.api.domain.user.entity.User;
import com.myfave.api.domain.user.repository.UserRepository;
import com.myfave.api.global.error.CustomException;
import com.myfave.api.global.error.ErrorCode;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class PaymentServiceTest {

    @Mock private PaymentRepository paymentRepository;
    @Mock private PaymentAttemptRepository paymentAttemptRepository;
    @Mock private OrderRepository orderRepository;
    @Mock private OrderItemRepository orderItemRepository;
    @Mock private CouponRepository couponRepository;
    @Mock private CouponService couponService;
    @Mock private UserRepository userRepository;
    @Mock private PaymentProvider paymentProvider;

    @InjectMocks
    private PaymentService paymentService;

    private static final Long PAYMENT_ID = 100L;
    private static final Long OWNER_ID = 1L;
    private static final Long OTHER_USER_ID = 2L;
    private static final String PG_TX_ID = "TX-123";

    private Payment mockPayment(PaymentStatus status, int totalPrice, int refundedAmount,
                                Long ownerId, Coupon discountCoupon, Coupon shippingCoupon) {
        Payment payment = mock(Payment.class);
        Order order = mock(Order.class);
        User user = mock(User.class);

        lenient().when(payment.getOrder()).thenReturn(order);
        lenient().when(order.getUser()).thenReturn(user);
        lenient().when(user.getUserId()).thenReturn(ownerId);
        lenient().when(payment.getPaymentStatus()).thenReturn(status);
        lenient().when(payment.getTotalPaymentPrice()).thenReturn(totalPrice);
        lenient().when(payment.getRefundedAmount()).thenReturn(refundedAmount);
        lenient().when(payment.getPgTransactionId()).thenReturn(PG_TX_ID);
        lenient().when(payment.getDiscountCoupon()).thenReturn(discountCoupon);
        lenient().when(payment.getShippingCoupon()).thenReturn(shippingCoupon);
        return payment;
    }

    private Coupon mockCoupon(Long couponId) {
        Coupon coupon = mock(Coupon.class);
        lenient().when(coupon.getCouponId()).thenReturn(couponId);
        return coupon;
    }

    private PaymentCancelRequest mockCancelRequest(String reason, Integer refundAmount) {
        PaymentCancelRequest request = mock(PaymentCancelRequest.class);
        lenient().when(request.getReason()).thenReturn(reason);
        lenient().when(request.getRefundAmount()).thenReturn(refundAmount);
        return request;
    }

    // ================== getPayment ==================

    @Test
    @DisplayName("getPayment 성공 - 본인 결제 조회 시 PaymentResponse 반환")
    void getPayment_success() {
        // given
        Payment payment = mockPayment(PaymentStatus.COMPLETED, 10000, 0, OWNER_ID, null, null);
        given(paymentRepository.findById(PAYMENT_ID)).willReturn(Optional.of(payment));

        // when
        PaymentResponse response = paymentService.getPayment(OWNER_ID, PAYMENT_ID);

        // then
        assertThat(response).isNotNull();
    }

    @Test
    @DisplayName("getPayment 실패 - 존재하지 않는 결제면 PAYMENT_NOT_FOUND")
    void getPayment_notFound() {
        // given
        given(paymentRepository.findById(PAYMENT_ID)).willReturn(Optional.empty());

        // when & then
        assertThatThrownBy(() -> paymentService.getPayment(OWNER_ID, PAYMENT_ID))
                .isInstanceOf(CustomException.class)
                .satisfies(ex -> assertThat(((CustomException) ex).getErrorCode())
                        .isEqualTo(ErrorCode.PAYMENT_NOT_FOUND));
    }

    @Test
    @DisplayName("getPayment 실패 - 타인 결제 조회 시 AUTH_FORBIDDEN")
    void getPayment_notOwner() {
        // given
        Payment payment = mockPayment(PaymentStatus.COMPLETED, 10000, 0, OWNER_ID, null, null);
        given(paymentRepository.findById(PAYMENT_ID)).willReturn(Optional.of(payment));

        // when & then
        assertThatThrownBy(() -> paymentService.getPayment(OTHER_USER_ID, PAYMENT_ID))
                .isInstanceOf(CustomException.class)
                .satisfies(ex -> assertThat(((CustomException) ex).getErrorCode())
                        .isEqualTo(ErrorCode.AUTH_FORBIDDEN));
    }

    // ================== cancelPayment ==================

    @Test
    @DisplayName("cancelPayment 성공 - 전체 취소 시 Payment.cancel + Order.cancel + 쿠폰 2개 복구")
    void cancelPayment_fullCancel_success() {
        // given
        Coupon discountCoupon = mockCoupon(10L);
        Coupon shippingCoupon = mockCoupon(20L);
        Payment payment = mockPayment(PaymentStatus.COMPLETED, 10000, 0, OWNER_ID, discountCoupon, shippingCoupon);
        given(paymentRepository.findById(PAYMENT_ID)).willReturn(Optional.of(payment));

        PaymentCancelRequest request = mockCancelRequest("고객변심", null); // refundAmount null = 잔액 전체

        // when
        PaymentResponse response = paymentService.cancelPayment(OWNER_ID, PAYMENT_ID, request);

        // then
        verify(paymentProvider).cancelPayment(PG_TX_ID, 10000, "고객변심");
        verify(payment).cancel();
        verify(payment.getOrder()).cancel();
        verify(couponService).restoreCoupon(10L, OWNER_ID);
        verify(couponService).restoreCoupon(20L, OWNER_ID);
        verify(payment, never()).partialCancel(anyInt());
        assertThat(response).isNotNull();
    }

    @Test
    @DisplayName("cancelPayment 성공 - 부분 취소 시 Payment.partialCancel만 호출, 주문/쿠폰 미변경")
    void cancelPayment_partialCancel_success() {
        // given
        Payment payment = mockPayment(PaymentStatus.COMPLETED, 10000, 0, OWNER_ID,
                mockCoupon(10L), mockCoupon(20L));
        given(paymentRepository.findById(PAYMENT_ID)).willReturn(Optional.of(payment));

        PaymentCancelRequest request = mockCancelRequest("부분환불", 3000);

        // when
        paymentService.cancelPayment(OWNER_ID, PAYMENT_ID, request);

        // then
        verify(paymentProvider).cancelPayment(PG_TX_ID, 3000, "부분환불");
        verify(payment).partialCancel(3000);
        verify(payment, never()).cancel();
        verify(payment.getOrder(), never()).cancel();
        verify(couponService, never()).restoreCoupon(anyLong(), anyLong());
    }

    @Test
    @DisplayName("cancelPayment 성공 - 부분 취소 누적이 전체에 도달하면 전체 취소 분기로 처리")
    void cancelPayment_accumulatedReachesFull_treatedAsFullCancel() {
        // given (이미 7000 환불됨, 나머지 3000을 취소 → 누적 10000 = 전체)
        Coupon discountCoupon = mockCoupon(10L);
        Payment payment = mockPayment(PaymentStatus.PARTIAL_CANCELLED, 10000, 7000, OWNER_ID,
                discountCoupon, null);
        given(paymentRepository.findById(PAYMENT_ID)).willReturn(Optional.of(payment));

        PaymentCancelRequest request = mockCancelRequest("잔액환불", 3000);

        // when
        paymentService.cancelPayment(OWNER_ID, PAYMENT_ID, request);

        // then
        verify(paymentProvider).cancelPayment(PG_TX_ID, 3000, "잔액환불");
        verify(payment).cancel();
        verify(payment.getOrder()).cancel();
        verify(couponService).restoreCoupon(10L, OWNER_ID);
        verify(payment, never()).partialCancel(anyInt());
    }

    @Test
    @DisplayName("cancelPayment 실패 - 존재하지 않는 결제면 PAYMENT_NOT_FOUND")
    void cancelPayment_notFound() {
        // given
        given(paymentRepository.findById(PAYMENT_ID)).willReturn(Optional.empty());
        PaymentCancelRequest request = mockCancelRequest("이유", null);

        // when & then
        assertThatThrownBy(() -> paymentService.cancelPayment(OWNER_ID, PAYMENT_ID, request))
                .isInstanceOf(CustomException.class)
                .satisfies(ex -> assertThat(((CustomException) ex).getErrorCode())
                        .isEqualTo(ErrorCode.PAYMENT_NOT_FOUND));
        verify(paymentProvider, never()).cancelPayment(anyString(), anyInt(), anyString());
    }

    @Test
    @DisplayName("cancelPayment 실패 - 타인 결제 취소 시 AUTH_FORBIDDEN")
    void cancelPayment_notOwner() {
        // given
        Payment payment = mockPayment(PaymentStatus.COMPLETED, 10000, 0, OWNER_ID, null, null);
        given(paymentRepository.findById(PAYMENT_ID)).willReturn(Optional.of(payment));
        PaymentCancelRequest request = mockCancelRequest("이유", null);

        // when & then
        assertThatThrownBy(() -> paymentService.cancelPayment(OTHER_USER_ID, PAYMENT_ID, request))
                .isInstanceOf(CustomException.class)
                .satisfies(ex -> assertThat(((CustomException) ex).getErrorCode())
                        .isEqualTo(ErrorCode.AUTH_FORBIDDEN));
        verify(paymentProvider, never()).cancelPayment(anyString(), anyInt(), anyString());
    }

    @Test
    @DisplayName("cancelPayment 실패 - PENDING 상태면 PAYMENT_INVALID_STATUS")
    void cancelPayment_invalidStatus() {
        // given (PENDING은 취소 불가)
        Payment payment = mockPayment(PaymentStatus.PENDING, 10000, 0, OWNER_ID, null, null);
        given(paymentRepository.findById(PAYMENT_ID)).willReturn(Optional.of(payment));
        PaymentCancelRequest request = mockCancelRequest("이유", null);

        // when & then
        assertThatThrownBy(() -> paymentService.cancelPayment(OWNER_ID, PAYMENT_ID, request))
                .isInstanceOf(CustomException.class)
                .satisfies(ex -> assertThat(((CustomException) ex).getErrorCode())
                        .isEqualTo(ErrorCode.PAYMENT_INVALID_STATUS));
        verify(paymentProvider, never()).cancelPayment(anyString(), anyInt(), anyString());
    }

    @Test
    @DisplayName("cancelPayment 성공 - 쿠폰 없는 전체 취소 시 restoreCoupon 미호출")
    void cancelPayment_fullCancelWithoutCoupons_noCouponRestore() {
        // given
        Payment payment = mockPayment(PaymentStatus.COMPLETED, 10000, 0, OWNER_ID, null, null);
        given(paymentRepository.findById(PAYMENT_ID)).willReturn(Optional.of(payment));
        PaymentCancelRequest request = mockCancelRequest("이유", null);

        // when
        paymentService.cancelPayment(OWNER_ID, PAYMENT_ID, request);

        // then
        verify(payment).cancel();
        verify(payment.getOrder()).cancel();
        verify(couponService, never()).restoreCoupon(anyLong(), anyLong());
    }
}
