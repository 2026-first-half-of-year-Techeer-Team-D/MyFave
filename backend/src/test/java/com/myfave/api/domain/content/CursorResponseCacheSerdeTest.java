package com.myfave.api.domain.content;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.json.JsonMapper;
import com.myfave.api.domain.content.dto.response.StyleFeedResponse;
import com.myfave.api.global.common.CursorResponse;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

// ContentService 캐시 직렬화/역직렬화 라운드트립 검증 (제네릭 CursorResponse + DTO 필드 접근)
class CursorResponseCacheSerdeTest {

    private static final ObjectMapper CACHE_MAPPER = JsonMapper.builder()
            .visibility(PropertyAccessor.FIELD, JsonAutoDetect.Visibility.ANY)
            .build();

    @Test
    void cursorResponse_라운드트립() throws Exception {
        CursorResponse<StyleFeedResponse> origin = CursorResponse.of(
                List.of(new StyleFeedResponse(2L, 100L, "url2"),
                        new StyleFeedResponse(1L, 101L, "url1")),
                1L, true);

        String json = CACHE_MAPPER.writeValueAsString(origin);
        JavaType type = CACHE_MAPPER.getTypeFactory()
                .constructParametricType(CursorResponse.class, StyleFeedResponse.class);
        CursorResponse<StyleFeedResponse> restored = CACHE_MAPPER.readValue(json, type);

        assertThat(restored.isHasNext()).isTrue();
        assertThat(restored.getNextCursor()).isEqualTo(1L);
        assertThat(restored.getItems()).hasSize(2);
        assertThat(restored.getItems().get(0).getStyleFeedId()).isEqualTo(2L);
        assertThat(restored.getItems().get(0).getImageUrl()).isEqualTo("url2");
        assertThat(restored.getItems().get(1).getProductId()).isEqualTo(101L);
    }
}
