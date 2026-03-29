package com.myfave.api.domain.coupon.dto.response;

import com.myfave.api.domain.coupon.entity.Coupon;
import com.myfave.api.domain.coupon.entity.CouponStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.ZonedDateTime;

@Getter
@AllArgsConstructor
public class CouponResponse {

    private Long couponId;
    private String couponName;
    private Integer discountPrice;
    private CouponStatus status;
    private ZonedDateTime expiredAt;

    public static CouponResponse from(Coupon coupon) {
        return new CouponResponse(
                coupon.getCouponId(),
                coupon.getCouponMaster().getCouponName(),
                coupon.getCouponMaster().getDiscountPrice(),
                coupon.getStatus(),
                coupon.getExpiredAt()
        );
    }
}
