package com.myfave.api.domain.user.dto.response;

import com.myfave.api.domain.user.entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserResponse {

    private Long userId;
    private String email;
    private String name;
    private String nickname;
    private String phone;

    public static UserResponse from(User user) {
        return new UserResponse(
                user.getUserId(),
                user.getEmail(),
                user.getName(),
                user.getNickname(),
                user.getPhone()
        );
    }
}
