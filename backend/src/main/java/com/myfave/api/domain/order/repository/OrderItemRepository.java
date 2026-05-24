package com.myfave.api.domain.order.repository;

import com.myfave.api.domain.order.entity.Order;
import com.myfave.api.domain.order.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    // 주문에 포함된 상품 목록
    List<OrderItem> findByOrder(Order order);

    @Query("SELECT oi FROM OrderItem oi JOIN FETCH oi.order WHERE oi.order IN :orders")
    List<OrderItem> findByOrderIn(@Param("orders") List<Order> orders);
}
