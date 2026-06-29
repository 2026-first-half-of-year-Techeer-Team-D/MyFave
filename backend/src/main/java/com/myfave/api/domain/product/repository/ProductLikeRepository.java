package com.myfave.api.domain.product.repository;

import com.myfave.api.domain.product.entity.ProductLike;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductLikeRepository extends JpaRepository<ProductLike, Long> {

    // 현재 유저가 해당 상품을 좋아요 했는지 (상세 liked 표시용)
    boolean existsByUser_UserIdAndProduct_ProductId(Long userId, Long productId);

    // 좋아요 취소 — 삭제된 행 수 반환 (0이면 좋아요 없던 상태)
    long deleteByUser_UserIdAndProduct_ProductId(Long userId, Long productId);
}
