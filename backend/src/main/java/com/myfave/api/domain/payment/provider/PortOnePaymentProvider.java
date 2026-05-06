package com.myfave.api.domain.payment.provider;

import com.myfave.api.global.error.CustomException;
import com.myfave.api.global.error.ErrorCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.ZonedDateTime;
import java.util.Map;

@Slf4j
@Component
public class PortOnePaymentProvider implements PaymentProvider {

    private final WebClient webClient;

    public PortOnePaymentProvider(
            WebClient.Builder builder,
            @Value("${portone.api-url}") String apiUrl,
            @Value("${portone.api-secret}") String apiSecret
    ) {
        this.webClient = builder
                .baseUrl(apiUrl)
                .defaultHeader("Authorization", "PortOne " + apiSecret)
                .build();
    }

    @Override
    public PortOnePaymentInfo getPaymentInfo(String pgTransactionId) {
        Map<?, ?> body = webClient.get()
                .uri("/payments/{id}", pgTransactionId)
                .retrieve()
                .onStatus(status -> status.isError(), response ->
                        response.bodyToMono(String.class)
                                .map(err -> new CustomException(ErrorCode.PAYMENT_FAILED)))
                .bodyToMono(Map.class)
                .block();

        if (body == null) {
            throw new CustomException(ErrorCode.PAYMENT_FAILED);
        }

        String status = (String) body.get("status");
        int totalAmount = ((Number) ((Map<?, ?>) body.get("amount")).get("total")).intValue();
        String receiptUrl = (String) body.get("receiptUrl");
        ZonedDateTime paidAt = body.get("paidAt") != null
                ? ZonedDateTime.parse((String) body.get("paidAt"))
                : null;

        return new PortOnePaymentInfo(pgTransactionId, status, totalAmount, receiptUrl, paidAt);
    }

    @Override
    public void cancelPayment(String pgTransactionId, int cancelAmount, String reason) {
        Map<?, ?> body = webClient.post()
                .uri("/payments/{id}/cancel", pgTransactionId)
                .bodyValue(Map.of(
                        "reason", reason,
                        "amount", cancelAmount
                ))
                .retrieve()
                .onStatus(status -> status.isError(), response ->
                        response.bodyToMono(String.class)
                                .map(err -> new CustomException(ErrorCode.PAYMENT_FAILED)))
                .bodyToMono(Map.class)
                .block();

        if (body == null) {
            throw new CustomException(ErrorCode.PAYMENT_FAILED);
        }
    }
}