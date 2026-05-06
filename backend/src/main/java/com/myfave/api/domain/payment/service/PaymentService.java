package com.myfave.api.domain.payment.service;

import com.myfave.api.domain.coupon.entity.Coupon;
import com.myfave.api.domain.coupon.entity.CouponStatus;
import com.myfave.api.domain.coupon.entity.CouponType;
import com.myfave.api.domain.coupon.repository.CouponRepository;
import com.myfave.api.domain.order.entity.Order;
import com.myfave.api.domain.order.entity.OrderItem;
import com.myfave.api.domain.order.entity.OrderStatus;
import com.myfave.api.domain.order.repository.OrderItemRepository;
import com.myfave.api.domain.order.repository.OrderRepository;
import com.myfave.api.domain.payment.dto.request.PaymentPrepareRequest;
import com.myfave.api.domain.payment.dto.response.PaymentPrepareResponse;
import com.myfave.api.domain.payment.entity.Payment;
import com.myfave.api.domain.payment.entity.PaymentStatus;
import com.myfave.api.domain.payment.repository.PaymentRepository;
import com.myfave.api.domain.user.entity.User;
import com.myfave.api.domain.user.repository.UserRepository;
import com.myfave.api.global.error.CustomException;
import com.myfave.api.global.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PaymentService {

    private static final int DELIVERY_FEE = 3000;

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CouponRepository couponRepository;
    private final UserRepository userRepository;

    @Value("${portone.channel-key}")
    private String channelKey;

    @Transactional
    public PaymentPrepareResponse preparePayment(Long userId, PaymentPrepareRequest request) {
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

        paymentRepository.findByOrder(order).ifPresent(existing -> {
            if (existing.getPaymentStatus() != PaymentStatus.FAILED &&
                existing.getPaymentStatus() != PaymentStatus.CANCELLED) {
                throw new CustomException(ErrorCode.PAYMENT_ALREADY_DONE);
            }
        });

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

        return PaymentPrepareResponse.of(payment, channelKey);
    }

    private Coupon validateCoupon(Long couponId, CouponType expectedType, User user) {
        if (couponId == null) {
            return null;
        }
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
