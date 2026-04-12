package com.myfave.api.domain.chat.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.myfave.api.domain.chat.dto.request.ChatMessageRequest;
import com.myfave.api.domain.chat.dto.response.ChatMessageResponse;
import com.myfave.api.domain.chat.service.ChatMessageService;
import com.myfave.api.domain.chat.service.RedisPublisher;
import com.myfave.api.domain.user.entity.User;
import com.myfave.api.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.UUID;

@Slf4j
@Controller
@RequiredArgsConstructor
public class ChatMessageController {

    private final RedisPublisher redisPublisher;
    private final ChatMessageService chatMessageService;
    private final SimpMessagingTemplate messagingTemplate;
    private final ObjectMapper objectMapper;
    private final UserRepository userRepository;

    @MessageMapping("/chat/{roomId}")
    public void sendMessage(@DestinationVariable Long roomId,
                            ChatMessageRequest request,
                            SimpMessageHeaderAccessor headerAccessor) throws JsonProcessingException {

        Long userId = (Long) headerAccessor.getSessionAttributes().get("userId");
        // TODO: 테스트 후 제거 — JWT 인터셉터 활성화 시 아래 fallback 삭제
        if (userId == null) userId = 1L;

        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            log.warn("사용자 없음: userId={}", userId);
            return;
        }

        ChatMessageResponse response = ChatMessageResponse.newMessage(
                UUID.randomUUID().toString(),
                userId,
                user.getNickname(),
                request.getPayload().getContent()
        );

        String json = objectMapper.writeValueAsString(response);
        chatMessageService.save(roomId, response);
        redisPublisher.publish(roomId, json);
    }
}
