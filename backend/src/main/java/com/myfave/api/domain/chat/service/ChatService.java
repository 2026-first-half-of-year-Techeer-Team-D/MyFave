package com.myfave.api.domain.chat.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.myfave.api.domain.chat.dto.response.ChatHistoryResponse;
import com.myfave.api.domain.chat.dto.response.ChatRoomInfoResponse;
import com.myfave.api.domain.chat.entity.ChatRoom;
import com.myfave.api.domain.chat.repository.ChatRoomRepository;
import com.myfave.api.global.config.SessionRegistry;
import com.myfave.api.global.error.CustomException;
import com.myfave.api.global.error.ErrorCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ChatService {

    private final ChatRoomRepository chatRoomRepository;
    private final SessionRegistry sessionRegistry;
    private final ChatMessageService chatMessageService;
    private final ObjectMapper objectMapper;

    @Value("${influencer.user-id}")
    private Long influencerUserId;

    public ChatRoomInfoResponse getChatRoomInfo() {
        ChatRoom chatRoom = chatRoomRepository.findByIsActiveTrue()
                .orElseThrow(() -> new CustomException(ErrorCode.CHAT_ROOM_NOT_FOUND));
        int participantCount = sessionRegistry.getParticipantCount(chatRoom.getChatRoomId());
        return ChatRoomInfoResponse.from(chatRoom, participantCount);
    }

    public ChatHistoryResponse getMessageHistory(int size, String before) {
        ChatRoom chatRoom = chatRoomRepository.findByIsActiveTrue()
                .orElseThrow(() -> new CustomException(ErrorCode.CHAT_ROOM_NOT_FOUND));

        ZonedDateTime cursor;
        try {
            cursor = before != null
                    ? ZonedDateTime.parse(before)
                    : ZonedDateTime.now().plusSeconds(1);
        } catch (java.time.format.DateTimeParseException e) {
            throw new CustomException(ErrorCode.COMMON_INVALID_INPUT);
        }

        List<StoredMessage> parsed = parseMessages(chatRoom.getChatRoomId(), cursor);

        int total = parsed.size();
        int fromIndex = Math.max(0, total - size);
        List<StoredMessage> page = parsed.subList(fromIndex, total);
        boolean hasMore = fromIndex > 0;

        List<ChatHistoryResponse.MessageItem> items = new ArrayList<>();
        for (StoredMessage msg : page) {
            StoredPayload p = msg.getPayload();
            items.add(ChatHistoryResponse.MessageItem.builder()
                    .messageId(p.getMessageId())
                    .senderId(p.getUserId())
                    .senderNickname(p.getNickname())
                    .isInfluencer(p.getUserId().equals(influencerUserId))
                    .content(p.getContent())
                    .createdAt(p.getSentAt())
                    .build());
        }

        return new ChatHistoryResponse(items, hasMore);
    }

    List<StoredMessage> parseMessages(Long roomId, ZonedDateTime cursor) {
        List<String> rawMessages = chatMessageService.getHistory(roomId);
        List<StoredMessage> result = new ArrayList<>();

        for (String json : rawMessages) {
            try {
                StoredMessage msg = objectMapper.readValue(json, StoredMessage.class);
                if (msg.getPayload() == null) continue;
                if (!"NEW_MESSAGE".equals(msg.getType())) continue;
                if (!msg.getPayload().getSentAt().isBefore(cursor)) continue;
                result.add(msg);
            } catch (JsonProcessingException e) {
                log.warn("메시지 파싱 실패: {}", json);
            }
        }
        return result;
    }

    @Getter
    @NoArgsConstructor
    static class StoredMessage {
        private String type;
        private StoredPayload payload;
    }

    @Getter
    @NoArgsConstructor
    static class StoredPayload {
        private String messageId;
        private Long userId;
        private String nickname;
        private String content;
        private ZonedDateTime sentAt;
    }
}
