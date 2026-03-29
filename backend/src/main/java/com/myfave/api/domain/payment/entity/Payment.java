package com.myfave.api.domain.payment.entity;

import com.myfave.api.domain.coupon.entity.Coupon;
import com.myfave.api.domain.order.entity.Order;
import com.myfave.api.global.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "payments")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Payment extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_id")
    private Long paymentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "orders_id", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "coupon_id")
    private Coupon coupon;   // NULL = 쿠폰 미사용

    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;

    @Column(nullable = false)
    private Integer totalProductPrice = 0;

    @Column(nullable = false)
    private Integer deliveryFee = 0;

    @Column(nullable = false)
    private Integer discountPrice = 0;

    @Column(nullable = false)
    private Integer totalPaymentPrice = 0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    @Builder
    private Payment(Order order, Coupon coupon, PaymentMethod paymentMethod,
                    Integer totalProductPrice, Integer deliveryFee,
                    Integer discountPrice, Integer totalPaymentPrice) {
        this.order = order;
        this.coupon = coupon;
        this.paymentMethod = paymentMethod;
        this.totalProductPrice = totalProductPrice != null ? totalProductPrice : 0;
        this.deliveryFee = deliveryFee != null ? deliveryFee : 0;
        this.discountPrice = discountPrice != null ? discountPrice : 0;
        this.totalPaymentPrice = totalPaymentPrice != null ? totalPaymentPrice : 0;
        this.paymentStatus = PaymentStatus.PENDING;
    }

    public void complete() {
        this.paymentStatus = PaymentStatus.COMPLETE;
    }

    public void fail() {
        this.paymentStatus = PaymentStatus.FAILED;
    }

    public void cancel() {
        this.paymentStatus = PaymentStatus.CANCELLED;
    }
}
