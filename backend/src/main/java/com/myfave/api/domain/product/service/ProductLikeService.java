package com.myfave.api.domain.product.service;

import com.myfave.api.domain.product.dto.response.ProductLikeResponse;
import com.myfave.api.domain.product.entity.ProductLike;
import com.myfave.api.domain.product.repository.ProductLikeRepository;
import com.myfave.api.domain.product.repository.ProductRepository;
import com.myfave.api.domain.user.repository.UserRepository;
import com.myfave.api.global.error.CustomException;
import com.myfave.api.global.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 상품 좋아요 — 토글(누르면 추가/이미 눌렀으면 취소)
 * 정확성·중복방지가 필요해 DB 동기 반영 + unique 제약으로 회원당 1회 보장 (조회수와 대비)
 */
@Service
@RequiredArgsConstructor
public class ProductLikeService {

    private final ProductLikeRepository productLikeRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Transactional
    public ProductLikeResponse toggle(Long userId, Long productId) {
        // 상품 존재 검증 (soft-delete 제외) — 없는 상품에 좋아요 시 404
        if (!productRepository.existsByProductIdAndDeletedAtIsNull(productId)) {
            throw new CustomException(ErrorCode.PRODUCT_NOT_FOUND);
        }

        // 삭제 시도 → 삭제된 행이 있으면 "좋아요 취소", 없으면 "좋아요 추가" (별도 exists 조회 없이 경합 안전)
        long deleted = productLikeRepository.deleteByUser_UserIdAndProduct_ProductId(userId, productId);
        boolean liked;
        if (deleted > 0) {
            productRepository.addLikeCount(productId, -deleted);
            liked = false;
        } else {
            liked = addLike(userId, productId);
        }

        Long likeCount = productRepository.findLikeCountById(productId);
        return new ProductLikeResponse(productId, liked, likeCount == null ? 0L : likeCount);
    }

    // 좋아요 추가 — 동시 중복 insert는 unique 제약 위반으로 잡아 멱등 처리
    private boolean addLike(Long userId, Long productId) {
        try {
            ProductLike like = ProductLike.builder()
                    .user(userRepository.getReferenceById(userId))
                    .product(productRepository.getReferenceById(productId))
                    .build();
            productLikeRepository.saveAndFlush(like); // flush로 unique 위반 즉시 감지
            productRepository.addLikeCount(productId, 1);
        } catch (DataIntegrityViolationException e) {
            // 이미 좋아요된 상태 (동시 클릭 등) — 카운트 중복 증가 방지
        }
        return true;
    }
}
