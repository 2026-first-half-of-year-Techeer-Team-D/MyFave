package com.myfave.api.domain.auth.service;

import com.myfave.api.domain.auth.client.KakaoAuthClient;
import com.myfave.api.domain.auth.client.dto.KakaoTokenResponse;
import com.myfave.api.domain.auth.client.dto.KakaoUserInfoResponse;
import com.myfave.api.domain.auth.dto.request.FindEmailRequest;
import com.myfave.api.domain.auth.dto.request.LoginRequest;
import com.myfave.api.domain.auth.dto.request.PasswordResetSendCodeRequest;
import com.myfave.api.domain.auth.dto.request.ReissueRequest;
import com.myfave.api.domain.auth.dto.request.SignUpRequest;
import com.myfave.api.domain.auth.dto.request.ResetPasswordRequest;
import com.myfave.api.domain.auth.dto.request.SocialLoginRequest;
import com.myfave.api.domain.auth.dto.request.VerifyCodeRequest;
import com.myfave.api.domain.auth.dto.response.FindEmailResponse;
import com.myfave.api.domain.auth.dto.response.LoginResponse;
import com.myfave.api.domain.auth.dto.response.ReissueResponse;
import com.myfave.api.domain.auth.dto.response.SignUpResponse;
import com.myfave.api.domain.auth.dto.response.SocialLoginResponse;
import com.myfave.api.domain.auth.dto.response.VerifyCodeResponse;
import com.myfave.api.domain.user.entity.SocialProvider;
import com.myfave.api.domain.user.entity.User;
import com.myfave.api.domain.user.repository.UserRepository;
import com.myfave.api.global.error.CustomException;
import com.myfave.api.global.error.ErrorCode;
import com.myfave.api.global.mail.MailService;
import com.myfave.api.global.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.Optional;
import java.util.UUID;
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
    private final MailService mailService;
    private final KakaoAuthClient kakaoAuthClient;

    @Value("${jwt.refresh-token-expiry}")
    private long refreshTokenExpiry;

    private static final int MAX_SEND_COUNT = 5;
    private static final long SEND_LIMIT_TTL_MINUTES = 5L;
    private static final long CODE_TTL_MINUTES = 5L;
    private static final long RESET_TOKEN_TTL_MINUTES = 10L;
    private static final SecureRandom RANDOM = new SecureRandom();

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

    public FindEmailResponse findEmail(FindEmailRequest request) {
        User user = userRepository.findByNameAndPhone(request.getName(), request.getPhone())
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        return FindEmailResponse.from(user.getEmail());
    }

    public void sendPasswordResetCode(PasswordResetSendCodeRequest request) {
        if (userRepository.findByEmailAndPhone(request.getEmail(), request.getPhone()).isEmpty()) {
            return;
        }


        String countKey = "pwd-reset-count:" + request.getEmail();
        Long sendCount = redisTemplate.opsForValue().increment(countKey);
        if (sendCount == 1) { // 처음으로 이메일 보내달라고 요청했을때 처음에는 redis에 등록
            redisTemplate.expire(countKey, SEND_LIMIT_TTL_MINUTES, TimeUnit.MINUTES);
        }
        if (sendCount > MAX_SEND_COUNT) { // 너무 많이 보내면 에러
            throw new CustomException(ErrorCode.AUTH_TOO_MANY_REQUESTS);
        }

        String code = String.format("%06d", RANDOM.nextInt(1_000_000)); // 인증코드 생성
        redisTemplate.opsForValue().set(// 인증코드 레디스에 저장
                "pwd-reset-code:" + request.getEmail(),
                code,
                CODE_TTL_MINUTES,
                TimeUnit.MINUTES
        );

        mailService.sendPasswordResetCode(request.getEmail(), code);
    }

    public VerifyCodeResponse verifyCode(VerifyCodeRequest request) {
        String codeKey = "pwd-reset-code:" + request.getEmail();
        String storedCode = (String) redisTemplate.opsForValue().get(codeKey);

        if (storedCode == null) {
            throw new CustomException(ErrorCode.AUTH_EXPIRED_VERIFICATION_CODE);
        }
        if (!storedCode.equals(request.getVerificationCode())) {
            throw new CustomException(ErrorCode.AUTH_INVALID_VERIFICATION_CODE);
        }

        redisTemplate.delete(codeKey);

        String resetToken = UUID.randomUUID().toString();
        redisTemplate.opsForValue().set(
                "pwd-reset-token:" + resetToken,
                request.getEmail(),
                RESET_TOKEN_TTL_MINUTES,
                TimeUnit.MINUTES
        );

        return VerifyCodeResponse.of(resetToken);
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        if (!request.getNewPassword().equals(request.getNewPasswordConfirm())) {
            throw new CustomException(ErrorCode.AUTH_PASSWORD_MISMATCH);
        }

        String tokenKey = "pwd-reset-token:" + request.getPasswordResetToken();
        String email = (String) redisTemplate.opsForValue().get(tokenKey);

        if (email == null) {
            throw new CustomException(ErrorCode.AUTH_INVALID_RESET_TOKEN);
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException(ErrorCode.AUTH_INVALID_RESET_TOKEN));//Redis에는 토큰이 있는데 해당 이메일의 유저가 DB에서 탈퇴한 경우
        // 패스워드 재설정
        user.updatePassword(passwordEncoder.encode(request.getNewPassword()));
        //비밀번호 저장할때 사용한  redis 키 지우기
        redisTemplate.delete(tokenKey);
    }

    @Transactional
    public SocialLoginResponse socialLogin(String provider, SocialLoginRequest request) {
        if (!"kakao".equals(provider)) {
            throw new CustomException(ErrorCode.COMMON_INVALID_INPUT);
        }

        KakaoTokenResponse kakaoToken = kakaoAuthClient.exchangeCodeForToken(request.getAuthorizationCode());
        KakaoUserInfoResponse kakaoUserInfo = kakaoAuthClient.getUserInfo(kakaoToken.getAccessToken());

        String socialProviderId = String.valueOf(kakaoUserInfo.getId());
        String email = kakaoUserInfo.getKakaoAccount().getEmail();

        Optional<User> existingBySocialId = userRepository.findBySocialProviderId(socialProviderId);
        boolean isNewUser;
        User user;

        if (existingBySocialId.isPresent()) {
            user = existingBySocialId.get();
            isNewUser = false;
        } else {
            Optional<User> existingByEmail = userRepository.findByEmail(email);
            if (existingByEmail.isPresent()) {
                user = existingByEmail.get();
                user.linkSocial(SocialProvider.KAKAO, socialProviderId);
                isNewUser = false;
            } else {
                user = userRepository.save(buildSocialUser(SocialProvider.KAKAO, socialProviderId, email, kakaoUserInfo));
                isNewUser = true;
            }
        }

        String accessToken = jwtTokenProvider.createAccessToken(user.getUserId());
        String refreshToken = jwtTokenProvider.createRefreshToken(user.getUserId());

        redisTemplate.opsForValue().set(
                "refresh:" + user.getUserId(),
                refreshToken,
                refreshTokenExpiry,
                TimeUnit.MILLISECONDS
        );

        return SocialLoginResponse.of(accessToken, refreshToken, user, isNewUser);
    }

    private User buildSocialUser(SocialProvider provider, String socialProviderId,
                                  String email, KakaoUserInfoResponse info) {
        String rawNickname = info.getKakaoAccount().getProfile().getNickname();
        String nickname = generateUniqueNickname(rawNickname);
        String name = rawNickname.length() > 20 ? rawNickname.substring(0, 20) : rawNickname;

        return User.builder()
                .email(email)
                .password(passwordEncoder.encode(UUID.randomUUID().toString()))
                .name(name)
                .nickname(nickname)
                .phone("SOCIAL_" + socialProviderId)
                .socialProvider(provider)
                .socialProviderId(socialProviderId)
                .build();
    }

    private String generateUniqueNickname(String base) {
        String truncated = base.length() > 10 ? base.substring(0, 10) : base;
        String candidate = truncated;
        int attempt = 0;
        while (userRepository.existsByNickname(candidate)) {
            String suffix = String.format("%02d", RANDOM.nextInt(100));
            candidate = truncated + suffix;
            if (++attempt > 10) {
                candidate = truncated + UUID.randomUUID().toString().substring(0, 2);
            }
        }
        return candidate;
    }
}
