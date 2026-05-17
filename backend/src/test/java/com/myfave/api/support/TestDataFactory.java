package com.myfave.api.support;

import com.myfave.api.domain.coupon.entity.Coupon;
import com.myfave.api.domain.coupon.entity.CouponMaster;
import com.myfave.api.domain.coupon.entity.CouponType;
import com.myfave.api.domain.coupon.repository.CouponMasterRepository;
import com.myfave.api.domain.coupon.repository.CouponRepository;
import com.myfave.api.domain.order.entity.Order;
import com.myfave.api.domain.order.entity.OrderItem;
import com.myfave.api.domain.order.entity.OrderType;
import com.myfave.api.domain.order.repository.OrderItemRepository;
import com.myfave.api.domain.order.repository.OrderRepository;
import com.myfave.api.domain.product.entity.CategoryCode;
import com.myfave.api.domain.product.entity.ConditionCode;
import com.myfave.api.domain.product.entity.Product;
import com.myfave.api.domain.product.repository.ProductRepository;
import com.myfave.api.domain.shipping.entity.ShippingAddress;
import com.myfave.api.domain.shipping.repository.ShippingAddressRepository;
import com.myfave.api.domain.user.entity.User;
import com.myfave.api.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.test.context.TestComponent;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.ZonedDateTime;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;

@TestComponent
@RequiredArgsConstructor
public class TestDataFactory {

    private final UserRepository userRepository;
    private final ShippingAddressRepository shippingAddressRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CouponMasterRepository couponMasterRepository;
    private final CouponRepository couponRepository;
    private final PasswordEncoder passwordEncoder;

    private final AtomicInteger seq = new AtomicInteger();

    /** 인플루언서 user-id=1 고정 정책에 맞춰 첫 호출은 influencer 자리 차지하도록 사용 */
    public User createUser(String emailPrefix) {
        int n = seq.incrementAndGet();
        return userRepository.save(User.builder()
                .email(emailPrefix + n + "@test.com")
                .password(passwordEncoder.encode("password"))
                .name("테스트유저" + n)
                .nickname("nick" + n)
                .phone(String.format("010-%04d-%04d", n, n))
                .build());
    }

    public ShippingAddress createShippingAddress(User user) {
        return shippingAddressRepository.save(ShippingAddress.builder()
                .user(user)
                .receiverName("받는이")
                .receiverPhone("010-1111-2222")
                .address("서울시 강남구")
                .addressDetail("101호")
                .zipCode("12345")
                .deliveryRequest("문 앞")
                .isDefault(true)
                .build());
    }

    public Product createProduct(User seller, int price) {
        int n = seq.incrementAndGet();
        return productRepository.save(Product.builder()
                .user(seller)
                .productName("테스트상품" + n)
                .shortReview("한줄 소개")
                .price(price)
                .description("설명")
                .size("FREE")
                .conditionCode(ConditionCode.S_GRADE)
                .categoryCode(CategoryCode.TOP)
                .build());
    }

    /** 단일 상품 + OrderItem 1건으로 주문 생성. itemPrice 합계 = totalProductPrice */
    public Order createPendingOrder(User user, Product product) {
        Order order = orderRepository.save(Order.builder()
                .user(user)
                .orderNumber("ORD-" + UUID.randomUUID().toString().substring(0, 25))  // varchar(30) 제한
                .orderType(OrderType.DIRECT)
                .build());
        orderItemRepository.save(OrderItem.builder()
                .order(order)
                .product(product)
                .price(product.getPrice())
                .productName(product.getProductName())
                .build());
        return order;
    }

    public CouponMaster createCouponMaster(String name, CouponType type, int discountPrice, boolean active) {
        CouponMaster master = couponMasterRepository.save(CouponMaster.builder()
                .couponName(name)
                .couponType(type)
                .discountPrice(discountPrice)
                .build());
        if (!active) {
            master.deactivate();
            couponMasterRepository.flush();
        }
        return master;
    }

    public Coupon issueCoupon(User owner, CouponMaster master, ZonedDateTime expiredAt) {
        return couponRepository.save(Coupon.builder()
                .couponMaster(master)
                .user(owner)
                .expiredAt(expiredAt)
                .build());
    }

    /** AVAILABLE 상태 그대로 둔 채 만료 시각만 과거로 — Lazy expiration 검증용 */
    public Coupon issueExpiredCoupon(User owner, CouponMaster master) {
        return issueCoupon(owner, master, ZonedDateTime.now().minusDays(1));
    }

    /** USED 상태 쿠폰 (소비 처리해서 저장) */
    public Coupon issueUsedCoupon(User owner, CouponMaster master) {
        Coupon coupon = issueCoupon(owner, master, ZonedDateTime.now().plusDays(7));
        coupon.use();
        return couponRepository.save(coupon);  // save로 명시적 merge — TestComponent에 트랜잭션 없어 dirty checking 안 됨
    }
}
