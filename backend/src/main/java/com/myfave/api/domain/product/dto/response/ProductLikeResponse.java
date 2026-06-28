package com.myfave.api.domain.product.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

// 좋아요 토글 응답 — 현재 유저의 좋아요 상태(liked)와 상품 총 좋아요 수
@Getter
@AllArgsConstructor
public class ProductLikeResponse {

    private Long productId;
    private boolean liked;
    private Long likeCount;
}
