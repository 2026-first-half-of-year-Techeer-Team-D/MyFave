package com.myfave.api.domain.coupon.service;

import com.myfave.api.domain.coupon.dto.response.CouponResponse;
import com.myfave.api.domain.coupon.entity.Coupon;
import com.myfave.api.domain.coupon.entity.CouponStatus;
import com.myfave.api.domain.coupon.repository.CouponMasterRepository;
import com.myfave.api.domain.coupon.repository.CouponRepository;
import com.myfave.api.domain.user.entity.User;
import com.myfave.api.domain.user.repository.UserRepository;
import com.myfave.api.global.error.CustomException;
import com.myfave.api.global.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CouponService {

    private final CouponRepository couponRepository;
    private final CouponMasterRepository couponMasterRepository;
    private final UserRepository userRepository;

    // 8-1. 보유 쿠폰 목록 조회
    public List<CouponResponse> getMyCoupons(Long userId, CouponStatus status) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        List<Coupon> coupons = (status == null)
                ? couponRepository.findByUser(user)
                : couponRepository.findByUserAndStatus(user, status);

        return coupons.stream()
                .map(CouponResponse::from)
                .toList();
    }
}
