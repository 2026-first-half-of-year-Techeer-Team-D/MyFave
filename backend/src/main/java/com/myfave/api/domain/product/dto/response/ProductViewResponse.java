package com.myfave.api.domain.product.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

// 상품 조회수 증가 응답 — DB 확정값 + Redis 미반영 증분 합산한 최신 총합
@Getter
@AllArgsConstructor
public class ProductViewResponse {

    private Long productId;
    private Long viewCount;
}
