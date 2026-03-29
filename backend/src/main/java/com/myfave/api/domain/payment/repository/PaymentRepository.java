package com.myfave.api.domain.payment.repository;

import com.myfave.api.domain.order.entity.Order;
import com.myfave.api.domain.payment.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    // 주문에 대한 결제 정보
    Optional<Payment> findByOrder(Order order);
}
