package com.myfave.api.domain.chat.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ChatMessageResponse {

    private String type;
    private Object payload;

    // NEW_MESSAGE 팩토리
    public static ChatMessageResponse newMessage(String messageId, Long userId, String nickname,
                                                  String content) {
        Payload p = new Payload(messageId, userId, nickname, content,
                LocalTime.now().format(DateTimeFormatter.ofPattern("HH:mm")));
        return ChatMessageResponse.builder().type("NEW_MESSAGE").payload(p).build();
    }

    // 참가자 수 팩토리
    public static ChatMessageResponse participantCount(int count) {
        return ChatMessageResponse.builder()
                .type("PARTICIPANT_COUNT")
                .payload(java.util.Map.of("count", count))
                .build();
    }

    // RATE_LIMIT 팩토리
    public static ChatMessageResponse rateLimitError() {
        return ChatMessageResponse.builder().type("RATE_LIMIT").build();
    }

    // ROOM_CLOSED 팩토리
    public static ChatMessageResponse roomClosed() {
        return ChatMessageResponse.builder().type("ROOM_CLOSED").build();
    }

    @Getter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Payload {
        private String messageId;
        private Long userId;
        private String nickname;
        private String content;
        private String sentAt;
    }
}
