package com.myfave.api.domain.product.repository;

import com.myfave.api.domain.product.entity.CategoryCode;
import com.myfave.api.domain.product.entity.Product;
import com.myfave.api.domain.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {

    // 인플루언서가 등록한 상품 목록
    List<Product> findByUser(User user);

    // 판매 중인 상품만 (품절 제외)
    List<Product> findByIsSoldoutFalse();

    // 카테고리별 조회
    List<Product> findByCategoryCodeAndIsSoldoutFalse(CategoryCode categoryCode);

    // 상품 목록 조회 (Soft Delete 제외, 전체 카테고리)
    Page<Product> findByDeletedAtIsNull(Pageable pageable);

    // 상품 목록 조회 (Soft Delete 제외, 특정 카테고리)
    Page<Product> findByCategoryCodeAndDeletedAtIsNull(CategoryCode categoryCode, Pageable pageable);

    // 상품 상세 조회 (Soft Delete 제외)
    Optional<Product> findByProductIdAndDeletedAtIsNull(Long productId);
}
