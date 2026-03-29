package com.myfave.api.domain.product.repository;

import com.myfave.api.domain.product.entity.CategoryCode;
import com.myfave.api.domain.product.entity.Product;
import com.myfave.api.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    // 인플루언서가 등록한 상품 목록
    List<Product> findByUser(User user);

    // 판매 중인 상품만 (품절 제외)
    List<Product> findByIsSoldoutFalse();

    // 카테고리별 조회
    List<Product> findByCategoryCodeAndIsSoldoutFalse(CategoryCode categoryCode);
}
