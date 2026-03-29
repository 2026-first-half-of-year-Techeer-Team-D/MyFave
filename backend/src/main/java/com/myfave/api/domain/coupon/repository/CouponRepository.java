package com.myfave.api.domain.coupon.repository;

import com.myfave.api.domain.coupon.entity.Coupon;
import com.myfave.api.domain.coupon.entity.CouponStatus;
import com.myfave.api.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CouponRepository extends JpaRepository<Coupon, Long> {

    // 사용자의 쿠폰 목록
    List<Coupon> findByUser(User user);

    // 사용 가능한 쿠폰만
    List<Coupon> findByUserAndStatus(User user, CouponStatus status);
}
