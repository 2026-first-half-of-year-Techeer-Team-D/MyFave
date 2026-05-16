package com.myfave.api.domain.auth.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.myfave.api.domain.user.entity.User;
import lombok.Getter;

@Getter
public class SocialLoginResponse {

    private final String accessToken;
    private final String refreshToken;
    private final Long userId;
    private final String nickname;
    private final String email;
    @JsonProperty("isNewUser")// bool type의 is는 JAVA에서 제거하는 규칙이 있다.
    private final boolean isNewUser;

    private SocialLoginResponse(String accessToken, String refreshToken, Long userId,
                                String nickname, String email, boolean isNewUser) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.userId = userId;
        this.nickname = nickname;
        this.email = email;
        this.isNewUser = isNewUser;
    }

    public static SocialLoginResponse of(String accessToken, String refreshToken,
                                         User user, boolean isNewUser) {
        return new SocialLoginResponse(accessToken, refreshToken,
                user.getUserId(), user.getNickname(), user.getEmail(), isNewUser);
    }
}
