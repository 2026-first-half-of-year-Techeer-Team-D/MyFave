package com.myfave.api.domain.coupon.controller;

import com.myfave.api.domain.coupon.dto.response.CouponResponse;
import com.myfave.api.domain.coupon.entity.CouponStatus;
import com.myfave.api.domain.coupon.service.CouponService;
import com.myfave.api.global.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/coupons")
@RequiredArgsConstructor
public class CouponController {

    private final CouponService couponService;

    // 8-1. 보유 쿠폰 목록 조회
    @GetMapping
    public ResponseEntity<ApiResponse<List<CouponResponse>>> getMyCoupons(
            @RequestParam(required = false) CouponStatus status) {
        // TODO: JWT에서 userId 가져오기 (지금은 임시로 1L)
        Long userId = 1L;
        List<CouponResponse> response = couponService.getMyCoupons(userId, status);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }
}
