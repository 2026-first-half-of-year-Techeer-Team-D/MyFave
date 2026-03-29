package com.myfave.api.domain.coupon.service;

import com.myfave.api.domain.coupon.repository.CouponMasterRepository;
import com.myfave.api.domain.coupon.repository.CouponRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CouponService {

    private final CouponRepository couponRepository;
    private final CouponMasterRepository couponMasterRepository;
}
