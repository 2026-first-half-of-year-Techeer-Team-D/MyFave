package com.myfave.api.domain.chat.service;

import com.myfave.api.domain.chat.dto.response.ChatRoomInfoResponse;
import com.myfave.api.domain.chat.entity.ChatRoom;
import com.myfave.api.domain.chat.repository.ChatRoomRepository;
import com.myfave.api.global.config.SessionRegistry;
import com.myfave.api.global.error.CustomException;
import com.myfave.api.global.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ChatService {

    private final ChatRoomRepository chatRoomRepository;
    private final SessionRegistry sessionRegistry;

    public ChatRoomInfoResponse getChatRoomInfo() {
        ChatRoom chatRoom = chatRoomRepository.findByIsActiveTrue()
                .orElseThrow(() -> new CustomException(ErrorCode.CHAT_ROOM_NOT_FOUND));
        int participantCount = sessionRegistry.getParticipantCount(chatRoom.getChatRoomId());
        return ChatRoomInfoResponse.from(chatRoom, participantCount);
    }
}
