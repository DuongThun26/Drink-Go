package com.example.drinkgo.cart.dto.response;

import lombok.Data;

import java.util.List;

@Data
public class CartResponse {
    private List<CartItemResponse> items;
    private Long totalPrice;
}
