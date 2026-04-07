package com.myfave.api.domain.product.dto.request;

import com.myfave.api.domain.product.entity.CategoryCode;
import com.myfave.api.domain.product.entity.ConditionCode;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.Getter;

import java.util.List;

@Getter
public class ProductUpdateRequest {

    @Size(max = 100, message = "상품명은 100자 이하입니다")
    private String productName;

    @PositiveOrZero(message = "가격은 0 이상이어야 합니다")
    private Integer price;

    private String description;

    @Size(max = 100, message = "한줄 소개는 100자 이하입니다")
    private String shortReview;

    private String size;

    private ConditionCode condition;

    private CategoryCode categoryCode;

    private List<Long> deleteImageIds;
}
