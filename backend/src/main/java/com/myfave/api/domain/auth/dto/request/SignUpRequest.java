package com.myfave.api.domain.auth.dto.request;

import lombok.Getter;

@Getter
public class SignUpRequest {

    private String email;
    private String password;
    private String name;
    private String nickname;
    private String phone;
}
