package com.myfave.api.domain.coupon.repository;

import com.myfave.api.domain.coupon.entity.Coupon;
import com.myfave.api.domain.coupon.entity.CouponStatus;
import com.myfave.api.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.ZonedDateTime;
import java.util.List;

public interface CouponRepository extends JpaRepository<Coupon, Long> {

    // 사용자의 쿠폰 목록
    List<Coupon> findByUser(User user);

    // 사용 가능한 쿠폰만
    List<Coupon> findByUserAndStatus(User user, CouponStatus status);

    // Lazy 만료 전환: 해당 사용자의 AVAILABLE 쿠폰 중 만료된 것을 EXPIRED로 일괄 전환
    // 벌크 UPDATE는 @LastModifiedDate 리스너가 동작하지 않으므로 updatedAt을 명시적으로 갱신
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("UPDATE Coupon c SET c.status = com.myfave.api.domain.coupon.entity.CouponStatus.EXPIRED, " +
            "c.updatedAt = :now " +
            "WHERE c.user = :user " +
            "AND c.status = com.myfave.api.domain.coupon.entity.CouponStatus.AVAILABLE " +
            "AND c.expiredAt < :now")
    int expireAvailableCouponsBefore(@Param("user") User user, @Param("now") ZonedDateTime now);
}
