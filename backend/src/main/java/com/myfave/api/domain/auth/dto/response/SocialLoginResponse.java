package com.myfave.api.domain.auth.dto.response;

import com.myfave.api.domain.user.entity.User;
import lombok.Getter;

@Getter
public class SocialLoginResponse {

    private final String accessToken;
    private final String refreshToken;
    private final Long userId;
    private final String nickname;
    private final boolean isNewUser;

    private SocialLoginResponse(String accessToken, String refreshToken, Long userId,
                                String nickname, boolean isNewUser) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.userId = userId;
        this.nickname = nickname;
        this.isNewUser = isNewUser;
    }

    public static SocialLoginResponse of(String accessToken, String refreshToken,
                                         User user, boolean isNewUser) {
        return new SocialLoginResponse(accessToken, refreshToken,
                user.getUserId(), user.getNickname(), isNewUser);
    }
}
