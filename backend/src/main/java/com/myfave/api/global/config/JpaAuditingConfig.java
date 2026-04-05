package com.myfave.api.global.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.auditing.DateTimeProvider;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

import java.time.ZonedDateTime;
import java.util.Optional;

// @EnableJpaAuditing: JPA Auditing 활성화 (BaseEntity의 @CreatedDate, @LastModifiedDate 자동 주입)
// dateTimeProviderRef: 기본 LocalDateTime 대신 ZonedDateTime을 사용하도록 커스텀 Provider 지정
@Configuration
@EnableJpaAuditing(dateTimeProviderRef = "auditingDateTimeProvider")
public class JpaAuditingConfig {

    // ZonedDateTime.now()를 반환하는 DateTimeProvider 빈 등록
    // → BaseEntity의 createdAt, updatedAt 필드에 ZonedDateTime 값이 정상 주입됨
    @Bean
    public DateTimeProvider auditingDateTimeProvider() {
        return () -> Optional.of(ZonedDateTime.now());
    }
}
