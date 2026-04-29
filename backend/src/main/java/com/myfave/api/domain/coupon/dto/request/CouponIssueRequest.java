package com.myfave.api.domain.coupon.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class CouponIssueRequest {

    @NotNull
    private Long masterCouponId;

    @NotNull
    private Long userId;
}
