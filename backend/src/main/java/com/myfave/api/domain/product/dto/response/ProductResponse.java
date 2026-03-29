package com.myfave.api.domain.product.dto.response;

import com.myfave.api.domain.product.entity.CategoryCode;
import com.myfave.api.domain.product.entity.ConditionCode;
import com.myfave.api.domain.product.entity.Product;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ProductResponse {

    private Long productId;
    private String productName;
    private String shortReview;
    private Integer price;
    private String size;
    private ConditionCode conditionCode;
    private CategoryCode categoryCode;
    private Boolean isSoldout;

    public static ProductResponse from(Product product) {
        return new ProductResponse(
                product.getProductId(),
                product.getProductName(),
                product.getShortReview(),
                product.getPrice(),
                product.getSize(),
                product.getConditionCode(),
                product.getCategoryCode(),
                product.getIsSoldout()
        );
    }
}
