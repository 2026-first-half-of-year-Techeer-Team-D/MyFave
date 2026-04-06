package com.myfave.api.domain.auth.controller;

import com.myfave.api.domain.auth.dto.request.LoginRequest;
import com.myfave.api.domain.auth.dto.request.ReissueRequest;
import com.myfave.api.domain.auth.dto.request.SignUpRequest;
import com.myfave.api.domain.auth.dto.response.LoginResponse;
import com.myfave.api.domain.auth.dto.response.ReissueResponse;
import com.myfave.api.domain.auth.dto.response.SignUpResponse;
import com.myfave.api.domain.auth.service.AuthService;
import com.myfave.api.global.common.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<SignUpResponse> signUp(@Valid @RequestBody SignUpRequest request) {
        return ApiResponse.created("회원가입이 완료되었습니다.", authService.signUp(request));
    }

    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return new ApiResponse<>(200, "로그인 성공", authService.login(request));
    }

    @PostMapping("/reissue")
    public ApiResponse<ReissueResponse> reissue(@Valid @RequestBody ReissueRequest request) {
        return new ApiResponse<>(200, "토큰 재발급 성공", authService.reissue(request));
    }

    @PostMapping("/logout")
    public ApiResponse<Void> logout(@RequestHeader("Authorization") String bearerToken) {
        String accessToken = bearerToken.substring(7); // "Bearer " 제거
        authService.logout(accessToken);
        return new ApiResponse<>(200, "로그아웃 되었습니다.", null);
    }
}
