package com.myfave.api.domain.product.service;

import com.myfave.api.domain.product.dto.response.ProductListResponse;
import com.myfave.api.domain.product.dto.response.ProductResponse;
import com.myfave.api.domain.product.entity.CategoryCode;
import com.myfave.api.domain.product.entity.Product;
import com.myfave.api.domain.product.entity.ProductImage;
import com.myfave.api.domain.product.repository.ProductImageRepository;
import com.myfave.api.domain.product.repository.ProductRepository;
import com.myfave.api.global.error.CustomException;
import com.myfave.api.global.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductService {

    private final ProductRepository productRepository; //상품 데이터
    private final ProductImageRepository productImageRepository; //이미지 데이터

    // 3-1. 상품 목록 조회
    public ProductListResponse getProducts(CategoryCode categoryCode, int page, int size, String sort) {
        Sort sorting = resolveSort(sort);
        Pageable pageable = PageRequest.of(page, size, sorting);

        Page<Product> productPage;
        //1. 카테고리가 없거나 all 이면 전체에서 꺼내기
        if (categoryCode == null || categoryCode == CategoryCode.ALL) {
            productPage = productRepository.findByDeletedAtIsNull(pageable);
        } else {
            //2. 특정 카테고리가 있으면 그 카테고리만 꺼내기
            productPage = productRepository.findByCategoryCodeAndDeletedAtIsNull(categoryCode, pageable);
        }
        // 꺼낸 상품에 각각 대표 이미지 붙이기
        Page<ProductResponse> responsePage = productPage.map(product -> {
            String thumbnailUrl = productImageRepository.findByProductAndIsMainTrue(product)
                    .map(ProductImage::getImageUrl)
                    .orElse(null);
            return ProductResponse.from(product, thumbnailUrl);
        });

        return ProductListResponse.from(responsePage);
    }

    // 3-2. 상품 상세 조회
    public ProductResponse.Detail getProduct(Long productId) {
        // ID기반으로 찾고 못찾으면 404 에러
        Product product = productRepository.findByProductIdAndDeletedAtIsNull(productId)
                .orElseThrow(() -> new CustomException(ErrorCode.PRODUCT_NOT_FOUND));

        List<ProductImage> images = productImageRepository.findByProductOrderBySortOrderAsc(product);

        return ProductResponse.Detail.from(product, images);
    }
    // 정렬 파라미터("price,asc" 등)를 JPA Sort 객체로 변환 (기본값: 최신순)
    private Sort resolveSort(String sort) {
        if (sort == null || sort.isBlank()) {
            return Sort.by(Sort.Direction.DESC, "createdAt");
        }
        String[] parts = sort.split(",");
        if (parts.length != 2) {
            return Sort.by(Sort.Direction.DESC, "createdAt");
        }
        String field = parts[0].trim();
        String direction = parts[1].trim().toLowerCase();
        Sort.Direction dir = "asc".equals(direction) ? Sort.Direction.ASC : Sort.Direction.DESC;
        return Sort.by(dir, field);
    }
}
