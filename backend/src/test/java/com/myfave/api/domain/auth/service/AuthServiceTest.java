package com.myfave.api.domain.auth.service;

import com.myfave.api.domain.auth.dto.request.LoginRequest;
import com.myfave.api.domain.auth.dto.request.SignUpRequest;
import com.myfave.api.domain.auth.dto.request.TokenReissueRequest;
import com.myfave.api.domain.auth.dto.response.LoginResponse;
import com.myfave.api.domain.auth.dto.response.SignUpResponse;
import com.myfave.api.domain.auth.dto.response.TokenReissueResponse;
import com.myfave.api.domain.user.entity.User;
import com.myfave.api.domain.user.repository.UserRepository;
import com.myfave.api.global.error.CustomException;
import com.myfave.api.global.error.ErrorCode;
import com.myfave.api.global.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;
import java.util.concurrent.TimeUnit;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @InjectMocks
    private AuthService authService;

    @Mock private UserRepository userRepository;
    @Mock private AuthenticationManager authenticationManager;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtTokenProvider jwtTokenProvider;
    @Mock private RedisTemplate<String, Object> redisTemplate;
    @Mock private ValueOperations<String, Object> valueOperations;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(authService, "refreshTokenExpiry", 1209600000L);
    }

    // ===== 회원가입 =====

    @Test
    @DisplayName("회원가입 성공")
    void signUp_success() {
        SignUpRequest request = mockSignUpRequest();

        given(userRepository.existsByEmail(request.getEmail())).willReturn(false);
        given(userRepository.existsByNickname(request.getNickname())).willReturn(false);
        given(userRepository.existsByPhone(request.getPhone())).willReturn(false);
        given(passwordEncoder.encode(request.getPassword())).willReturn("encodedPassword");

        User savedUser = User.builder()
                .email(request.getEmail())
                .password("encodedPassword")
                .name(request.getName())
                .nickname(request.getNickname())
                .phone(request.getPhone())
                .build();
        given(userRepository.save(any(User.class))).willReturn(savedUser);

        SignUpResponse response = authService.signUp(request);

        assertThat(response.getNickname()).isEqualTo("패션왕");
    }

    @Test
    @DisplayName("회원가입 실패 - 이메일 중복")
    void signUp_duplicateEmail() {
        SignUpRequest request = mockSignUpRequest();
        given(userRepository.existsByEmail(request.getEmail())).willReturn(true);

        assertThatThrownBy(() -> authService.signUp(request))
                .isInstanceOf(CustomException.class)
                .hasFieldOrPropertyWithValue("errorCode", ErrorCode.USER_DUPLICATE_EMAIL);
    }

    @Test
    @DisplayName("회원가입 실패 - 닉네임 중복")
    void signUp_duplicateNickname() {
        SignUpRequest request = mockSignUpRequest();
        given(userRepository.existsByEmail(request.getEmail())).willReturn(false);
        given(userRepository.existsByNickname(request.getNickname())).willReturn(true);

        assertThatThrownBy(() -> authService.signUp(request))
                .isInstanceOf(CustomException.class)
                .hasFieldOrPropertyWithValue("errorCode", ErrorCode.USER_DUPLICATE_NICKNAME);
    }

    @Test
    @DisplayName("회원가입 실패 - 전화번호 중복")
    void signUp_duplicatePhone() {
        SignUpRequest request = mockSignUpRequest();
        given(userRepository.existsByEmail(request.getEmail())).willReturn(false);
        given(userRepository.existsByNickname(request.getNickname())).willReturn(false);
        given(userRepository.existsByPhone(request.getPhone())).willReturn(true);

        assertThatThrownBy(() -> authService.signUp(request))
                .isInstanceOf(CustomException.class)
                .hasFieldOrPropertyWithValue("errorCode", ErrorCode.USER_DUPLICATE_PHONE);
    }

    // ===== 로그인 =====

    @Test
    @DisplayName("로그인 성공")
    void login_success() {
        LoginRequest request = mockLoginRequest();
        User user = mockUser();

        given(userRepository.findByEmail(request.getEmail())).willReturn(Optional.of(user));
        given(passwordEncoder.matches(request.getPassword(), user.getPassword())).willReturn(true);
        given(jwtTokenProvider.createAccessToken(user.getUserId())).willReturn("accessToken");
        given(jwtTokenProvider.createRefreshToken(user.getUserId())).willReturn("refreshToken");
        given(redisTemplate.opsForValue()).willReturn(valueOperations);

        LoginResponse response = authService.login(request);

        assertThat(response.getAccessToken()).isEqualTo("accessToken");
        assertThat(response.getRefreshToken()).isEqualTo("refreshToken");
        assertThat(response.getNickname()).isEqualTo("패션왕");

        verify(valueOperations).set(eq("refresh:" + user.getUserId()), eq("refreshToken"), eq(1209600000L), eq(TimeUnit.MILLISECONDS));
    }

    @Test
    @DisplayName("로그인 실패 - 존재하지 않는 이메일")
    void login_userNotFound() {
        LoginRequest request = mockLoginRequest();
        given(userRepository.findByEmail(request.getEmail())).willReturn(Optional.empty());

        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(CustomException.class)
                .hasFieldOrPropertyWithValue("errorCode", ErrorCode.AUTH_INVALID_CREDENTIALS);
    }

    @Test
    @DisplayName("로그인 실패 - 비밀번호 불일치")
    void login_wrongPassword() {
        LoginRequest request = mockLoginRequest();
        User user = mockUser();

        given(userRepository.findByEmail(request.getEmail())).willReturn(Optional.of(user));
        given(passwordEncoder.matches(request.getPassword(), user.getPassword())).willReturn(false);

        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(CustomException.class)
                .hasFieldOrPropertyWithValue("errorCode", ErrorCode.AUTH_INVALID_CREDENTIALS);
    }

    // ===== 토큰 재발급 =====

    @Test
    @DisplayName("토큰 재발급 성공")
    void reissue_success() {
        TokenReissueRequest request = mockReissueRequest("validRefreshToken");
        Long userId = 1L;

        given(jwtTokenProvider.getUserId("validRefreshToken")).willReturn(userId);
        given(redisTemplate.opsForValue()).willReturn(valueOperations);
        given(valueOperations.get("refresh:" + userId)).willReturn("validRefreshToken");
        given(jwtTokenProvider.createAccessToken(userId)).willReturn("newAccessToken");
        given(jwtTokenProvider.createRefreshToken(userId)).willReturn("newRefreshToken");

        TokenReissueResponse response = authService.reissue(request);

        assertThat(response.getAccessToken()).isEqualTo("newAccessToken");
        assertThat(response.getRefreshToken()).isEqualTo("newRefreshToken");

        verify(valueOperations).set(eq("refresh:" + userId), eq("newRefreshToken"), eq(1209600000L), eq(TimeUnit.MILLISECONDS));
    }

    @Test
    @DisplayName("토큰 재발급 실패 - Redis 만료 (TTL 지남)")
    void reissue_expiredToken() {
        TokenReissueRequest request = mockReissueRequest("expiredRefreshToken");
        Long userId = 1L;

        given(jwtTokenProvider.getUserId("expiredRefreshToken")).willReturn(userId);
        given(redisTemplate.opsForValue()).willReturn(valueOperations);
        given(valueOperations.get("refresh:" + userId)).willReturn(null);

        assertThatThrownBy(() -> authService.reissue(request))
                .isInstanceOf(CustomException.class)
                .hasFieldOrPropertyWithValue("errorCode", ErrorCode.AUTH_EXPIRED_REFRESH_TOKEN);
    }

    @Test
    @DisplayName("토큰 재발급 실패 - Redis 저장값과 불일치")
    void reissue_tokenMismatch() {
        TokenReissueRequest request = mockReissueRequest("someRefreshToken");
        Long userId = 1L;

        given(jwtTokenProvider.getUserId("someRefreshToken")).willReturn(userId);
        given(redisTemplate.opsForValue()).willReturn(valueOperations);
        given(valueOperations.get("refresh:" + userId)).willReturn("differentRefreshToken");

        assertThatThrownBy(() -> authService.reissue(request))
                .isInstanceOf(CustomException.class)
                .hasFieldOrPropertyWithValue("errorCode", ErrorCode.AUTH_INVALID_REFRESH_TOKEN);
    }

    @Test
    @DisplayName("토큰 재발급 실패 - 잘못된 토큰 형식")
    void reissue_malformedToken() {
        TokenReissueRequest request = mockReissueRequest("malformedToken");

        given(jwtTokenProvider.getUserId("malformedToken")).willThrow(new RuntimeException("malformed"));

        assertThatThrownBy(() -> authService.reissue(request))
                .isInstanceOf(CustomException.class)
                .hasFieldOrPropertyWithValue("errorCode", ErrorCode.AUTH_INVALID_REFRESH_TOKEN);
    }

    // ===== 헬퍼 메서드 =====

    private SignUpRequest mockSignUpRequest() {
        SignUpRequest request = new SignUpRequest();
        ReflectionTestUtils.setField(request, "email", "hong@email.com");
        ReflectionTestUtils.setField(request, "password", "MyFave1234!");
        ReflectionTestUtils.setField(request, "name", "홍길동");
        ReflectionTestUtils.setField(request, "nickname", "패션왕");
        ReflectionTestUtils.setField(request, "phone", "010-1234-5678");
        return request;
    }

    private LoginRequest mockLoginRequest() {
        LoginRequest request = new LoginRequest();
        ReflectionTestUtils.setField(request, "email", "hong@email.com");
        ReflectionTestUtils.setField(request, "password", "MyFave1234!");
        return request;
    }

    private TokenReissueRequest mockReissueRequest(String token) {
        TokenReissueRequest request = new TokenReissueRequest();
        ReflectionTestUtils.setField(request, "refreshToken", token);
        return request;
    }

    private User mockUser() {
        User user = User.builder()
                .email("hong@email.com")
                .password("encodedPassword")
                .name("홍길동")
                .nickname("패션왕")
                .phone("010-1234-5678")
                .build();
        ReflectionTestUtils.setField(user, "userId", 1L);
        return user;
    }
}
