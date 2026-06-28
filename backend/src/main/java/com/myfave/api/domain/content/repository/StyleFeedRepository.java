package com.myfave.api.domain.content.repository;

import com.myfave.api.domain.content.entity.StyleFeed;
import com.myfave.api.domain.product.entity.Product;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface StyleFeedRepository extends JpaRepository<StyleFeed, Long> {

    // 상품과 연결된 스타일 피드 목록
    List<StyleFeed> findByProduct(Product product);

    // 커서 기반 피드 조회 — Product까지 JOIN FETCH (N+1 제거)
    // cursor가 null이면 첫 페이지, 아니면 cursor 미만 id를 최신순 조회
    @Query("SELECT sf FROM StyleFeed sf JOIN FETCH sf.product " +
            "WHERE (:cursor IS NULL OR sf.styleFeedId < :cursor) " +
            "ORDER BY sf.styleFeedId DESC")
    List<StyleFeed> findByCursor(@Param("cursor") Long cursor, Pageable pageable);
}
