package com.myfave.api.domain.order.service;

import com.myfave.api.domain.cart.entity.CartItem;
import com.myfave.api.domain.cart.repository.CartItemRepository;
import com.myfave.api.domain.order.dto.request.OrderCreateRequest;
import com.myfave.api.domain.order.dto.response.OrderConfirmResponse;
import com.myfave.api.domain.order.dto.response.OrderDetailResponse;
import com.myfave.api.domain.order.dto.response.OrderListResponse;
import com.myfave.api.domain.order.dto.response.OrderResponse;
import com.myfave.api.domain.order.dto.response.OrderSummaryResponse;
import com.myfave.api.domain.order.entity.Order;
import com.myfave.api.domain.order.entity.OrderItem;
import com.myfave.api.domain.order.entity.OrderStatus;
import com.myfave.api.domain.order.entity.OrderType;
import com.myfave.api.domain.order.repository.OrderItemRepository;
import com.myfave.api.domain.order.repository.OrderRepository;
import com.myfave.api.domain.payment.entity.Payment;
import com.myfave.api.domain.product.entity.Product;
import com.myfave.api.domain.product.repository.ProductRepository;
import com.myfave.api.domain.shipping.entity.Delivery;
import com.myfave.api.domain.shipping.entity.ShippingAddress;
import com.myfave.api.domain.shipping.repository.DeliveryRepository;
import com.myfave.api.domain.shipping.repository.ShippingAddressRepository;
import com.myfave.api.domain.user.entity.User;
import com.myfave.api.domain.user.repository.UserRepository;
import com.myfave.api.global.error.CustomException;
import com.myfave.api.global.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true) // 기본적으로 읽기 전용. 변경이 필요한 메서드에 별도 @Transactional 추가
public class OrderService {

    // 주문 저장/조회용 Repository
    private final OrderRepository orderRepository;

    // 주문 항목(상품 스냅샷) 저장용 Repository
    private final OrderItemRepository orderItemRepository;

    // JWT에서 추출한 userId로 실제 User 엔티티를 조회하기 위한 Repository
    private final UserRepository userRepository;

    // 상품 존재 여부 및 품절 여부 확인용 Repository
    private final ProductRepository productRepository;

    // 장바구니 항목 조회용 Repository (CART 주문 시 사용)
    private final CartItemRepository cartItemRepository;

    // 배송지 존재 여부 및 소유자 확인용 Repository
    private final ShippingAddressRepository shippingAddressRepository;

    // 배송 정보 조회용 Repository (주문 상세 조회 시 사용)
    private final DeliveryRepository deliveryRepository;

