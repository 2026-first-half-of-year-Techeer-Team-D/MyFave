package com.myfave.api.domain.content.entity;

import com.myfave.api.global.error.CustomException;
import com.myfave.api.global.error.ErrorCode;

// 콘텐츠 종류 — 조회수 카운터·좋아요 등 폴리모픽 식별자
public enum ContentType {
    SHORT_FORM,
    STYLE_FEED;

    // 경로 변수 등 외부 입력 파싱 (대소문자 무관)
    public static ContentType from(String raw) {
        try {
            return ContentType.valueOf(raw.trim().toUpperCase());
        } catch (IllegalArgumentException | NullPointerException e) {
            throw new CustomException(ErrorCode.COMMON_INVALID_INPUT);
        }
    }
}
