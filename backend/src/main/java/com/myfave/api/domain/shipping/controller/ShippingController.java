package com.myfave.api.domain.shipping.controller;

import com.myfave.api.domain.shipping.service.ShippingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.myfave.api.domain.shipping.dto.response.ShippingAddressResponse;
import com.myfave.api.global.common.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@RestController
@RequestMapping("/shipping")
@RequiredArgsConstructor
public class ShippingController {

    private final ShippingService shippingService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ShippingAddressResponse>>> getShippingAddresses() {
        Long userId = 1L; //임시 하드코딩
        List<ShippingAddressResponse> response = shippingService.getShippingAddresses(userId);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }
}

