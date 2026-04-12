package com.myfave.api.domain.chat.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ChatMessageRequest {

    private String type;      // "SEND_MESSAGE"
    private Payload payload;

    @Getter
    @NoArgsConstructor
    public static class Payload {
        private String content;
    }
}
