package com.myfave.api.global.common;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 커서(키셋) 기반 목록 응답
 * offset 페이징과 달리 total 없이 다음 요청용 커서만 전달
 * 무한스크롤 클라이언트는 hasNext가 true인 동안 nextCursor를 이어받아 요청
 * NoArgsConstructor는 Redis 캐시 역직렬화(필드 접근)용
 */
@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class CursorResponse<T> {

    private List<T> items;
    private Long nextCursor;
    private boolean hasNext;

    public static <T> CursorResponse<T> of(List<T> items, Long nextCursor, boolean hasNext) {
        return new CursorResponse<>(items, nextCursor, hasNext);
    }
}
