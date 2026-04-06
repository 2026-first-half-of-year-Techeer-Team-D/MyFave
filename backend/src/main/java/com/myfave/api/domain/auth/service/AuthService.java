package com.myfave.api.domain.auth.service;

import com.myfave.api.domain.auth.dto.request.LoginRequest;
import com.myfave.api.domain.auth.dto.request.ReissueRequest;
import com.myfave.api.domain.auth.dto.request.SignUpRequest;
import com.myfave.api.domain.auth.dto.response.LoginResponse;
import com.myfave.api.domain.auth.dto.response.ReissueResponse;
import com.myfave.api.domain.auth.dto.response.SignUpResponse;
import com.myfave.api.domain.user.entity.User;
import com.myfave.api.domain.user.repository.UserRepository;
import com.myfave.api.global.error.CustomException;
import com.myfave.api.global.error.ErrorCode;
import com.myfave.api.global.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthService {

    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final RedisTemplate<String, Object> redisTemplate;

    @Value("${jwt.refresh-token-expiry}")
    private long refreshTokenExpiry;

    @Transactional
    public SignUpResponse signUp(SignUpRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new CustomException(ErrorCode.USER_DUPLICATE_EMAIL);
        }
        if (userRepository.existsByNickname(request.getNickname())) {
            throw new CustomException(ErrorCode.USER_DUPLICATE_NICKNAME);
        }
        if (userRepository.existsByPhone(request.getPhone())) {
            throw new CustomException(ErrorCode.USER_DUPLICATE_PHONE);
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .nickname(request.getNickname())
                .phone(request.getPhone())
                .build();

        return SignUpResponse.from(userRepository.save(user));
    }

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new CustomException(ErrorCode.AUTH_INVALID_CREDENTIALS));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new CustomException(ErrorCode.AUTH_INVALID_CREDENTIALS);
        }
        // 토큰 발급
        String accessToken = jwtTokenProvider.createAccessToken(user.getUserId());
        String refreshToken = jwtTokenProvider.createRefreshToken(user.getUserId());

        redisTemplate.opsForValue().set( // radis를 key-value 형태로 사용하겠다.
                "refresh:" + user.getUserId(), // key
                refreshToken, // value
                refreshTokenExpiry, // 유효기간
                TimeUnit.MILLISECONDS// 단위
        );

        return LoginResponse.of(accessToken, refreshToken, user);
    }

    public ReissueResponse reissue(ReissueRequest request) {
        String token = request.getRefreshToken(); //Refresh 토큰을 꺼냄

        // 토큰 유효성 검증
        if (!jwtTokenProvider.validateToken(token)) {
            if (jwtTokenProvider.isExpiredToken(token)) {
                throw new CustomException(ErrorCode.AUTH_EXPIRED_REFRESH_TOKEN);
            }
            throw new CustomException(ErrorCode.AUTH_INVALID_REFRESH_TOKEN);
        }

        // redis에 저장된 토큰과 비교
        Long userId = jwtTokenProvider.getUserId(token);
        String storedToken = (String) redisTemplate.opsForValue().get("refresh:" + userId);

        if (storedToken == null || !storedToken.equals(token)) {
            throw new CustomException(ErrorCode.AUTH_INVALID_REFRESH_TOKEN);
        }

        // 새로운 토큰 발급
        String newAccessToken = jwtTokenProvider.createAccessToken(userId);
        String newRefreshToken = jwtTokenProvider.createRefreshToken(userId);

        redisTemplate.opsForValue().set(
                "refresh:" + userId,
                newRefreshToken,
                refreshTokenExpiry,
                TimeUnit.MILLISECONDS
        );

        return ReissueResponse.of(newAccessToken, newRefreshToken);
    }

    public void logout(String accessToken) {
        // Access Token 유효성 검증 (위변조, 형식 오류 차단)
        if (!jwtTokenProvider.validateToken(accessToken) && !jwtTokenProvider.isExpiredToken(accessToken)) {
            throw new CustomException(ErrorCode.AUTH_UNAUTHORIZED);
        }

        // Access Token 블랙리스트 등록
        long remaining = jwtTokenProvider.getRemainingExpiry(accessToken);
        if (remaining > 0) { // accessToken이 기간이 남아있으면 남아있는 기간만큼 블랙리스트
            redisTemplate.opsForValue().set(
                    "blacklist:" + accessToken,
                    "logout",
                    remaining,
                    TimeUnit.MILLISECONDS
            );
        }

        // Refresh Token Redis에서 삭제
        Long userId = jwtTokenProvider.getUserId(accessToken);
        redisTemplate.delete("refresh:" + userId);
    }
}
