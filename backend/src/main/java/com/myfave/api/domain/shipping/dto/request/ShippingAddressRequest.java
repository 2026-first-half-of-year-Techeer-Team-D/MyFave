package com.myfave.api.domain.shipping.dto.request;

import lombok.Getter;

@Getter
public class ShippingAddressRequest {

    private String receiverName;
    private String receiverPhone;
    private String address;
    private String addressDetail;
    private String zipCode;
    private String deliveryRequest;
    private Boolean isDefault;
}
