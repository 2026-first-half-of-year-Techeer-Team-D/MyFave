package com.myfave.api.domain.content.repository;

import com.myfave.api.domain.content.entity.ShortForm;
import com.myfave.api.domain.product.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ShortFormRepository extends JpaRepository<ShortForm, Long> {

    // 상품과 연결된 숏폼 목록
    List<ShortForm> findByProduct(Product product);
}
