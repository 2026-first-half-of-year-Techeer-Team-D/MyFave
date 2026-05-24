package com.myfave.api.domain.payment.repository;

import com.myfave.api.domain.order.entity.Order;
import com.myfave.api.domain.payment.entity.Payment;
import com.myfave.api.domain.payment.entity.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.ZonedDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    // Payment + Order + User를 한 번에 조회 (validateForConfirm, validateForCancel, getPayment용)
    @Query("SELECT p FROM Payment p JOIN FETCH p.order o JOIN FETCH o.user WHERE p.paymentId = :paymentId")
    Optional<Payment> findByIdWithOrderAndUser(@Param("paymentId") Long paymentId);

    // Payment + Order만 조회 (decreaseStockForConfirm용 — orderItems 순회를 위해 Order만 필요)
    @Query("SELECT p FROM Payment p JOIN FETCH p.order WHERE p.paymentId = :paymentId")
    Optional<Payment> findByIdWithOrder(@Param("paymentId") Long paymentId);

    // FAILED/CANCELLED를 제외한 활성 결제 조회 (중복 결제 준비 방지)
    Optional<Payment> findByOrderAndPaymentStatusNotIn(Order order, Collection<PaymentStatus> statuses);

    Optional<Payment> findByPgTransactionId(String pgTransactionId);

    // Reconciliation: 특정 상태 + 생성시각 기준 조회
    List<Payment> findByPaymentStatusAndCreatedAtBefore(PaymentStatus status, ZonedDateTime threshold);

    // myfave.payment.pending.gauge: 현재 PENDING 결제 적체량 관측
    long countByPaymentStatus(PaymentStatus status);
}
