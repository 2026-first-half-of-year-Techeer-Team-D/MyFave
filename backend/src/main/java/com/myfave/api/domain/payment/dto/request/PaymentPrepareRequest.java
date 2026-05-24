package com.myfave.api.domain.payment.dto.request;

import com.myfave.api.domain.payment.entity.PaymentMethod;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class PaymentPrepareRequest {

    public enum DeviceType { PC, MOBILE }

    @NotNull
    private Long orderId;

    @NotNull
    private PaymentMethod paymentMethod;

    private Long discountCouponId;   // null = 할인 쿠폰 미사용

    private Long shippingCouponId;   // null = 배송비 쿠폰 미사용

    // null = PC 폴백 (기존 클라이언트 호환)
    private DeviceType deviceType;
}