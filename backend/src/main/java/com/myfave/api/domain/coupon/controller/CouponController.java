package com.myfave.api.domain.coupon.controller;

import com.myfave.api.domain.coupon.dto.request.CouponIssueRequest;
import com.myfave.api.domain.coupon.dto.response.CouponIssueResponse;
import com.myfave.api.domain.coupon.service.CouponService;
import com.myfave.api.global.common.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/coupons")
@RequiredArgsConstructor
public class CouponController {

    private final CouponService couponService;

    // 8-2. 사용자 쿠폰 지급 (인플루언서 전용)
    @PostMapping
    public ResponseEntity<ApiResponse<CouponIssueResponse>> issueCoupon(
            @RequestBody @Valid CouponIssueRequest request) {
        // TODO: JWT에서 requesterId 가져오기 (지금은 임시로 1L — 인플루언서 ID와 동일)
        Long requesterId = 1L;
        CouponIssueResponse response = couponService.issueCoupon(requesterId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("쿠폰이 지급되었습니다.", response));
    }
}
