package com.myfave.api.domain.shipping.controller;

import com.myfave.api.domain.shipping.service.ShippingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.myfave.api.domain.shipping.dto.response.ShippingAddressResponse;
import com.myfave.api.global.common.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import com.myfave.api.domain.shipping.dto.request.ShippingAddressRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@RestController
@RequestMapping("/shipping")
@RequiredArgsConstructor
public class ShippingController {

    private final ShippingService shippingService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ShippingAddressResponse>>> getShippingAddresses() {
        Long userId = 1L;
        List<ShippingAddressResponse> response = shippingService.getShippingAddresses(userId);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    // 7-2. 배송지 추가
    @PostMapping
    public ResponseEntity<ApiResponse<ShippingAddressResponse>> addShippingAddress(
            @RequestBody @Valid ShippingAddressRequest request) {
        Long userId = 1L;
        ShippingAddressResponse response = shippingService.addShippingAddress(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("배송지가 등록되었습니다.", response));
    }

    // 7-3. 배송지 삭제
    @DeleteMapping("/{addressId}")
    public ResponseEntity<ApiResponse<Void>> deleteShippingAddress(
            @PathVariable Long addressId) {
        Long userId = 1L;
        shippingService.deleteShippingAddress(userId, addressId);
        return ResponseEntity.ok(ApiResponse.ok("배송지가 삭제되었습니다."));
    }
}