package com.myfave.api.domain.auth.client;

import com.myfave.api.domain.auth.client.dto.KakaoTokenResponse;
import com.myfave.api.domain.auth.client.dto.KakaoUserInfoResponse;
import com.myfave.api.global.error.CustomException;
import com.myfave.api.global.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientRequestException;
import reactor.core.publisher.Mono;

@Component
@RequiredArgsConstructor
public class KakaoAuthClient {

    private final WebClient.Builder webClientBuilder;

    @Value("${spring.security.oauth2.client.registration.kakao.client-id}")
    private String clientId;

    @Value("${spring.security.oauth2.client.registration.kakao.client-secret}")
    private String clientSecret;

    @Value("${kakao.redirect-uri}")
    private String redirectUri;

    public KakaoTokenResponse exchangeCodeForToken(String authorizationCode) {
        MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
        formData.add("grant_type", "authorization_code");
        formData.add("client_id", clientId);
        formData.add("client_secret", clientSecret);
        formData.add("redirect_uri", redirectUri);
        formData.add("code", authorizationCode);

        return webClientBuilder.build()
                .post()
                .uri("https://kauth.kakao.com/oauth/token")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(BodyInserters.fromFormData(formData))
                .retrieve()
                .onStatus(status -> status.is4xxClientError(),
                        resp -> Mono.error(new CustomException(ErrorCode.AUTH_INVALID_SOCIAL_CODE)))
                .onStatus(status -> status.is5xxServerError(),
                        resp -> Mono.error(new CustomException(ErrorCode.AUTH_SOCIAL_PROVIDER_ERROR)))
                .bodyToMono(KakaoTokenResponse.class)
                .onErrorMap(WebClientRequestException.class,
                        e -> new CustomException(ErrorCode.AUTH_SOCIAL_PROVIDER_ERROR))
                .block();
    }

    public KakaoUserInfoResponse getUserInfo(String kakaoAccessToken) {
        return webClientBuilder.build()
                .get()
                .uri("https://kapi.kakao.com/v2/user/me")
                .header("Authorization", "Bearer " + kakaoAccessToken)
                .retrieve()
                .onStatus(status -> status.is4xxClientError(),
                        resp -> Mono.error(new CustomException(ErrorCode.AUTH_INVALID_SOCIAL_CODE)))
                .onStatus(status -> status.is5xxServerError(),
                        resp -> Mono.error(new CustomException(ErrorCode.AUTH_SOCIAL_PROVIDER_ERROR)))
                .bodyToMono(KakaoUserInfoResponse.class)
                .onErrorMap(WebClientRequestException.class,
                        e -> new CustomException(ErrorCode.AUTH_SOCIAL_PROVIDER_ERROR))
                .block();
    }
}
