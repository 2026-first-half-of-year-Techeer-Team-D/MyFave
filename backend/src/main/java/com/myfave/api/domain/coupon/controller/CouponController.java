package com.myfave.api.domain.coupon.controller;

import com.myfave.api.domain.coupon.dto.request.CouponIssueRequest;
import com.myfave.api.domain.coupon.dto.response.CouponIssueResponse;
import com.myfave.api.domain.coupon.dto.response.CouponResponse;
import com.myfave.api.domain.coupon.entity.CouponStatus;
import com.myfave.api.domain.coupon.service.CouponService;
import com.myfave.api.global.common.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
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

    /**
     * 8-2. 사용자 쿠폰 지급 (인플루언서 전용)
     *
     * TODO [Sprint 4 JWT 활성화 시 필수 교체]
     *  - @RequestHeader("X-User-Id") Long requesterId
     *    → @AuthenticationPrincipal UserDetailsImpl userDetails 로 교체
     *  - 메서드 본문: Long requesterId = userDetails.getUserId();
     *
     *  [왜 지금 헤더 방식?]
     *  8-2는 인플루언서 권한 체크가 핵심 비즈니스 로직이라,
     *  JWT 복구 전까지 X-User-Id 헤더로 요청자 ID를 임시 전달받아 권한 체크 검증.
     *  (다른 도메인은 userId=1L 하드코딩이지만, 이 API는 권한 체크를 실제 테스트 가능하게
     *   변동 가능한 입력 소스로 받음. 서비스 레이어 권한 체크 로직은 JWT 복구 후에도 그대로 유지.)
     */
    @PostMapping
    public ResponseEntity<ApiResponse<CouponIssueResponse>> issueCoupon(
            @RequestHeader("X-User-Id") Long requesterId,
            @RequestBody @Valid CouponIssueRequest request) {
        CouponIssueResponse response = couponService.issueCoupon(requesterId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("쿠폰이 지급되었습니다.", response));
    }
}
