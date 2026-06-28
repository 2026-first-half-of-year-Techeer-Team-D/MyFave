package com.myfave.api.domain.content.dto.response;

import com.myfave.api.domain.content.entity.ContentType;
import lombok.AllArgsConstructor;
import lombok.Getter;

// 조회수 증가 응답 — DB 확정값 + Redis 미반영 증분 합산한 최신 총합
@Getter
@AllArgsConstructor
public class ContentViewResponse {

    private ContentType contentType;
    private Long contentId;
    private Long viewCount;
}
