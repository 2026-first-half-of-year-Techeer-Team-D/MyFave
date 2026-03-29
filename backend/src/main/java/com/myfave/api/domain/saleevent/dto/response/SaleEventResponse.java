package com.myfave.api.domain.saleevent.dto.response;

import com.myfave.api.domain.saleevent.entity.SaleEvent;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.ZonedDateTime;

@Getter
@AllArgsConstructor
public class SaleEventResponse {

    private Long saleId;
    private String eventName;
    private ZonedDateTime saleStartAt;
    private ZonedDateTime saleEndAt;

    public static SaleEventResponse from(SaleEvent saleEvent) {
        return new SaleEventResponse(
                saleEvent.getSaleId(),
                saleEvent.getEventName(),
                saleEvent.getSaleStartAt(),
                saleEvent.getSaleEndAt()
        );
    }
}
