# My Fave 백엔드 프로젝트 설계서

## 기술 스택

| 항목 | 선택 |
|---|---|
| 언어 | Java 21 |
| 프레임워크 | Spring Boot 3.4.x |
| 빌드 도구 | Gradle (Groovy) |
| DB | PostgreSQL |
| ORM | JPA (Spring Data JPA) |
| 캐시/채팅 | Redis |
| WebSocket | Spring WebSocket + STOMP |
| 인증 | JWT (Access + Refresh Token) |
| API 문서화 | Swagger (SpringDoc OpenAPI) |
| 로깅 | Logback (Spring Boot 기본) |
| 테스트 | JUnit 5 + Mockito |
| 서버 포트 | 8080 |

## 프로젝트 구조

```
myfave/
├── frontend/                          ← 프론트엔드 (비워둠)
├── backend/                           ← Spring Boot 프로젝트
│   ├── build.gradle
│   ├── settings.gradle
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/myfave/api/
│   │   │   │   ├── domain/
│   │   │   │   │   ├── auth/
│   │   │   │   │   │   ├── controller/
│   │   │   │   │   │   ├── service/
│   │   │   │   │   │   ├── repository/
│   │   │   │   │   │   ├── entity/
│   │   │   │   │   │   └── dto/
│   │   │   │   │   │       ├── request/
│   │   │   │   │   │       └── response/
│   │   │   │   │   ├── user/
│   │   │   │   │   │   ├── controller/
│   │   │   │   │   │   ├── service/
│   │   │   │   │   │   ├── repository/
│   │   │   │   │   │   ├── entity/
│   │   │   │   │   │   └── dto/
│   │   │   │   │   ├── product/
│   │   │   │   │   │   ├── controller/
│   │   │   │   │   │   ├── service/
│   │   │   │   │   │   ├── repository/
│   │   │   │   │   │   ├── entity/
│   │   │   │   │   │   └── dto/
│   │   │   │   │   ├── cart/
│   │   │   │   │   │   ├── controller/
│   │   │   │   │   │   ├── service/
│   │   │   │   │   │   ├── repository/
│   │   │   │   │   │   ├── entity/
│   │   │   │   │   │   └── dto/
│   │   │   │   │   ├── order/
│   │   │   │   │   │   ├── controller/
│   │   │   │   │   │   ├── service/
│   │   │   │   │   │   ├── repository/
│   │   │   │   │   │   ├── entity/
│   │   │   │   │   │   └── dto/
│   │   │   │   │   ├── shipping/
│   │   │   │   │   │   ├── controller/
│   │   │   │   │   │   ├── service/
│   │   │   │   │   │   ├── repository/
│   │   │   │   │   │   ├── entity/
│   │   │   │   │   │   └── dto/
│   │   │   │   │   ├── coupon/
│   │   │   │   │   │   ├── controller/
│   │   │   │   │   │   ├── service/
│   │   │   │   │   │   ├── repository/
│   │   │   │   │   │   ├── entity/
│   │   │   │   │   │   └── dto/
│   │   │   │   │   ├── content/
│   │   │   │   │   │   ├── controller/
│   │   │   │   │   │   ├── service/
│   │   │   │   │   │   ├── repository/
│   │   │   │   │   │   ├── entity/
│   │   │   │   │   │   └── dto/
│   │   │   │   │   ├── saleevent/
│   │   │   │   │   │   ├── controller/
│   │   │   │   │   │   ├── service/
│   │   │   │   │   │   ├── repository/
│   │   │   │   │   │   ├── entity/
│   │   │   │   │   │   └── dto/
│   │   │   │   │   └── chat/
│   │   │   │   │       ├── controller/
│   │   │   │   │       ├── service/
│   │   │   │   │       ├── repository/
│   │   │   │   │       ├── entity/
│   │   │   │   │       └── dto/
│   │   │   │   ├── global/
│   │   │   │   │   ├── config/
│   │   │   │   │   │   ├── SecurityConfig.java
│   │   │   │   │   │   ├── RedisConfig.java
│   │   │   │   │   │   ├── WebSocketConfig.java
│   │   │   │   │   │   ├── SwaggerConfig.java
│   │   │   │   │   │   └── WebConfig.java
│   │   │   │   │   ├── common/
│   │   │   │   │   │   └── ApiResponse.java
│   │   │   │   │   ├── error/
│   │   │   │   │   │   ├── ErrorCode.java
│   │   │   │   │   │   ├── CustomException.java
│   │   │   │   │   │   └── GlobalExceptionHandler.java
│   │   │   │   │   ├── security/
│   │   │   │   │   │   ├── JwtTokenProvider.java
│   │   │   │   │   │   └── JwtAuthenticationFilter.java
│   │   │   │   │   └── util/
│   │   │   │   └── MyfaveApplication.java
│   │   │   └── resources/
│   │   │       ├── application.yml
│   │   │       ├── application-local.yml
│   │   │       └── application-prod.yml
│   │   └── test/
│   │       └── java/com/myfave/api/
│   │           └── MyfaveApplicationTests.java
│   └── .gitignore
└── README.md
```

