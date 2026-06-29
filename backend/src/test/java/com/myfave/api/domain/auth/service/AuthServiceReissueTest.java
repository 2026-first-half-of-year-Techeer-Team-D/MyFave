package com.myfave.api.domain.auth.service;

import com.myfave.api.domain.auth.dto.request.ReissueRequest;
import com.myfave.api.domain.auth.dto.response.ReissueResponse;
import com.myfave.api.global.error.CustomException;
import com.myfave.api.global.error.ErrorCode;
import com.myfave.api.global.security.JwtTokenProvider;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class AuthServiceReissueTest {

    @Mock private JwtTokenProvider jwtTokenProvider;
    @Mock private RedisTemplate<String, Object> redisTemplate;
    @Mock private ValueOperations<String, Object> valueOperations;
    @InjectMocks private AuthService authService;

    private static final String VALID_REFRESH_TOKEN = "valid.refresh.token";
    private static final String NEW_ACCESS_TOKEN = "new.access.token";
    private static final String NEW_REFRESH_TOKEN = "new.refresh.token";
    private static final Long USER_ID = 1L;

    @Test
    @DisplayName("정상 재발급 - 유효한 refresh token, Redis에 존재 → 새 토큰 반환")
    void reissue_success() {
        // given
        ReissueRequest request = mock(ReissueRequest.class);
        given(request.getRefreshToken()).willReturn(VALID_REFRESH_TOKEN);
        given(jwtTokenProvider.validateToken(VALID_REFRESH_TOKEN)).willReturn(true);
        given(jwtTokenProvider.getUserId(VALID_REFRESH_TOKEN)).willReturn(USER_ID);
        given(redisTemplate.opsForValue()).willReturn(valueOperations);
        given(valueOperations.get("refresh:" + USER_ID)).willReturn(VALID_REFRESH_TOKEN);
        given(jwtTokenProvider.createAccessToken(USER_ID)).willReturn(NEW_ACCESS_TOKEN);
        given(jwtTokenProvider.createRefreshToken(USER_ID)).willReturn(NEW_REFRESH_TOKEN);

        // when
        ReissueResponse response = authService.reissue(request);

        // then
        assertThat(response.getAccessToken()).isEqualTo(NEW_ACCESS_TOKEN);
        assertThat(response.getRefreshToken()).isEqualTo(NEW_REFRESH_TOKEN);
        verify(valueOperations).set(eq("refresh:" + USER_ID), eq(NEW_REFRESH_TOKEN), anyLong(), any());
    }

    @Test
    @DisplayName("만료된 refresh token → AUTH_EXPIRED_REFRESH_TOKEN")
    void reissue_expiredToken() {
        // given
        ReissueRequest request = mock(ReissueRequest.class);
        given(request.getRefreshToken()).willReturn(VALID_REFRESH_TOKEN);
        given(jwtTokenProvider.validateToken(VALID_REFRESH_TOKEN)).willReturn(false);
        given(jwtTokenProvider.isExpiredToken(VALID_REFRESH_TOKEN)).willReturn(true);

        // when & then
        assertThatThrownBy(() -> authService.reissue(request))
                .isInstanceOf(CustomException.class)
                .satisfies(ex -> assertThat(((CustomException) ex).getErrorCode())
                        .isEqualTo(ErrorCode.AUTH_EXPIRED_REFRESH_TOKEN));
    }

    @Test
    @DisplayName("Redis에 토큰 없음 → AUTH_INVALID_REFRESH_TOKEN")
    void reissue_notInRedis() {
        // given
        ReissueRequest request = mock(ReissueRequest.class);
        given(request.getRefreshToken()).willReturn(VALID_REFRESH_TOKEN);
        given(jwtTokenProvider.validateToken(VALID_REFRESH_TOKEN)).willReturn(true);
        given(jwtTokenProvider.getUserId(VALID_REFRESH_TOKEN)).willReturn(USER_ID);
        given(redisTemplate.opsForValue()).willReturn(valueOperations);
        given(valueOperations.get("refresh:" + USER_ID)).willReturn(null);

        // when & then
        assertThatThrownBy(() -> authService.reissue(request))
                .isInstanceOf(CustomException.class)
                .satisfies(ex -> assertThat(((CustomException) ex).getErrorCode())
                        .isEqualTo(ErrorCode.AUTH_INVALID_REFRESH_TOKEN));
    }
}