    /**
     * 주문 생성 (5-1)
     * @Transactional: DB에 실제로 데이터를 저장하므로 읽기 전용을 해제
     */
    @Transactional
    public OrderResponse createOrder(Long userId, OrderCreateRequest request) {

        // ── 1. 사용자 조회 ──────────────────────────────────────────────
        // JWT 토큰이 없으면 userId가 null → 개발 테스트용으로 임시 1L 사용
        // TODO: Auth API 완성 후 아래 줄 제거하고 AUTH_UNAUTHORIZED 예외로 교체
        if (userId == null) {
            userId = 1L;
        }
        // JWT 토큰에서 꺼낸 userId로 User 엔티티를 DB에서 조회
        // 없으면 CustomException → GlobalExceptionHandler가 404 응답 반환
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        // ── 2. 배송지 조회 ─────────────────────────────────────────────
        // 요청으로 받은 shippingAddressId가 실제로 DB에 존재하는지 확인
        ShippingAddress shippingAddress = shippingAddressRepository.findById(request.getShippingAddressId())
                .orElseThrow(() -> new CustomException(ErrorCode.SHIPPING_ADDRESS_NOT_FOUND));

        // ── 3. 배송지 소유자 확인 ──────────────────────────────────────
        // 로그인한 사람(userId)과 배송지 등록자(shippingAddress.getUser())가 같아야 함
        // 다르면 다른 사람의 배송지를 쓰려는 것이므로 403 반환
        if (!shippingAddress.getUser().getUserId().equals(userId)) {
            throw new CustomException(ErrorCode.AUTH_FORBIDDEN);
        }

        // ── 4. 주문 번호 생성 ──────────────────────────────────────────
        // 형식: ORD-yyyyMMdd-UUID앞8자리 (예: ORD-20260405-A1B2C3D4)
        // UUID는 매번 랜덤하게 생성되어 중복될 확률이 사실상 0에 가까움
        String orderNumber = "ORD-"
                + LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"))
                + "-"
                + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        // ── 5. Order 엔티티 생성 및 저장 ──────────────────────────────
        // Builder 패턴: 정해진 필드만 받아 Order 객체를 안전하게 생성
        // orderStatus는 Order.java 빌더 내부에서 자동으로 PENDING으로 세팅됨
        Order order = Order.builder()
                .user(user)
                .orderNumber(orderNumber)
                .orderType(request.getOrderType())
                .build();
        orderRepository.save(order); // INSERT INTO orders ... 실행

        // ── 6. orderType에 따라 OrderItem 저장 ────────────────────────
        if (request.getOrderType() == OrderType.DIRECT) {
            // ── DIRECT: 단일 상품 바로 구매 ──────────────────────────

            // productId가 null이면 요청 자체가 잘못된 것
            if (request.getProductId() == null) {
                throw new CustomException(ErrorCode.ORDER_INVALID_ORDER_TYPE);
            }

            // 상품 조회
            Product product = productRepository.findById(request.getProductId())
                    .orElseThrow(() -> new CustomException(ErrorCode.PRODUCT_NOT_FOUND));

            // 품절 확인: isSoldout이 true이면 주문 불가
            if (product.getIsSoldout()) {
                throw new CustomException(ErrorCode.PRODUCT_SOLD_OUT);
            }

            // OrderItem 저장
            // price, productName을 현재 값으로 스냅샷 저장 → 나중에 상품 정보가 바뀌어도 주문 기록은 유지됨
            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .price(product.getPrice())             // 주문 당시 가격 스냅샷
                    .productName(product.getProductName()) // 주문 당시 상품명 스냅샷
                    .build();
            orderItemRepository.save(orderItem);

        } else {
            // ── CART: 장바구니 상품 구매 ─────────────────────────────

            // cartItemIds가 null이거나 비어있으면 요청이 잘못된 것
            if (request.getCartItemIds() == null || request.getCartItemIds().isEmpty()) {
                throw new CustomException(ErrorCode.ORDER_INVALID_ORDER_TYPE);
            }

            // 요청한 장바구니 ID 목록으로 CartItem 전체 조회
            // JpaRepository가 기본 제공하는 findAllById: IN 쿼리로 한 번에 조회
            List<CartItem> cartItems = cartItemRepository.findAllById(request.getCartItemIds());

            // 요청한 개수와 실제 조회된 개수가 다르면 없는 항목이 포함된 것
            if (cartItems.size() != request.getCartItemIds().size()) {
                throw new CustomException(ErrorCode.CART_ITEM_NOT_FOUND);
            }

            // 각 장바구니 항목에 대해 처리
            for (CartItem cartItem : cartItems) {

                // 해당 장바구니 항목이 로그인한 사용자 것인지 확인
                if (!cartItem.getUser().getUserId().equals(userId)) {
                    throw new CustomException(ErrorCode.AUTH_FORBIDDEN);
                }

                Product product = cartItem.getProduct();

                // 각 상품 품절 확인
                if (product.getIsSoldout()) {
                    throw new CustomException(ErrorCode.PRODUCT_SOLD_OUT);
                }

                // OrderItem 저장 (상품별 스냅샷)
                OrderItem orderItem = OrderItem.builder()
                        .order(order)
                        .product(product)
                        .price(product.getPrice())
                        .productName(product.getProductName())
                        .build();
                orderItemRepository.save(orderItem);
            }
        }

        // ── 7. 응답 반환 ───────────────────────────────────────────────
        // OrderResponse.from(order): order 엔티티에서 필요한 필드만 뽑아 DTO로 변환
        return OrderResponse.from(order);
    }

