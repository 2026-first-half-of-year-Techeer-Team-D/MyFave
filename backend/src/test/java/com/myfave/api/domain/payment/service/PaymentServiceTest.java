package com.myfave.api.domain.payment.service;

import com.myfave.api.domain.coupon.repository.CouponRepository;
import com.myfave.api.domain.coupon.service.CouponService;
import com.myfave.api.domain.order.entity.Order;
import com.myfave.api.domain.order.entity.OrderType;
import com.myfave.api.domain.order.repository.OrderItemRepository;
import com.myfave.api.domain.order.repository.OrderRepository;
import com.myfave.api.domain.payment.dto.request.PaymentPrepareRequest;
import com.myfave.api.domain.payment.provider.PaymentProvider;
import com.myfave.api.domain.payment.repository.PaymentAttemptRepository;
import com.myfave.api.domain.payment.repository.PaymentRepository;
import com.myfave.api.domain.user.entity.User;
import com.myfave.api.domain.user.repository.UserRepository;
import com.myfave.api.global.error.CustomException;
import com.myfave.api.global.error.ErrorCode;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PaymentServiceTest {

    @InjectMocks
    private PaymentService paymentService;

    @Mock private PaymentRepository paymentRepository;
    @Mock private PaymentAttemptRepository paymentAttemptRepository;
    @Mock private OrderRepository orderRepository;
    @Mock private OrderItemRepository orderItemRepository;
    @Mock private CouponRepository couponRepository;
    @Mock private CouponService couponService;
    @Mock private UserRepository userRepository;
    @Mock private PaymentProvider paymentProvider;

    @AfterEach
    void tearDown() {}

    @Test
    @DisplayName("preparePayment: 존재하지 않는 orderId → ORDER_NOT_FOUND")
    void preparePayment_orderNotFound_throwsException() {
        Long userId = 1L;
        PaymentPrepareRequest request = mock(PaymentPrepareRequest.class);
        when(request.getOrderId()).thenReturn(99L);

        User user = User.builder()
                .email("test@test.com").password("pw").name("이름")
                .nickname("nick").phone("01012345678").build();
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(orderRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> paymentService.preparePayment(userId, request))
                .isInstanceOf(CustomException.class)
                .hasFieldOrPropertyWithValue("errorCode", ErrorCode.ORDER_NOT_FOUND);

        verify(orderRepository).findById(99L);
    }

    @Test
    @DisplayName("preparePayment: 다른 사용자의 주문 → AUTH_FORBIDDEN")
    void preparePayment_differentUser_throwsForbidden() {
        Long requestingUserId = 1L;
        PaymentPrepareRequest request = mock(PaymentPrepareRequest.class);
        when(request.getOrderId()).thenReturn(10L);

        User requester = User.builder()
                .email("a@test.com").password("pw").name("요청자")
                .nickname("nick1").phone("01011111111").build();
        ReflectionTestUtils.setField(requester, "userId", requestingUserId);

        User owner = User.builder()
                .email("b@test.com").password("pw").name("소유자")
                .nickname("nick2").phone("01022222222").build();
        ReflectionTestUtils.setField(owner, "userId", 2L);

        Order order = Order.builder()
                .user(owner)
                .orderNumber("ORD-001")
                .orderType(OrderType.DIRECT)
                .build();

        when(userRepository.findById(requestingUserId)).thenReturn(Optional.of(requester));
        when(orderRepository.findById(10L)).thenReturn(Optional.of(order));

        assertThatThrownBy(() -> paymentService.preparePayment(requestingUserId, request))
                .isInstanceOf(CustomException.class)
                .hasFieldOrPropertyWithValue("errorCode", ErrorCode.AUTH_FORBIDDEN);
    }
}
