package com.myfave.api.domain.product.service;

import com.myfave.api.domain.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

/**
 * 상품 조회수 write-back DB 반영 — 누적 증분들을 한 트랜잭션으로 DB에 더함
 * 스케줄러와 분리한 이유: "DB 커밋 성공 후 Redis 차감" 순서를 보장하기 위함
 * (이 메서드가 정상 반환=커밋 완료 후에야 스케줄러가 Redis를 차감)
 */
@Service
@RequiredArgsConstructor
public class ProductViewWriteBackService {

    private final ProductRepository productRepository;

    // key: productId, value: 누적 delta
    @Transactional
    public void applyAll(Map<Long, Long> deltas) {
        deltas.forEach((id, delta) -> productRepository.addViewCount(id, delta));
    }
}