    /**
     * 주문 목록 조회 (5-2)
     * 클래스 레벨 @Transactional(readOnly = true) 그대로 적용 (조회 전용)
     */
    public OrderListResponse getOrders(Long userId, Pageable pageable) {

        // ── 1. 사용자 조회 ──────────────────────────────────────────────
        // TODO: Auth API 완성 후 null 체크를 AUTH_UNAUTHORIZED 예외로 교체
        if (userId == null) {
            userId = 1L;
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        // ── 2. 주문 목록 조회 (페이지네이션, 최신순) ────────────────────
        // Page<Order>: content(주문 목록) + totalElements, totalPages 등 메타 정보 포함
        Page<Order> orderPage = orderRepository.findByUserOrderByCreatedAtDesc(user, pageable);
        List<Order> orders = orderPage.getContent();

        // ── 3. 주문이 없으면 빈 응답 반환 ──────────────────────────────
        if (orders.isEmpty()) {
            return OrderListResponse.from(Page.empty(pageable));
        }

        // ── 4. OrderItem 배치 조회 (N+1 방지) ───────────────────────────
        // findByOrderIn: 여러 주문의 OrderItem을 IN 쿼리 한 번으로 조회
        // (orders 수만큼 개별 쿼리를 날리는 N+1 문제를 방지)
        List<OrderItem> allOrderItems = orderItemRepository.findByOrderIn(orders);

        // ── 5. OrderItem을 주문별로 그룹핑 ──────────────────────────────
        // Map<orderId, List<OrderItem>>: 각 주문 ID에 해당하는 상품 목록으로 분류
        Map<Long, List<OrderItem>> itemsByOrderId = allOrderItems.stream()
                .collect(Collectors.groupingBy(item -> item.getOrder().getOrderId()));

        // ── 6. 주문별 DTO 변환 ──────────────────────────────────────────
        List<OrderSummaryResponse> summaries = orders.stream()
                .map(order -> OrderSummaryResponse.from(
                        order,
                        // 해당 주문의 OrderItem 목록 (없으면 빈 리스트)
                        itemsByOrderId.getOrDefault(order.getOrderId(), List.of())
                ))
                .toList();

        // ── 7. Page<OrderSummaryResponse>로 래핑 후 반환 ────────────────
        // PageImpl: content + pageable + totalElements를 조합해 Page 객체 생성
        Page<OrderSummaryResponse> summaryPage =
                new PageImpl<>(summaries, pageable, orderPage.getTotalElements());
        return OrderListResponse.from(summaryPage);
    }

    /**
     * 주문 상세 조회 (5-3)
     * 클래스 레벨 @Transactional(readOnly = true) 그대로 적용 (조회 전용)
     */
    public OrderDetailResponse getOrderDetail(Long userId, Long orderId) {

        // ── 1. userId null 체크 ──────────────────────────────────────────
        // TODO: Auth API 완성 후 null 체크를 AUTH_UNAUTHORIZED 예외로 교체
        if (userId == null) {
            userId = 1L;
        }

        // ── 2. orderId → Order 조회 ──────────────────────────────────────
        // 없으면 CustomException → GlobalExceptionHandler가 404 응답 반환
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new CustomException(ErrorCode.ORDER_NOT_FOUND));

        // ── 3. 본인 주문 확인 ────────────────────────────────────────────
        // 로그인한 사람(userId)과 주문자(order.getUser())가 같아야 함
        if (!order.getUser().getUserId().equals(userId)) {
            throw new CustomException(ErrorCode.AUTH_FORBIDDEN);
        }

        // ── 4. OrderItem 조회 ────────────────────────────────────────────
        List<OrderItem> orderItems = orderItemRepository.findByOrder(order);

        // ── 5. Delivery 조회 (배송 생성 전이면 null) ──────────────────────
        Delivery delivery = deliveryRepository.findByOrder(order).orElse(null);

        // ── 6. Payment 조회 (미결제 상태이면 null) ───────────────────────
        // Order.finalPayment: completePay() 호출 시 세팅, 미결제이면 null
        Payment payment = order.getFinalPayment();

        // ── 7. OrderDetailResponse 반환 ───────────────────────────────────
        return OrderDetailResponse.from(order, payment, delivery, orderItems);
    }

    /**
     * 주문 상태 변경 - 구매확정 (5-4)
     * @Transactional: orderStatus를 PURCHASE_CONFIRMED로 변경하므로 쓰기 트랜잭션 적용
     */
    @Transactional
    public OrderConfirmResponse confirmOrder(Long userId, Long orderId) {

        // ── 1. userId null 체크 ──────────────────────────────────────────
        // TODO: Auth API 완성 후 null 체크를 AUTH_UNAUTHORIZED 예외로 교체
        if (userId == null) {
            userId = 1L;
        }

        // ── 2. orderId → Order 조회 ──────────────────────────────────────
        // 없으면 CustomException → GlobalExceptionHandler가 404 응답 반환
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new CustomException(ErrorCode.ORDER_NOT_FOUND));

        // ── 3. 본인 주문 확인 ────────────────────────────────────────────
        // 로그인한 사람(userId)과 주문자(order.getUser())가 같아야 함
        if (!order.getUser().getUserId().equals(userId)) {
            throw new CustomException(ErrorCode.AUTH_FORBIDDEN);
        }

        // ── 4. 구매확정 가능 상태 확인 ───────────────────────────────────
        // 스펙: DELIVERY_COMPLETED 상태인 주문만 구매확정 가능
        // 그 외 상태(PENDING, PAID, SHIPPING 등)이면 409 반환
        if (order.getOrderStatus() != OrderStatus.DELIVERY_COMPLETED) {
            throw new CustomException(ErrorCode.ORDER_INVALID_STATUS);
        }

        // ── 5. 구매확정 처리 ─────────────────────────────────────────────
        // order.confirm(): orderStatus를 PURCHASE_CONFIRMED로 변경
        // @Transactional이므로 메서드 종료 시 JPA가 변경 감지 → UPDATE 쿼리 자동 실행
        order.confirm();

        // ── 6. 응답 반환 ─────────────────────────────────────────────────
        // OrderConfirmResponse.from(order): orderId, orderStatus(PURCHASE_CONFIRMED) 반환
        return OrderConfirmResponse.from(order);
    }
}
