package com.myfave.api.domain.auth.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;

@Getter
public class FindEmailRequest {

    @NotBlank
    private String name;

    @NotBlank
    @Pattern(regexp = "^010-\\d{4}-\\d{4}$", message = "전화번호 형식이 올바르지 않습니다. (010-XXXX-XXXX)")
    private String phone;
}
