package com.myfave.api.domain.content.repository;

import com.myfave.api.domain.content.entity.ShortForm;
import com.myfave.api.domain.product.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import com.myfave.api.domain.content.entity.ShortFormType;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;



import java.util.List;

public interface ShortFormRepository extends JpaRepository<ShortForm, Long> {

    // 상품과 연결된 숏폼 목록
    List<ShortForm> findByProduct(Product product);
    List<ShortForm> findByDisplayType(ShortFormType displayType, Pageable pageable);

    // 커서 기반 숏폼 조회 — Product까지 LEFT JOIN FETCH (BANNER는 product가 null이라 LEFT)
    // type이 null이면 전체, cursor가 null이면 첫 페이지
    @Query("SELECT s FROM ShortForm s LEFT JOIN FETCH s.product " +
            "WHERE (:type IS NULL OR s.displayType = :type) " +
            "AND (:cursor IS NULL OR s.shortFormId < :cursor) " +
            "ORDER BY s.shortFormId DESC")
    List<ShortForm> findByCursor(@Param("type") ShortFormType type,
                                 @Param("cursor") Long cursor,
                                 Pageable pageable);

    // 조회수 write-back — 누적 delta를 한 번에 더함 (엔티티 미로딩, 행 단위 +)
    @Modifying
    @Query("UPDATE ShortForm s SET s.viewCount = s.viewCount + :delta WHERE s.shortFormId = :id")
    int addViewCount(@Param("id") Long id, @Param("delta") long delta);

}
