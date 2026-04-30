package com.myfave.api.domain.content.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ContentRegisterRequest {

    @NotNull(message = "콘텐츠 유형은 필수입니다.")
    private String contentType;  // SHORT_FORM, STYLE_FEED

    private String shortFormType;  // BANNER, PRODUCT_LIST (SHORT_FORM일 때만)

    @NotNull(message = "상품 ID는 필수입니다.")
    private Long productId;
}