package com.myfave.api.domain.shipping.dto.response;

import com.myfave.api.domain.shipping.client.TrackerDeliveryClient;
import lombok.Builder;
import lombok.Getter;

import java.time.OffsetDateTime;

@Getter
@Builder
public class TrackingResponse {

    private String trackingNumber;
    private String carrierId;
    private String statusCode;
    private String statusName;
    private OffsetDateTime time;
    private String location;
    private String description;

    public static TrackingResponse from(String carrierId,
                                        TrackerDeliveryClient.TrackResult result) {
        TrackerDeliveryClient.EventData lastEvent = result.getLastEvent();

        String statusCode = null;
        String statusName = null;
        OffsetDateTime time = null;
        String location = null;
        String description = null;

        if (lastEvent != null) {
            if (lastEvent.getStatus() != null) {
                statusCode = lastEvent.getStatus().getCode();
                statusName = lastEvent.getStatus().getName();
            }
            time = lastEvent.getTime();
            location = lastEvent.getLocation() != null
                    ? lastEvent.getLocation().getName() : null;
            description = lastEvent.getDescription();
        }

        return TrackingResponse.builder()
                .trackingNumber(result.getTrackingNumber())
                .carrierId(carrierId)
                .statusCode(statusCode)
                .statusName(statusName)
                .time(time)
                .location(location)
                .description(description)
                .build();
    }
}
