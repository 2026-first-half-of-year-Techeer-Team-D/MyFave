package com.myfave.api.domain.chat.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatMessageService {

    private static final Duration HISTORY_TTL = Duration.ofMinutes(30);

    private final RedisTemplate<String, Object> redisTemplate;
    private final ObjectMapper objectMapper;

    private String historyKey(Long roomId) {
        return "chat:room:" + roomId + ":messages";
    }

    public void save(Long roomId, Object message) {
        try {
            String json = objectMapper.writeValueAsString(message);
            String key = historyKey(roomId);
            redisTemplate.opsForList().rightPush(key, json);
            redisTemplate.expire(key, HISTORY_TTL);
        } catch (JsonProcessingException e) {
            log.error("히스토리 저장 실패: roomId={}", roomId, e);
        }
    }

    public List<String> getHistory(Long roomId) {
        List<Object> raw = redisTemplate.opsForList().range(historyKey(roomId), 0, -1);
        if (raw == null || raw.isEmpty()) return Collections.emptyList();
        return raw.stream().map(Objects::toString).collect(Collectors.toList());
    }

    public void deleteHistory(Long roomId) {
        redisTemplate.delete(historyKey(roomId));
    }
}
