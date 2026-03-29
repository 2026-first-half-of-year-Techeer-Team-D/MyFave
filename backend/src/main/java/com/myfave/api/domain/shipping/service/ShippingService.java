package com.myfave.api.domain.shipping.service;

import com.myfave.api.domain.shipping.repository.DeliveryRepository;
import com.myfave.api.domain.shipping.repository.ShippingAddressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ShippingService {

    private final ShippingAddressRepository shippingAddressRepository;
    private final DeliveryRepository deliveryRepository;
}
