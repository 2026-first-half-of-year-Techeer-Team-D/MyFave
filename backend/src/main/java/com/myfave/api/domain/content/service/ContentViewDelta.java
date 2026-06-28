package com.myfave.api.domain.content.service;

import com.myfave.api.domain.content.entity.ContentType;

// write-back 1건 — 콘텐츠 1개의 누적 조회수 증분
// member: Redis dirty set 멤버 문자열(예: "SHORT_FORM:5"), 차감 시 키 재구성에 사용
public record ContentViewDelta(ContentType type, Long id, long delta, String member) {
}
