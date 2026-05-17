package com.myfave.api.domain.cart.service;

import com.myfave.api.domain.cart.dto.request.CartItemRequest;
import com.myfave.api.domain.cart.repository.CartItemRepository;
import com.myfave.api.domain.product.entity.CategoryCode;
import com.myfave.api.domain.product.entity.ConditionCode;
import com.myfave.api.domain.product.entity.Product;
import com.myfave.api.domain.product.repository.ProductRepository;
import com.myfave.api.domain.user.entity.User;
import com.myfave.api.domain.user.repository.UserRepository;
import com.myfave.api.global.error.CustomException;
import com.myfave.api.global.error.ErrorCode;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;


import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class CartServiceConcurrencyTest {

    @Autowired
    private CartService cartService;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    private User testUser;
    private Product testProduct;

    @BeforeEach
    void setUp() {
        // 테스트 사용자 (DataInitializer가 만든 user_id=1과 겹치지 않게)
        testUser = userRepository.save(
                User.builder()
                        .email("cart-concurrency@example.com")
                        .password("password1234!")
                        .name("카트동시성")
                        .nickname("cartconc")
                        .phone("010-8888-8888")
                        .build()
        );

        // 테스트 상품
        testProduct = productRepository.save(
                Product.builder()
                        .user(testUser)
                        .productName("동시성 테스트 상품")
                        .price(10000)
                        .conditionCode(ConditionCode.S_GRADE)
                        .categoryCode(CategoryCode.TOP)
                        .description("테스트용")
                        .build()
        );
    }

    @AfterEach
    void tearDown() {
        cartItemRepository.deleteAll();
        productRepository.delete(testProduct);
        userRepository.delete(testUser);
    }

    @Test
    @DisplayName("동시 addCartItem 호출 시 한 번만 성공하고 다른 한 번은 CART_ALREADY_EXISTS 예외가 발생해야 한다")
    void addCartItem_concurrentRequests_shouldSucceedOnceAndOtherShouldFailWithAlreadyExists() throws InterruptedException {
        // given
        int threadCount = 2;
        ExecutorService executor = Executors.newFixedThreadPool(threadCount);
        CountDownLatch ready = new CountDownLatch(1);
        CountDownLatch done = new CountDownLatch(threadCount);
        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger alreadyExistsCount = new AtomicInteger(0);
        AtomicInteger otherFailCount = new AtomicInteger(0);

        Long userId = testUser.getUserId();
        Long productId = testProduct.getProductId();

        // CartItemRequest는 setter/빌더가 없어서 ReflectionTestUtils로 private 필드 주입
        CartItemRequest request = new CartItemRequest();
        ReflectionTestUtils.setField(request, "productId", productId);

        // when
        for (int i = 0; i < threadCount; i++) {
            executor.submit(() -> {
                try {
                    ready.await();
                    cartService.addCartItem(userId, request);
                    successCount.incrementAndGet();
                } catch (CustomException e) {
                    if (e.getErrorCode() == ErrorCode.CART_ALREADY_EXISTS) {
                        alreadyExistsCount.incrementAndGet();
                    } else {
                        otherFailCount.incrementAndGet();
                    }
                } catch (Exception e) {
                    otherFailCount.incrementAndGet();
                } finally {
                    done.countDown();
                }
            });
        }

        ready.countDown();
        done.await();
        executor.shutdown();

        // then
        System.out.println("성공 횟수: " + successCount.get());
        System.out.println("CART_ALREADY_EXISTS 횟수: " + alreadyExistsCount.get());
        System.out.println("기타 예외 횟수: " + otherFailCount.get());
        assertThat(successCount.get()).isEqualTo(1);
        assertThat(alreadyExistsCount.get()).isEqualTo(1);
        assertThat(otherFailCount.get()).isEqualTo(0);
    }
}