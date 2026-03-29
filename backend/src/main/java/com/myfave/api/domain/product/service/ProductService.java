package com.myfave.api.domain.product.service;

import com.myfave.api.domain.product.repository.ProductImageRepository;
import com.myfave.api.domain.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;
}
