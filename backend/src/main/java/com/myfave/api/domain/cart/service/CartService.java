package com.myfave.api.domain.cart.service;

import com.myfave.api.domain.cart.dto.response.CartItemResponse;
import com.myfave.api.domain.cart.repository.CartItemRepository;
import com.myfave.api.domain.cart.dto.request.CartItemRequest;
import com.myfave.api.domain.cart.dto.response.CartListResponse;
import com.myfave.api.domain.cart.dto.request.CartItemRequest;

import com.myfave.api.domain.cart.entity.CartItem;
import com.myfave.api.domain.product.entity.Product;
import com.myfave.api.domain.product.repository.ProductRepository;
import com.myfave.api.domain.user.entity.User;
import com.myfave.api.domain.user.repository.UserRepository;
import com.myfave.api.global.error.CustomException;
import com.myfave.api.global.error.ErrorCode;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    // 4-1. 장바구니 목록 조회
    public CartListResponse getCartItems(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        List<CartItemResponse> cartItems = cartItemRepository.findByUser(user).stream()
                .map(CartItemResponse::from)
                .toList();

        int totalPrice = cartItems.stream()
                .mapToInt(CartItemResponse::getPrice)
                .sum();
        int deliveryFee = 0; //배송비 기준 논의 필요!
        int totalPaymentPrice = totalPrice + deliveryFee;

        return new CartListResponse(cartItems, totalPrice, deliveryFee, totalPaymentPrice);
    }

    // 4-2. 장바구니에 상품 추가
    @Transactional
    public CartItemResponse addCartItem(Long userId, CartItemRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new CustomException(ErrorCode.PRODUCT_NOT_FOUND));

        if (product.getIsSoldout()) {
            throw new CustomException(ErrorCode.PRODUCT_SOLD_OUT);
        }

        if (cartItemRepository.existsByUserAndProduct(user, product)) {
            throw new CustomException(ErrorCode.CART_ALREADY_EXISTS);
        }

        CartItem cartItem = CartItem.builder()
                .user(user)
                .product(product)
                .build();

        cartItemRepository.save(cartItem);
        return CartItemResponse.from(cartItem);
    }

    // 4-3. 장바구니 개별 삭제
    @Transactional
    public void deleteCartItem(Long userId, Long cartItemId) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new CustomException(ErrorCode.CART_ITEM_NOT_FOUND));

        if (!cartItem.getUser().getUserId().equals(userId)) {
            throw new CustomException(ErrorCode.AUTH_FORBIDDEN);
        }

        cartItemRepository.delete(cartItem);
    }

    // 4-4. 장바구니 전체 삭제
    @Transactional
    public void deleteAllCartItems(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        cartItemRepository.deleteByUser(user);
    }


}
