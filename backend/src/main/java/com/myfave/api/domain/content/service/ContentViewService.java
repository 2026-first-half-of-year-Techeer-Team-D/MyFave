package com.myfave.api.domain.content.service;

import com.myfave.api.domain.content.entity.ContentType;
import com.myfave.api.domain.content.repository.ShortFormRepository;
import com.myfave.api.domain.content.repository.StyleFeedRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

/**
 * 조회수 카운터 — 조회 시점에 Redis에만 누적 (쓰기 DB 미접근, 락 없음)
 * 실제 DB 반영은 ContentViewCountScheduler가 주기적으로 write-back
 * 조회수는 1~2개 틀려도 무방한 고빈도 쓰기라 정확성 대신 속도 선택
 */
@Service
@RequiredArgsConstructor
public class ContentViewService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final ShortFormRepository shortFormRepository;
    private final StyleFeedRepository styleFeedRepository;

    // counter:* 키엔 TTL 없음 — cache:*(만료 O)와 네임스페이스 분리
    public static final String COUNTER_KEY_PREFIX = "counter:view:";
    // write-back 대상 키 집합 — 스케줄러가 전체 SCAN 없이 이 set만 순회
    public static final String DIRTY_SET_KEY = "counter:view:dirty";

    // 조회수 증가 후 최신 총합 반환 — Redis INCR(쓰기 락 없음) + DB 확정값 read(non-locking)
    public long incrementAndGetTotal(ContentType type, Long contentId) {
        long pending = increment(type, contentId);
        Long dbCount = findDbViewCount(type, contentId);
        return (dbCount == null ? 0L : dbCount) + pending;
    }

    // Redis 증분 한 줄 — member 예: "SHORT_FORM:5"
    public long increment(ContentType type, Long contentId) {
        String member = type.name() + ":" + contentId;
        Long count = redisTemplate.opsForValue().increment(COUNTER_KEY_PREFIX + member);
        redisTemplate.opsForSet().add(DIRTY_SET_KEY, member);
        return count == null ? 0L : count;
    }

    // DB 확정 조회수 (write-back 완료분). 없는 콘텐츠면 null
    private Long findDbViewCount(ContentType type, Long contentId) {
        return switch (type) {
            case SHORT_FORM -> shortFormRepository.findViewCountById(contentId);
            case STYLE_FEED -> styleFeedRepository.findViewCountById(contentId);
        };
    }
}
