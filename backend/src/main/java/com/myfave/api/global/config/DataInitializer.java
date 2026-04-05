package com.myfave.api.global.config;

import com.myfave.api.domain.cart.entity.CartItem;
import com.myfave.api.domain.cart.repository.CartItemRepository;
import com.myfave.api.domain.product.entity.CategoryCode;
import com.myfave.api.domain.product.entity.ConditionCode;
import com.myfave.api.domain.product.entity.Product;
import com.myfave.api.domain.product.repository.ProductRepository;
import com.myfave.api.domain.shipping.entity.ShippingAddress;
import com.myfave.api.domain.shipping.repository.ShippingAddressRepository;
import com.myfave.api.domain.user.entity.User;
import com.myfave.api.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

// @Profile("local"): 로컬 개발 환경에서만 실행 (prod 환경에서는 동작 안 함)
@Slf4j
@Component
@Profile("local")
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final ShippingAddressRepository shippingAddressRepository;
    private final CartItemRepository cartItemRepository;
    private final PasswordEncoder passwordEncoder;

    // CommandLineRunner: 앱 시작 완료 직후 자동 실행
    @Override
    @Transactional
    public void run(String... args) {

        // 이미 테스트 데이터가 있으면 중복 삽입하지 않음
        if (userRepository.existsById(1L)) {
            log.info("[DataInitializer] 테스트 데이터가 이미 존재합니다. 건너뜁니다.");
            return;
        }

        // ── 1. 테스트 유저 생성 ─────────────────────────────────────
        // Order API 테스트 시 userId=1 로 자동 설정됨 (JWT 없을 때)
        User user = User.builder()
                .email("test@test.com")
                .password(passwordEncoder.encode("password"))
                .name("테스트유저")
                .nickname("tester")
                .phone("010-0000-0000")
                .build();
        userRepository.save(user);
        log.info("[DataInitializer] 테스트 유저 생성 완료 (id={})", user.getUserId());

        // ── 2. 테스트 상품 생성 ─────────────────────────────────────
        // DIRECT 주문 테스트: productId=1 사용
        Product product = Product.builder()
                .user(user)
                .productName("테스트 상품")
                .shortReview("테스트용 상품입니다.")
                .price(10000)
                .description("Order API 테스트를 위한 더미 상품")
                .size("FREE")
                .conditionCode(ConditionCode.S_GRADE)
                .categoryCode(CategoryCode.TOP)
                .build();
        productRepository.save(product);
        log.info("[DataInitializer] 테스트 상품 생성 완료 (id={})", product.getProductId());

        // ── 3. 테스트 배송지 생성 ───────────────────────────────────
        // 주문 요청 시 shippingAddressId=1 사용
        ShippingAddress shippingAddress = ShippingAddress.builder()
                .user(user)
                .receiverName("홍길동")
                .receiverPhone("010-1234-5678")
                .address("서울시 강남구 역삼동 123")
                .addressDetail("101호")
                .zipCode("12345")
                .deliveryRequest("문 앞에 놓아주세요")
                .isDefault(true)
                .build();
        shippingAddressRepository.save(shippingAddress);
        log.info("[DataInitializer] 테스트 배송지 생성 완료 (id={})", shippingAddress.getShippingId());

        // ── 4. 테스트 장바구니 항목 생성 ────────────────────────────
        // CART 주문 테스트: cartItemIds=[1] 사용
        CartItem cartItem = CartItem.builder()
                .user(user)
                .product(product)
                .build();
        cartItemRepository.save(cartItem);
        log.info("[DataInitializer] 테스트 장바구니 항목 생성 완료 (id={})", cartItem.getCartId());

        log.info("[DataInitializer] Order API 테스트 데이터 삽입 완료");
    }
}
