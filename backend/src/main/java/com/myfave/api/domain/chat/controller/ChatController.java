package com.myfave.api.domain.chat.controller;

import com.myfave.api.domain.chat.dto.response.ChatHistoryResponse;
import com.myfave.api.domain.chat.dto.response.ChatRoomInfoResponse;
import com.myfave.api.domain.chat.service.ChatService;
import com.myfave.api.global.common.ApiResponse;
import com.myfave.api.global.error.CustomException;
import com.myfave.api.global.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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

    @GetMapping("/messages")
    public ResponseEntity<ApiResponse<ChatHistoryResponse>> getMessages(
            Authentication authentication,
            @RequestParam(defaultValue = "50") int size,
            @RequestParam(required = false) String before) {

        if (authentication == null || authentication instanceof org.springframework.security.authentication.AnonymousAuthenticationToken) {
            throw new CustomException(ErrorCode.AUTH_UNAUTHORIZED);
        }

        return ResponseEntity.ok(ApiResponse.ok(chatService.getMessageHistory(size, before)));
    }
}
