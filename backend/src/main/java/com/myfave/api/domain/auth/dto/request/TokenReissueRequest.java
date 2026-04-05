package com.myfave.api.domain.auth.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class TokenReissueRequest {

    @NotBlank
    private String refreshToken;
}
