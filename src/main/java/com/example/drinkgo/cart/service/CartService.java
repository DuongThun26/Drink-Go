package com.example.drinkgo.cart.service;

import com.example.drinkgo.cart.dto.response.CartResponse;
import com.example.drinkgo.cart.dto.request.CartItemRequest;

public interface CartService {
    CartResponse getCart(String cartGuest, Long userId);
    CartResponse addItemToCart(String cartGuest, Long userId, CartItemRequest item);
    CartResponse updateCartItem(String cartGuest, Long userId, Long id, CartItemRequest item);
    void deleteCartItem(String cartGuest, Long userId, Long id);
    void clearCart(String cartGuest, Long userId);
}
