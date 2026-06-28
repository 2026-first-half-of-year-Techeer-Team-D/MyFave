package com.myfave.api.domain.content.dto.response;

import com.myfave.api.domain.content.entity.ShortForm;
import com.myfave.api.domain.content.entity.ShortFormType;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;


@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PRIVATE) // Redis 캐시 역직렬화용
public class ShortFormResponse {

    private Long shortFormId;
    private ShortFormType displayType;
    private String videoUrl;
    private String thumbnailUrl;
    private Long productId;
    private String productName;
    private Integer price;
    private Long viewCount; // 목록은 DB 확정값 (Redis 미반영분은 write-back 후 반영)

    public static ShortFormResponse from(ShortForm shortForm) {
        return new ShortFormResponse(
                shortForm.getShortFormId(),
                shortForm.getDisplayType(),
                shortForm.getVideoUrl(),
                shortForm.getThumbnailUrl(),
                shortForm.getProduct() != null ? shortForm.getProduct().getProductId() : null,
                shortForm.getProduct() != null ? shortForm.getProduct().getProductName() : null,
                shortForm.getProduct() != null ? shortForm.getProduct().getPrice() : null,
                shortForm.getViewCount()
        );
    }
}
