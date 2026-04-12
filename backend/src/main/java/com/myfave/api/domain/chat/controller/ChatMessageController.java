package com.myfave.api.domain.chat.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.myfave.api.domain.chat.dto.request.ChatMessageRequest;
import com.myfave.api.domain.chat.service.ChatMessageService;
import com.myfave.api.domain.chat.service.RedisPublisher;
import com.myfave.api.domain.user.entity.User;
import com.myfave.api.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.time.Duration;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Controller
@RequiredArgsConstructor
public class ChatMessageController {

    private static final Duration RATE_LIMIT_TTL = Duration.ofSeconds(3);

    private final RedisTemplate<String, Object> redisTemplate;
    private final UserRepository userRepository;
    private final ChatMessageService chatMessageService;
    private final RedisPublisher redisPublisher;
    private final SimpMessagingTemplate messagingTemplate;
    private final ObjectMapper objectMapper;

    @MessageMapping("/chat/{roomId}")
    public void sendMessage(@DestinationVariable Long roomId,
                            ChatMessageRequest request,
                            SimpMessageHeaderAccessor headerAccessor) throws JsonProcessingException {

        Long userId = (Long) headerAccessor.getSessionAttributes().get("userId");
        // TODO: 테스트 후 제거 — JWT 인터셉터 활성화 시 아래 fallback 삭제
        if (userId == null) userId = 1L;

        // Rate Limiting
        String rateLimitKey = "rate:limit:" + userId;
        if (Boolean.TRUE.equals(redisTemplate.hasKey(rateLimitKey))) {
            messagingTemplate.convertAndSendToUser(
                    String.valueOf(userId),
                    "/queue/errors",
                    Map.of("type", "RATE_LIMIT", "message", "도배 방지 제한")
            );
            return;
        }
        redisTemplate.opsForValue().set(rateLimitKey, "1", RATE_LIMIT_TTL);

        if (!"SEND_MESSAGE".equals(request.getType()) || request.getPayload() == null
                || request.getPayload().getContent() == null
                || request.getPayload().getContent().isBlank()) {
            return;
        }

        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return;

        // 메시지 페이로드 구성
        Map<String, Object> payload = Map.of(
                "messageId", UUID.randomUUID().toString(),
                "userId", userId,
                "nickname", user.getNickname(),
                "content", request.getPayload().getContent(),
                "sentAt", LocalTime.now().format(DateTimeFormatter.ofPattern("HH:mm"))
        );
        Map<String, Object> response = Map.of("type", "NEW_MESSAGE", "payload", payload);

        String json = objectMapper.writeValueAsString(response);

        // Redis List 저장 + Pub/Sub 발행
        chatMessageService.save(roomId, response);
        redisPublisher.publish(roomId, json);
    }
}