## 각 레이어 역할

| 레이어 | 역할 | 예시 |
|---|---|---|
| controller/ | API 엔드포인트 정의, 요청 수신 및 응답 반환 | UserController.java |
| service/ | 비즈니스 로직 처리 | UserService.java |
| repository/ | DB 접근 (JPA Repository) | UserRepository.java |
| entity/ | DB 테이블과 매핑되는 JPA 엔티티 | User.java |
| dto/request/ | 클라이언트 → 서버 요청 데이터 | SignupRequest.java |
| dto/response/ | 서버 → 클라이언트 응답 데이터 | UserResponse.java |

## 의존성 목록 (build.gradle)

```groovy
dependencies {
    // Spring Boot 핵심
    implementation 'org.springframework.boot:spring-boot-starter-web'
    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
    implementation 'org.springframework.boot:spring-boot-starter-validation'
    implementation 'org.springframework.boot:spring-boot-starter-security'
    implementation 'org.springframework.boot:spring-boot-starter-websocket'

    // DB
    runtimeOnly 'org.postgresql:postgresql'

    // Redis
    implementation 'org.springframework.boot:spring-boot-starter-data-redis'

    // JWT
    implementation 'io.jsonwebtoken:jjwt-api:0.12.6'
    runtimeOnly 'io.jsonwebtoken:jjwt-impl:0.12.6'
    runtimeOnly 'io.jsonwebtoken:jjwt-jackson:0.12.6'

    // Swagger (SpringDoc)
    implementation 'org.springdoc:springdoc-openapi-starter-webmvc-ui:2.8.0'

    // Lombok
    compileOnly 'org.projectlombok:lombok'
    annotationProcessor 'org.projectlombok:lombok'

    // 테스트
    testImplementation 'org.springframework.boot:spring-boot-starter-test'
    testImplementation 'org.springframework.security:spring-security-test'
}
```

## 설정 파일

### application.yml (공통)

```yaml
spring:
  profiles:
    active: local

  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
    properties:
      hibernate:
        format_sql: true
        default_batch_fetch_size: 100

server:
  port: 8080

# 인플루언서 설정 (설정값으로 관리)
influencer:
  user-id: 1

# JWT 설정
jwt:
  secret: ${JWT_SECRET}
  access-token-expiry: 1800000
  refresh-token-expiry: 1209600000
```

### application-local.yml (로컬 개발)

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/myfave
    username: ${DB_USERNAME:postgres}
    password: ${DB_PASSWORD:postgres}

  jpa:
    hibernate:
      ddl-auto: create-drop
    show-sql: true

  data:
    redis:
      host: localhost
      port: 6379

springdoc:
  swagger-ui:
    path: /swagger-ui
    enabled: true
```

### application-prod.yml (운영)

```yaml
spring:
  datasource:
    url: ${DB_URL}
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}

  jpa:
    hibernate:
      ddl-auto: none
    show-sql: false

  data:
    redis:
      host: ${REDIS_HOST}
      port: ${REDIS_PORT}

springdoc:
  swagger-ui:
    enabled: false
```

## 공통 클래스

### ApiResponse (공통 응답 구조)

```java
@Getter
@AllArgsConstructor
public class ApiResponse<T> {
    private int code;
    private String message;
    private T data;

    public static <T> ApiResponse<T> ok(T data) {
        return new ApiResponse<>(200, "OK", data);
    }

    public static <T> ApiResponse<T> created(String message, T data) {
        return new ApiResponse<>(201, message, data);
    }

    public static ApiResponse<Void> ok(String message) {
        return new ApiResponse<>(200, message, null);
    }
}
```

### ErrorCode (에러 코드 Enum)

```java
@Getter
@AllArgsConstructor
public enum ErrorCode {
    // 공통
    COMMON_INVALID_INPUT(400, "입력값 유효성 검증 실패"),
    COMMON_INTERNAL_ERROR(500, "서버 내부 오류"),
    COMMON_METHOD_NOT_ALLOWED(405, "허용되지 않은 HTTP 메서드"),

