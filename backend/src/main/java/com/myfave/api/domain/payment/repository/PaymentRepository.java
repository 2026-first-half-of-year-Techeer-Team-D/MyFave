package com.myfave.api.domain.payment.repository;

import com.myfave.api.domain.order.entity.Order;
import com.myfave.api.domain.payment.entity.Payment;
import com.myfave.api.domain.payment.entity.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Optional<Payment> findByOrder(Order order);

    Optional<Payment> findByPgTransactionId(String pgTransactionId);

    // Reconciliation: 특정 상태 + 생성시각 기준 조회
    List<Payment> findByPaymentStatusAndCreatedAtBefore(PaymentStatus status, ZonedDateTime threshold);
}
