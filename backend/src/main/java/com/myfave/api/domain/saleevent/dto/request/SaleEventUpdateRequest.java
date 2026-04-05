package com.myfave.api.domain.saleevent.dto.request;

import lombok.Getter;

import java.time.ZonedDateTime;

// PATCH용 — 모든 필드가 선택(nullable). 보낸 필드만 수정됨
@Getter
public class SaleEventUpdateRequest {

    private String eventName;
    private ZonedDateTime saleStartAt;
    private ZonedDateTime saleEndAt;
}
