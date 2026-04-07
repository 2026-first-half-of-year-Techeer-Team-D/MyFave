package com.myfave.api.domain.saleevent.dto.request;

import lombok.Getter;

import java.time.ZonedDateTime;
//이벤트 등록 api 추가하면서 추가
@Getter
public class SaleEventCreateRequest {

    private String eventName;
    private ZonedDateTime saleStartAt;
    private ZonedDateTime saleEndAt;
}
