package com.myfave.api.domain.chat.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.myfave.api.domain.chat.dto.request.ChatMessageRequest;
import com.myfave.api.domain.chat.dto.response.ChatMessageResponse;
import com.myfave.api.domain.chat.service.ChatMessageService;
import com.myfave.api.domain.chat.service.RedisPublisher;
import com.myfave.api.domain.user.entity.User;
import com.myfave.api.domain.user.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.util.HtmlUtils;

import java.time.Duration;
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
                            @Valid ChatMessageRequest request,
                            SimpMessageHeaderAccessor headerAccessor) throws JsonProcessingException {

        Long userId = (Long) headerAccessor.getSessionAttributes().get("userId");
        // TODO: 테스트 후 제거 — JWT 인터셉터 활성화 시 아래 fallback 삭제
        if (userId == null) userId = 1L;

        if (!"SEND_MESSAGE".equals(request.getType())) return;

        // Rate Limiting
        String rateLimitKey = "rate:chat:" + userId;
        Long count = redisTemplate.opsForValue().increment(rateLimitKey);
        if (count != null && count == 1) {
            redisTemplate.expire(rateLimitKey, RATE_LIMIT_TTL);
        }
        if (count != null && count > 1) {
            messagingTemplate.convertAndSendToUser(
                    String.valueOf(userId),
                    "/queue/errors",
                    objectMapper.writeValueAsString(ChatMessageResponse.rateLimitError())
            );
            return;
        }

        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return;

        // XSS 방어
        String safeContent = HtmlUtils.htmlEscape(request.getPayload().getContent());

        ChatMessageResponse response = ChatMessageResponse.newMessage(
                UUID.randomUUID().toString(),
                userId,
                user.getNickname(),
                safeContent
        );

        String json = objectMapper.writeValueAsString(response);
        chatMessageService.save(roomId, json);
        redisPublisher.publish(roomId, json);
    }

    @MessageExceptionHandler
    public void handleException(Exception e, SimpMessageHeaderAccessor headerAccessor)
            throws JsonProcessingException {
        Long userId = (Long) headerAccessor.getSessionAttributes().get("userId");
        if (userId == null) userId = 1L;
        log.warn("WebSocket 메시지 처리 오류: {}", e.getMessage());
        messagingTemplate.convertAndSendToUser(
                String.valueOf(userId),
                "/queue/errors",
                objectMapper.writeValueAsString(
                        ChatMessageResponse.builder().type("ERROR").build()
                )
        );
    }
}
