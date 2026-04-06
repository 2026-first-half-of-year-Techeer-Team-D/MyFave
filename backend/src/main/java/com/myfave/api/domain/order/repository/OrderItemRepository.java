package com.myfave.api.domain.order.repository;

import com.myfave.api.domain.order.entity.Order;
import com.myfave.api.domain.order.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    // 주문에 포함된 상품 목록
    List<OrderItem> findByOrder(Order order);

    // 여러 주문의 상품 목록을 한 번에 조회 (N+1 방지)
    // IN 쿼리로 한 번에 가져와 서비스에서 주문별로 그룹핑
    List<OrderItem> findByOrderIn(List<Order> orders);
}
