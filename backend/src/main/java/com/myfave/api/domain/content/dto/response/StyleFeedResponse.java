package com.myfave.api.domain.content.dto.response;

import com.myfave.api.domain.content.entity.StyleFeed;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PRIVATE) // Redis 캐시 역직렬화용
public class StyleFeedResponse {

    private Long styleFeedId;
    private Long productId;
    private String imageUrl;

    public static StyleFeedResponse from(StyleFeed styleFeed) {
        return new StyleFeedResponse(
                styleFeed.getStyleFeedId(),
                styleFeed.getProduct().getProductId(),
                styleFeed.getImageUrl()
        );
    }
}
