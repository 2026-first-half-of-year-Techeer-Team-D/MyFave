package com.myfave.api.domain.coupon.service;

import com.myfave.api.domain.coupon.dto.request.CouponIssueRequest;
import com.myfave.api.domain.coupon.dto.response.CouponIssueResponse;
import com.myfave.api.domain.coupon.entity.Coupon;
import com.myfave.api.domain.coupon.entity.CouponMaster;
import com.myfave.api.domain.coupon.repository.CouponMasterRepository;
import com.myfave.api.domain.coupon.repository.CouponRepository;
import com.myfave.api.domain.user.entity.User;
import com.myfave.api.domain.user.repository.UserRepository;
import com.myfave.api.global.error.CustomException;
import com.myfave.api.global.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CouponService {

    private static final int DEFAULT_VALID_DAYS = 7;

    private final CouponRepository couponRepository;
    private final CouponMasterRepository couponMasterRepository;
    private final UserRepository userRepository;

    @Value("${influencer.user-id}")
    private Long influencerUserId;

    // 8-2. 사용자 쿠폰 지급 (인플루언서 전용)
    @Transactional
    public CouponIssueResponse issueCoupon(Long requesterId, CouponIssueRequest request) {
        // 1) 인플루언서 권한 체크
        if (!influencerUserId.equals(requesterId)) {
            throw new CustomException(ErrorCode.AUTH_FORBIDDEN);
        }

        // 2) 마스터 쿠폰 조회 + 활성화 여부 검증
        CouponMaster couponMaster = couponMasterRepository.findById(request.getMasterCouponId())
                .orElseThrow(() -> new CustomException(ErrorCode.COUPON_MASTER_NOT_FOUND));

        if (Boolean.FALSE.equals(couponMaster.getIsActive())) {
            throw new CustomException(ErrorCode.COUPON_MASTER_INACTIVE);
        }

        // 3) 지급 대상 사용자 조회
        User targetUser = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        // 4) 쿠폰 발급 (발급일 + 7일 만료)
        Coupon coupon = Coupon.builder()
                .couponMaster(couponMaster)
                .user(targetUser)
                .expiredAt(ZonedDateTime.now().plusDays(DEFAULT_VALID_DAYS))
                .build();

        couponRepository.save(coupon);

        return CouponIssueResponse.from(coupon);
    }
}
