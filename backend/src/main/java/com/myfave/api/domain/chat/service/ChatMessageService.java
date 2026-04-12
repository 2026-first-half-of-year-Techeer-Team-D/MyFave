package com.myfave.api.domain.chat.service;

import com.myfave.api.domain.chat.dto.response.ChatMessageResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatMessageService {

    private static final String CHAT_HISTORY_KEY = "chat:history:";
    private static final long HISTORY_TTL_HOURS = 24;
    private static final int MAX_MESSAGES = 200;

    private final RedisTemplate<String, Object> redisTemplate;

    public void save(Long roomId, ChatMessageResponse response) {
        String key = CHAT_HISTORY_KEY + roomId;
        redisTemplate.opsForList().rightPush(key, response.toString());
        redisTemplate.opsForList().trim(key, -MAX_MESSAGES, -1);
        redisTemplate.expire(key, Duration.ofHours(HISTORY_TTL_HOURS));
        log.debug("메시지 저장: roomId={}", roomId);
    }
}
