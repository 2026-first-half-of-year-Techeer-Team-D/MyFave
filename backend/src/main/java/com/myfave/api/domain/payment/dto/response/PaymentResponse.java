package com.myfave.api.domain.payment.dto.response;

import com.myfave.api.domain.payment.entity.Payment;
import com.myfave.api.domain.payment.entity.PaymentMethod;
import com.myfave.api.domain.payment.entity.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PaymentResponse {

    private Long paymentId;
    private PaymentMethod paymentMethod;
    private Integer totalProductPrice;
    private Integer deliveryFee;
    private Integer discountPrice;
    private Integer totalPaymentPrice;
    private PaymentStatus paymentStatus;

    public static PaymentResponse from(Payment payment) {
        return new PaymentResponse(
                payment.getPaymentId(),
                payment.getPaymentMethod(),
                payment.getTotalProductPrice(),
                payment.getDeliveryFee(),
                payment.getDiscountPrice(),
                payment.getTotalPaymentPrice(),
                payment.getPaymentStatus()
        );
    }
}
