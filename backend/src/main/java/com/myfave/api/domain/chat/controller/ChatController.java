package com.myfave.api.domain.chat.controller;

import com.myfave.api.domain.chat.dto.response.ChatRoomInfoResponse;
import com.myfave.api.domain.chat.service.ChatService;
import com.myfave.api.global.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/chat-room")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @GetMapping
    public ResponseEntity<ApiResponse<ChatRoomInfoResponse>> getChatRoom() {
        return ResponseEntity.ok(ApiResponse.ok(chatService.getChatRoomInfo()));
    }
}
