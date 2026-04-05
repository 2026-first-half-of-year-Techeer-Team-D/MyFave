package com.myfave.api.domain.auth.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
// 회원가입에 필요한 정보 정의
// 여기서 오류가 발생할 경우 ex) 이메일이 너무 짧음 Spring의 @Valid 어노테이션이 에러 발생
@Getter
public class SignUpRequest {

    @NotBlank
    @Email
    private String email;

    @NotBlank
    @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[\\W_]).{8,20}$") //@pattern(regexp = "") <- 정규 표현식과 맞는지 검증하겠다.
    private String password;

    @NotBlank
    @Size(min = 2, max = 20)
    private String name;

    @NotBlank
    @Size(min = 2, max = 12)
    private String nickname;

    @NotBlank
    @Pattern(regexp = "^010-\\d{4}-\\d{4}$")
    private String phone;
}
