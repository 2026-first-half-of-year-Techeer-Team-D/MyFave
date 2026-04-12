package com.myfave.api.domain.chat.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class RedisSubscriber implements MessageListener {

    private final SimpMessagingTemplate messagingTemplate;

    @Override
    public void onMessage(Message message, byte[] pattern) {
        String channel = new String(message.getChannel()); // "chat:room:{roomId}"
        String body = new String(message.getBody());

        String[] parts = channel.split(":");
        if (parts.length < 3) return;

        try {
            Long roomId = Long.parseLong(parts[2]);
            messagingTemplate.convertAndSend("/topic/chat/" + roomId, body);
            log.debug("브로드캐스트: roomId={}", roomId);
        } catch (NumberFormatException e) {
            log.warn("채널 파싱 실패: {}", channel);
        }
    }
}
