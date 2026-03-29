package com.myfave.api.domain.saleevent.service;

import com.myfave.api.domain.saleevent.repository.SaleEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SaleEventService {

    private final SaleEventRepository saleEventRepository;
}
