package com.myfave.api.domain.content.scheduler;

import com.myfave.api.domain.content.entity.ContentType;
import com.myfave.api.domain.content.service.ContentViewDelta;
import com.myfave.api.domain.content.service.ContentViewService;
import com.myfave.api.domain.content.service.ContentViewWriteBackService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

/**
 * 조회수 write-back 스케줄러 — 주기적으로 Redis 누적분을 DB에 반영
 * 흐름: dirty set 순회 → 각 키 누적값(delta) 수집 → DB 일괄 반영(커밋) → 커밋 후 Redis 차감
 * 전체 SCAN 없이 dirty set만 순회해 처리 비용을 최소화
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class ContentViewCountScheduler {

    private final RedisTemplate<String, Object> redisTemplate;
    private final ContentViewWriteBackService writeBackService;

    @Scheduled(fixedDelayString = "${content.view.write-back-delay-ms:30000}")
    public void flush() {
        Set<Object> members = redisTemplate.opsForSet().members(ContentViewService.DIRTY_SET_KEY);
        if (members == null || members.isEmpty()) {
            return;
        }

        // 1) dirty 멤버별 누적 delta 수집 (delta<=0이거나 손상 멤버는 정리하고 스킵)
        List<ContentViewDelta> deltas = new ArrayList<>();
        for (Object raw : members) {
            String member = raw.toString();
            long delta = readDelta(member);
            if (delta <= 0) {
                redisTemplate.opsForSet().remove(ContentViewService.DIRTY_SET_KEY, member);
                continue;
            }
            ContentViewDelta parsed = parse(member, delta);
            if (parsed != null) {
                deltas.add(parsed);
            }
        }
        if (deltas.isEmpty()) {
            return;
        }

        // 2) DB 일괄 반영 (커밋). 실패 시 Redis 미차감 → 다음 주기에 재시도 (유실 없음)
        writeBackService.applyAll(deltas);

        // 3) 커밋 성공 후 Redis 차감. 차감 사이 새로 들어온 조회분은 보존됨
        for (ContentViewDelta d : deltas) {
            String key = ContentViewService.COUNTER_KEY_PREFIX + d.member();
            Long remaining = redisTemplate.opsForValue().decrement(key, d.delta());
            if (remaining == null || remaining <= 0) {
                redisTemplate.delete(key);
                redisTemplate.opsForSet().remove(ContentViewService.DIRTY_SET_KEY, d.member());
            }
        }
        log.debug("[view-writeback] {}건 DB 반영", deltas.size());
    }

    private long readDelta(String member) {
        Object value = redisTemplate.opsForValue().get(ContentViewService.COUNTER_KEY_PREFIX + member);
        if (value == null) {
            return 0L;
        }
        try {
            return Long.parseLong(value.toString());
        } catch (NumberFormatException e) {
            return 0L;
        }
    }

    // "SHORT_FORM:5" → (SHORT_FORM, 5). 손상 멤버는 null
    private ContentViewDelta parse(String member, long delta) {
        int idx = member.lastIndexOf(':');
        if (idx < 0) {
            return null;
        }
        try {
            ContentType type = ContentType.from(member.substring(0, idx));
            Long id = Long.parseLong(member.substring(idx + 1));
            return new ContentViewDelta(type, id, delta, member);
        } catch (Exception e) {
            return null;
        }
    }
}
