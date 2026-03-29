package com.myfave.api.domain.shipping.controller;

import com.myfave.api.domain.shipping.service.ShippingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/shipping")
@RequiredArgsConstructor
public class ShippingController {

    private final ShippingService shippingService;
}
