package com.myfave.api.global.config;

import io.micrometer.core.instrument.Gauge;
import io.micrometer.core.instrument.MeterRegistry;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import jakarta.annotation.PostConstruct;

/**
 * 커스텀 비즈니스 메트릭 등록 설정.
 * Actuator + Micrometer가 기본으로 노출하지 않는 도메인 특화 지표를 정의한다.
 *
 * 노출되는 메트릭:
 * - myfave_websocket_sessions_active: 현재 활성 WebSocket 세션 수 (모든 채팅방 합산)
 */
@Configuration
@RequiredArgsConstructor
public class MetricsConfig {

    private final MeterRegistry meterRegistry;
    private final SessionRegistry sessionRegistry;

    @PostConstruct
    public void registerMetrics() {
        // WebSocket 활성 세션 수 (Gauge)
        // 모든 채팅방의 세션 수 합. 시나리오 E (라이브 채팅 1000명 동시 접속) 검증용.
        Gauge.builder("myfave.websocket.sessions.active", sessionRegistry, this::totalActiveSessions)
                .description("현재 활성 WebSocket 세션 수 (모든 채팅방 합산)")
                .register(meterRegistry);
    }

    /**
     * SessionRegistry 내 모든 채팅방의 세션 수 합계 계산.
     */
    private double totalActiveSessions(SessionRegistry registry) {
        // SessionRegistry에 getTotalSessionCount() 메서드 추가하거나 여기서 합산
        // 현재 SessionRegistry는 roomId별 카운트만 제공하므로, 합산 로직을 여기 둠
        // (불변성 유지를 위해 SessionRegistry 코드를 안 건드림)
        return registry.totalActiveSessions();
    }
}