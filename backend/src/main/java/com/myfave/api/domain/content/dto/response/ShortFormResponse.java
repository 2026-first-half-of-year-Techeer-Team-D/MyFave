package com.myfave.api.domain.content.dto.response;

import com.myfave.api.domain.content.entity.ShortForm;
import com.myfave.api.domain.content.entity.ShortFormType;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ShortFormResponse {

    private Long shortFormId;
    private Long productId;
    private String videoUrl;
    private String thumbnailUrl;
    private ShortFormType displayType;

    public static ShortFormResponse from(ShortForm shortForm) {
        return new ShortFormResponse(
                shortForm.getShortFormId(),
                shortForm.getProduct() != null ? shortForm.getProduct().getProductId() : null,
                shortForm.getVideoUrl(),
                shortForm.getThumbnailUrl(),
                shortForm.getDisplayType()
        );
    }
}
