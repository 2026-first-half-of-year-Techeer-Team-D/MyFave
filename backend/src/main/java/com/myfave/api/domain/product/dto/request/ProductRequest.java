package com.myfave.api.domain.product.dto.request;

import com.myfave.api.domain.product.entity.CategoryCode;
import com.myfave.api.domain.product.entity.ConditionCode;
import lombok.Getter;

@Getter
public class ProductRequest {

    private String productName;
    private String shortReview;
    private Integer price;
    private String description;
    private String size;
    private ConditionCode conditionCode;
    private CategoryCode categoryCode;
}
