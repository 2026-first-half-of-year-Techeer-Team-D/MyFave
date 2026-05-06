package com.myfave.api.domain.payment.controller;

import com.myfave.api.domain.payment.dto.request.PaymentPrepareRequest;
import com.myfave.api.domain.payment.dto.response.PaymentPrepareResponse;
import com.myfave.api.domain.payment.service.PaymentService;
import com.myfave.api.global.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Payment", description = "결제 API")
@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    /**
     * 결제 준비 (API 1)
     * POST /api/v1/payments/prepare
     */
    @Operation(
            summary = "결제 준비",
            description = "주문에 대한 결제를 준비합니다. 서버에서 금액을 계산하고 Payment 레코드를 생성합니다.\n\n" +
                          "- 반환된 idempotencyKey와 totalPaymentPrice를 클라이언트에서 PortOne SDK 호출 시 사용하세요.\n" +
                          "- 동일 주문에 진행 중인 결제가 있으면 409 반환"
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "결제 준비 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "입력값 오류 또는 쿠폰 타입 불일치"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 토큰 없음 또는 만료"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "주문 / 쿠폰 없음"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "이미 진행 중인 결제 또는 동시 요청 충돌")
    })
    @PostMapping("/prepare")
    public ResponseEntity<ApiResponse<PaymentPrepareResponse>> preparePayment(
            @AuthenticationPrincipal Long userId,
            @RequestBody @Valid PaymentPrepareRequest request) {

        PaymentPrepareResponse response = paymentService.preparePayment(userId, request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.created("결제 준비가 완료되었습니다.", response));
    }
}
