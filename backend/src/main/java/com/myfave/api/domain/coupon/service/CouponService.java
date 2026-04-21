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

import java.time.ZonedDateTime;
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

    // 8-3. 쿠폰 사용 (Payment/Order 도메인 트랜잭션 내에서 호출)
    @Transactional
    public void useCoupon(Long couponId, Long userId) {
        Coupon coupon = couponRepository.findById(couponId)
                .orElseThrow(() -> new CustomException(ErrorCode.COUPON_NOT_FOUND));

        if (!coupon.getUser().getUserId().equals(userId)) {
            throw new CustomException(ErrorCode.AUTH_FORBIDDEN);
        }

        // Lazy 만료 전환: AVAILABLE이지만 만료 지난 경우 EXPIRED로 전환 후 예외
        if (coupon.getStatus() == CouponStatus.AVAILABLE
                && coupon.getExpiredAt().isBefore(ZonedDateTime.now())) {
            coupon.expire();
            throw new CustomException(ErrorCode.COUPON_EXPIRED);
        }

        switch (coupon.getStatus()) {
            case USED -> throw new CustomException(ErrorCode.COUPON_ALREADY_USED);
            case EXPIRED -> throw new CustomException(ErrorCode.COUPON_EXPIRED);
            case AVAILABLE -> coupon.use();
        }
    }
}
