package com.myfave.api.domain.product.dto.response;

import com.myfave.api.domain.product.entity.CategoryCode;
import com.myfave.api.domain.product.entity.ConditionCode;
import com.myfave.api.domain.product.entity.Product;
import com.myfave.api.domain.product.entity.ProductImage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.ZonedDateTime;
import java.util.List;

@Getter
@AllArgsConstructor
public class ProductResponse {

    private Long id;
    private String productName;
    private Integer price;
    private String thumbnailUrl;
    private Boolean isSoldOut;
    private CategoryCode categoryCode;
    private Long likeCount; // 좋아요순 정렬·표시용

    public static ProductResponse from(Product product, String thumbnailUrl) {
        return new ProductResponse(
                product.getProductId(),
                product.getProductName(),
                product.getPrice(),
                thumbnailUrl,
                product.getIsSoldout(),
                product.getCategoryCode(),
                product.getLikeCount()
        );
    }

    @Getter
    @Builder
    @AllArgsConstructor
    public static class Detail {
        private Long id;
        private String productName;
        private String shortReview;
        private Integer price;
        private String description;
        private String size;
        private ConditionCode condition;
        private CategoryCode categoryCode;
        private Boolean isSoldOut;
        private Long viewCount; // DB 확정값 (Redis 미반영분은 view 엔드포인트 응답에서 합산)
        private Long likeCount; // 상품 총 좋아요 수
        private Boolean liked;  // 현재 로그인 유저의 좋아요 여부 (비로그인=false)
        private List<ImageDto> images;
        private ZonedDateTime createdAt;

        public static Detail from(Product product, List<ProductImage> images, boolean liked) {
            List<ImageDto> imageDtos = images.stream()
                    .map(ImageDto::from)
                    .toList();

            return Detail.builder()
                    .id(product.getProductId())
                    .productName(product.getProductName())
                    .shortReview(product.getShortReview())
                    .price(product.getPrice())
                    .description(product.getDescription())
                    .size(product.getSize())
                    .condition(product.getConditionCode())
                    .categoryCode(product.getCategoryCode())
                    .isSoldOut(product.getIsSoldout())
                    .viewCount(product.getViewCount())
                    .likeCount(product.getLikeCount())
                    .liked(liked)
                    .images(imageDtos)
                    .createdAt(product.getCreatedAt())
                    .build();
        }
    }

    @Getter
    @AllArgsConstructor
    public static class ImageDto {
        private Long imageId;
        private String imageUrl;
        private Integer sortOrder;
        private Boolean isMain;

        public static ImageDto from(ProductImage image) {
            return new ImageDto(
                    image.getProductImgId(),
                    image.getImageUrl(),
                    image.getSortOrder(),
                    image.getIsMain()
            );
        }
    }
}
