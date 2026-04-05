package com.myfave.api.domain.auth.service;

import com.myfave.api.domain.auth.dto.request.LoginRequest;
import com.myfave.api.domain.auth.dto.request.SignUpRequest;
import com.myfave.api.domain.auth.dto.response.LoginResponse;
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
}
