package com.myfave.api.domain.auth.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.myfave.api.domain.auth.dto.response.LoginResponse;
import com.myfave.api.domain.auth.dto.response.SignUpResponse;
import com.myfave.api.domain.auth.dto.response.TokenReissueResponse;
import com.myfave.api.domain.auth.service.AuthService;
import com.myfave.api.domain.user.entity.User;
import com.myfave.api.global.error.CustomException;
import com.myfave.api.global.error.ErrorCode;
import com.myfave.api.global.security.JwtTokenProvider;
import org.springframework.data.jpa.mapping.JpaMetamodelMappingContext;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = AuthController.class, excludeAutoConfiguration = SecurityAutoConfiguration.class)
class AuthControllerTest {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;
    @MockBean AuthService authService;
    @MockBean JpaMetamodelMappingContext jpaMetamodelMappingContext;
    @MockBean JwtTokenProvider jwtTokenProvider;

    // ===== 회원가입 =====

    @Test
    @DisplayName("회원가입 성공 - 201 반환")
    void signUp_success() throws Exception {
        Map<String, String> body = Map.of(
                "email", "hong@email.com",
                "password", "MyFave1234!",
                "name", "홍길동",
                "nickname", "패션왕",
                "phone", "010-1234-5678"
        );

        User user = User.builder()
                .email("hong@email.com").password("encoded").name("홍길동")
                .nickname("패션왕").phone("010-1234-5678").build();
        ReflectionTestUtils.setField(user, "userId", 1L);

        given(authService.signUp(any())).willReturn(SignUpResponse.from(user));

        mockMvc.perform(post("/api/v1/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.code").value(201))
                .andExpect(jsonPath("$.message").value("회원가입이 완료되었습니다."))
                .andExpect(jsonPath("$.data.userId").value(1))
                .andExpect(jsonPath("$.data.nickname").value("패션왕"));
    }

    @Test
    @DisplayName("회원가입 실패 - 이메일 형식 오류 (400)")
    void signUp_invalidEmail() throws Exception {
        Map<String, String> body = Map.of(
                "email", "not-an-email",
                "password", "MyFave1234!",
                "name", "홍길동",
                "nickname", "패션왕",
                "phone", "010-1234-5678"
        );

        mockMvc.perform(post("/api/v1/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value(400));
    }

    @Test
    @DisplayName("회원가입 실패 - 이메일 중복 (409)")
    void signUp_duplicateEmail() throws Exception {
        Map<String, String> body = Map.of(
                "email", "hong@email.com",
                "password", "MyFave1234!",
                "name", "홍길동",
                "nickname", "패션왕",
                "phone", "010-1234-5678"
        );

        given(authService.signUp(any())).willThrow(new CustomException(ErrorCode.USER_DUPLICATE_EMAIL));

        mockMvc.perform(post("/api/v1/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.code").value(409));
    }

    // ===== 로그인 =====

    @Test
    @DisplayName("로그인 성공 - 200 반환 및 토큰 포함")
    void login_success() throws Exception {
        Map<String, String> body = Map.of(
                "email", "hong@email.com",
                "password", "MyFave1234!"
        );

        User user = User.builder()
                .email("hong@email.com").password("encoded").name("홍길동")
                .nickname("패션왕").phone("010-1234-5678").build();
        ReflectionTestUtils.setField(user, "userId", 1L);

        given(authService.login(any()))
                .willReturn(LoginResponse.of("accessToken", "refreshToken", user));

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.message").value("로그인 성공"))
                .andExpect(jsonPath("$.data.accessToken").value("accessToken"))
                .andExpect(jsonPath("$.data.refreshToken").value("refreshToken"))
                .andExpect(jsonPath("$.data.userId").value(1))
                .andExpect(jsonPath("$.data.nickname").value("패션왕"));
    }

    @Test
    @DisplayName("로그인 실패 - 이메일/비밀번호 불일치 (401)")
    void login_invalidCredentials() throws Exception {
        Map<String, String> body = Map.of(
                "email", "hong@email.com",
                "password", "WrongPass1!"
        );

        given(authService.login(any())).willThrow(new CustomException(ErrorCode.AUTH_INVALID_CREDENTIALS));

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value(401));
    }

    @Test
    @DisplayName("로그인 실패 - 이메일 필드 누락 (400)")
    void login_missingEmail() throws Exception {
        Map<String, String> body = Map.of("password", "MyFave1234!");

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isBadRequest());
    }

    // ===== 토큰 재발급 =====

    @Test
    @DisplayName("토큰 재발급 성공 - 200 반환 및 새 토큰 포함")
    void reissue_success() throws Exception {
        Map<String, String> body = Map.of("refreshToken", "validRefreshToken");

        given(authService.reissue(any()))
                .willReturn(TokenReissueResponse.of("newAccessToken", "newRefreshToken"));

        mockMvc.perform(post("/api/v1/auth/reissue")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.message").value("토큰 재발급 성공"))
                .andExpect(jsonPath("$.data.accessToken").value("newAccessToken"))
                .andExpect(jsonPath("$.data.refreshToken").value("newRefreshToken"));
    }

    @Test
    @DisplayName("토큰 재발급 실패 - 만료된 Refresh Token (401)")
    void reissue_expiredToken() throws Exception {
        Map<String, String> body = Map.of("refreshToken", "expiredToken");

        given(authService.reissue(any())).willThrow(new CustomException(ErrorCode.AUTH_EXPIRED_REFRESH_TOKEN));

        mockMvc.perform(post("/api/v1/auth/reissue")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value(401));
    }

    @Test
    @DisplayName("토큰 재발급 실패 - 유효하지 않은 Refresh Token (401)")
    void reissue_invalidToken() throws Exception {
        Map<String, String> body = Map.of("refreshToken", "invalidToken");

        given(authService.reissue(any())).willThrow(new CustomException(ErrorCode.AUTH_INVALID_REFRESH_TOKEN));

        mockMvc.perform(post("/api/v1/auth/reissue")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value(401));
    }
}
