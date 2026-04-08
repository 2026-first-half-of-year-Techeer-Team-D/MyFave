package com.myfave.api.domain.product.controller;

import com.myfave.api.domain.product.dto.response.ProductListResponse;
import com.myfave.api.domain.product.dto.response.ProductResponse;
import com.myfave.api.domain.product.entity.CategoryCode;
import com.myfave.api.domain.product.service.ProductService;
import com.myfave.api.global.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    // 3-1. 상품 목록 조회
    @GetMapping
    public ResponseEntity<ApiResponse<ProductListResponse>> getProducts(
            @RequestParam(required = false) CategoryCode categoryCode,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String sort) {
        ProductListResponse response = productService.getProducts(categoryCode, page, size, sort);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    // 3-2. 상품 상세 조회
    @GetMapping("/{productId}")
    public ResponseEntity<ApiResponse<ProductResponse.Detail>> getProduct(
            @PathVariable Long productId) {
        ProductResponse.Detail response = productService.getProduct(productId);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }
}
