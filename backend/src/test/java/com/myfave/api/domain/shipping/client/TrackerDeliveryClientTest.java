package com.myfave.api.domain.shipping.client;

import com.myfave.api.global.error.CustomException;
import com.myfave.api.global.error.ErrorCode;
import okhttp3.mockwebserver.MockResponse;
import okhttp3.mockwebserver.MockWebServer;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.test.StepVerifier;

import java.io.IOException;

import static org.assertj.core.api.Assertions.assertThat;

class TrackerDeliveryClientTest {

    private MockWebServer mockWebServer;
    private TrackerDeliveryClient client;

    @BeforeEach
    void setUp() throws IOException {
        mockWebServer = new MockWebServer();
        mockWebServer.start();

        WebClient webClient = WebClient.builder()
                .baseUrl(mockWebServer.url("/").toString())
                .defaultHeader("Content-Type", "application/json")
                .build();

        client = new TrackerDeliveryClient(webClient);
    }

    @AfterEach
    void tearDown() throws IOException {
        mockWebServer.shutdown();
    }

    @Test
    @DisplayName("정상 GraphQL 응답 → TrackResult 파싱 성공")
    void trackAsync_success() {
        String body = """
                {
                  "data": {
                    "track": {
                      "trackingNumber": "1234567890",
                      "lastEvent": {
                        "status": { "code": "IN_TRANSIT", "name": "배송 중" },
                        "time": "2024-01-01T10:00:00+09:00",
                        "location": { "name": "서울 강남" },
                        "description": "배송 중입니다."
                      },
                      "events": { "edges": [] }
                    }
                  }
                }
                """;

        mockWebServer.enqueue(new MockResponse()
                .setResponseCode(200)
                .setHeader("Content-Type", "application/json")
                .setBody(body));

        StepVerifier.create(client.trackAsync("kr.cupost", "1234567890"))
                .assertNext(result -> {
                    assertThat(result.getTrackingNumber()).isEqualTo("1234567890");
                    assertThat(result.getLastEvent().getStatus().getCode()).isEqualTo("IN_TRANSIT");
                })
                .verifyComplete();
    }

    @Test
    @DisplayName("GraphQL errors 필드 포함 응답 → TRACKING_API_ERROR 예외")
    void trackAsync_graphqlErrors() {
        String body = """
                {
                  "errors": [{ "message": "Not found" }],
                  "data": null
                }
                """;

        mockWebServer.enqueue(new MockResponse()
                .setResponseCode(200)
                .setHeader("Content-Type", "application/json")
                .setBody(body));

        StepVerifier.create(client.trackAsync("kr.cupost", "INVALID"))
                .expectErrorSatisfies(ex -> {
                    assertThat(ex).isInstanceOf(CustomException.class);
                    assertThat(((CustomException) ex).getErrorCode())
                            .isEqualTo(ErrorCode.TRACKING_API_ERROR);
                })
                .verify();
    }

    @Test
    @Disabled("실제 15초 타임아웃 테스트 — 수동 실행 전용. " +
              "subscribeOn(Schedulers.boundedElastic())이 VirtualTime과 협력하지 않아 " +
              "자동 테스트 suite에서 제외합니다.")
    @DisplayName("서버 응답 지연 15초 초과 → TRACKING_API_ERROR 예외 (수동 전용)")
    void trackAsync_timeout() {
        mockWebServer.enqueue(new MockResponse()
                .setResponseCode(200)
                .setHeader("Content-Type", "application/json")
                .setBody("{}")
                .setBodyDelay(16, java.util.concurrent.TimeUnit.SECONDS));

        StepVerifier.create(client.trackAsync("kr.cupost", "1234567890"))
                .expectErrorSatisfies(ex -> {
                    assertThat(ex).isInstanceOf(CustomException.class);
                    assertThat(((CustomException) ex).getErrorCode())
                            .isEqualTo(ErrorCode.TRACKING_API_ERROR);
                })
                .verify(java.time.Duration.ofSeconds(20));
    }
}
