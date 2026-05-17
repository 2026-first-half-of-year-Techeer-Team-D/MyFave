package com.myfave.api.support;

import com.myfave.api.domain.payment.provider.PaymentProvider;
import org.junit.jupiter.api.AfterEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;

/**
 * 통합 테스트 베이스
 * - 실제 PostgreSQL(TestContainers) + 실 Spring 컨텍스트
 * - 외부 의존(PortOne, Redis)은 모킹하여 결제↔쿠폰 연동 자체만 검증
 */
@SpringBootTest
@ActiveProfiles("test")
@Testcontainers
@Import(TestDataFactory.class)
public abstract class IntegrationTestSupport {

    @Container
    @ServiceConnection
    static final PostgreSQLContainer<?> POSTGRES =
            new PostgreSQLContainer<>(DockerImageName.parse("postgres:16-alpine"));

    // PG 호출은 실제로 안 보내고 모킹 (Track 3 목적: 내부 연동 검증)
    @MockitoBean
    protected PaymentProvider paymentProvider;

    // Redis는 docker-compose의 localhost:6379 사용 (실 호출은 거의 없음, 빈 초기화용)

    @Autowired
    protected TestDataFactory testDataFactory;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    /**
     * 테스트 간 데이터 격리. ddl-auto=create-drop이 컨텍스트 수준 정리만 하므로
     * 같은 컨텍스트에서 도는 테스트들 사이는 TRUNCATE로 직접 정리한다.
     */
    @AfterEach
    void cleanDatabase() {
        jdbcTemplate.execute(
                "TRUNCATE TABLE "
                + "payment_attempts, payments, deliveries, "
                + "order_items, orders, "
                + "coupons, coupon_masters, "
                + "product_images, products, "
                + "cart_items, shipping_addresses, users "
                + "RESTART IDENTITY CASCADE"
        );
    }
}