    // 인증
    AUTH_UNAUTHORIZED(401, "인증 토큰 없음 또는 만료"),
    AUTH_FORBIDDEN(403, "접근 권한 없음"),
    AUTH_INVALID_CREDENTIALS(401, "아이디 또는 비밀번호 불일치"),
    AUTH_INVALID_REFRESH_TOKEN(401, "유효하지 않은 리프레시 토큰"),
    AUTH_EXPIRED_REFRESH_TOKEN(401, "만료된 리프레시 토큰"),
    AUTH_TOO_MANY_REQUESTS(429, "인증코드 발송 요청 초과"),
    AUTH_INVALID_VERIFICATION_CODE(400, "인증코드 불일치"),
    AUTH_EXPIRED_VERIFICATION_CODE(400, "인증코드 만료"),
    AUTH_PASSWORD_MISMATCH(400, "비밀번호 확인 불일치"),
    AUTH_INVALID_RESET_TOKEN(401, "유효하지 않은 재설정 토큰"),
    AUTH_INVALID_SOCIAL_CODE(400, "유효하지 않은 인가 코드"),
    AUTH_SOCIAL_PROVIDER_ERROR(502, "소셜 제공자 서버 오류"),

    // 사용자
    USER_NOT_FOUND(404, "회원 정보 없음"),
    USER_DUPLICATE_LOGIN_ID(409, "이미 존재하는 아이디"),
    USER_DUPLICATE_NICKNAME(409, "이미 존재하는 닉네임"),
    USER_DUPLICATE_PHONE(409, "이미 등록된 전화번호"),
    USER_DUPLICATE_EMAIL(409, "이미 등록된 이메일"),

    // 상품
    PRODUCT_NOT_FOUND(404, "존재하지 않는 상품"),
    PRODUCT_SOLD_OUT(409, "품절된 상품"),

    // 장바구니
    CART_ALREADY_EXISTS(409, "이미 장바구니에 있는 상품"),
    CART_ITEM_NOT_FOUND(404, "존재하지 않는 장바구니 항목"),

    // 주문
    ORDER_NOT_FOUND(404, "존재하지 않는 주문"),
    ORDER_INVALID_STATUS(409, "주문 상태 변경 불가"),
    ORDER_INVALID_ORDER_TYPE(400, "유효하지 않은 주문 유형"),
    ORDER_PAYMENT_FAILED(502, "외부 결제 서비스 오류"),

    // 배송지
    SHIPPING_ADDRESS_NOT_FOUND(404, "존재하지 않는 배송지"),

    // 쿠폰
    COUPON_NOT_FOUND(404, "존재하지 않는 쿠폰"),
    COUPON_ALREADY_USED(409, "이미 사용된 쿠폰"),
    COUPON_EXPIRED(409, "만료된 쿠폰"),
    COUPON_TYPE_MISMATCH(409, "쿠폰 타입 불일치"),
    COUPON_MASTER_NOT_FOUND(404, "존재하지 않는 마스터 쿠폰"),
    COUPON_MASTER_INACTIVE(409, "비활성화된 마스터 쿠폰"),

    // 판매 이벤트
    SALE_EVENT_NOT_FOUND(404, "예정된 판매 이벤트 없음"),

    // 채팅
    CHAT_ROOM_NOT_FOUND(404, "현재 활성화된 채팅방 없음"),
    CHAT_ROOM_ALREADY_CLOSED(409, "이미 종료된 채팅방"),
    CHAT_RATE_LIMITED(429, "도배 방지 제한"),
    CHAT_INVALID_MESSAGE(400, "메시지 형식 오류"),
    CHAT_MESSAGE_TOO_LONG(400, "메시지 길이 초과"),
    ;

    private final int httpStatus;
    private final String message;
}
```

## Git 브랜치 전략

```
main          ← 배포용 (안정 버전)
├── develop   ← 개발 통합 브랜치
│   ├── feature/auth       ← 인증 기능 개발
│   ├── feature/user       ← 회원 기능 개발
│   ├── feature/product    ← 상품 기능 개발
│   ├── feature/cart       ← 장바구니 기능 개발
│   ├── feature/order      ← 주문 기능 개발
│   ├── feature/shipping   ← 배송지 기능 개발
│   ├── feature/coupon     ← 쿠폰 기능 개발
│   ├── feature/content    ← 콘텐츠 기능 개발
│   ├── feature/saleevent  ← 판매 이벤트 개발
│   └── feature/chat       ← 채팅 기능 개발
```

각 팀원이 feature/도메인 브랜치에서 작업하고, 완료되면 develop에 PR(Pull Request)로 머지.
