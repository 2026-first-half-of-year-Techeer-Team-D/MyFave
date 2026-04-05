package com.myfave.api.domain.auth.dto.response;

import lombok.Getter;

@Getter
public class TokenReissueResponse {

    private final String accessToken;
    private final String refreshToken;

    private TokenReissueResponse(String accessToken, String refreshToken) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }

    public static TokenReissueResponse of(String accessToken, String refreshToken) {
        return new TokenReissueResponse(accessToken, refreshToken);
    }
}
