package com.myfave.api.domain.shipping.service;

import com.myfave.api.domain.shipping.repository.DeliveryRepository;
import com.myfave.api.domain.shipping.repository.ShippingAddressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.myfave.api.domain.shipping.dto.response.ShippingAddressResponse;
import com.myfave.api.domain.shipping.entity.ShippingAddress;
import com.myfave.api.domain.user.entity.User;
import com.myfave.api.domain.user.repository.UserRepository;
import com.myfave.api.global.error.CustomException;
import com.myfave.api.global.error.ErrorCode;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ShippingService {

    private final ShippingAddressRepository shippingAddressRepository;
    private final DeliveryRepository deliveryRepository;
    private final UserRepository userRepository;

    // 7-1. 배송지 목록 조회
    public List<ShippingAddressResponse> getShippingAddresses(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        return shippingAddressRepository.findByUser(user).stream()
                .map(ShippingAddressResponse::from)
                .toList();
    }

    // 7-3. 배송지 삭제
    @Transactional
    public void deleteShippingAddress(Long userId, Long addressId) {
        // 1) 배송지가 존재하는지 확인
        ShippingAddress shippingAddress = shippingAddressRepository.findById(addressId)
                .orElseThrow(() -> new CustomException(ErrorCode.SHIPPING_ADDRESS_NOT_FOUND));

        // 2) 본인 배송지인지 확인
        if (!shippingAddress.getUser().getUserId().equals(userId)) {
            throw new CustomException(ErrorCode.AUTH_FORBIDDEN);
        }

        // 3) db에서 삭제
        shippingAddressRepository.delete(shippingAddress);
    }
}
