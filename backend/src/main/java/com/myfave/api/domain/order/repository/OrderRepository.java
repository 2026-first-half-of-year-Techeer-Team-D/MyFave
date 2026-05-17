package com.myfave.api.domain.order.repository;

import com.myfave.api.domain.order.entity.Order;
import com.myfave.api.domain.user.entity.User;
import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {

    // 사용자의 주문 목록 (최신순)
    List<Order> findByUserOrderByCreatedAtDesc(User user);

    // 사용자의 주문 목록 (최신순, 페이지네이션)
    // Page<Order>: content(주문 목록) + totalElements, totalPages 등 메타 정보 포함
    Page<Order> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);

    // 주문 번호로 조회
    Optional<Order> findByOrderNumber(String orderNumber);

    // 결제 준비 진입 시 동시 요청 방지용 비관적 쓰기 락
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT o FROM Order o WHERE o.orderId = :orderId")
    Optional<Order> findByIdForUpdate(@Param("orderId") Long orderId);
}
