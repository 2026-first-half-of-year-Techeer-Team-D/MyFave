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
import com.myfave.api.domain.shipping.dto.request.ShippingAddressRequest;

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

    // 7-2. 배송지 추가
    @Transactional
    public ShippingAddressResponse addShippingAddress(Long userId, ShippingAddressRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        ShippingAddress shippingAddress = ShippingAddress.builder()
                .user(user)
                .receiverName(request.getReceiverName())
                .receiverPhone(request.getReceiverPhone())
                .address(request.getAddress())
                .addressDetail(request.getAddressDetail())
                .zipCode(request.getZipCode())
                .deliveryRequest(request.getDeliveryRequest())
                .isDefault(request.getIsDefault())
                .build();

        shippingAddressRepository.save(shippingAddress);
        return ShippingAddressResponse.from(shippingAddress);

    }
}
