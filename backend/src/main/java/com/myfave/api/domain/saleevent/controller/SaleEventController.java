package com.myfave.api.domain.saleevent.controller;

import com.myfave.api.domain.saleevent.service.SaleEventService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/sale-events")
@RequiredArgsConstructor
public class SaleEventController {

    private final SaleEventService saleEventService;
}
