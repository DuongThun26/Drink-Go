package com.example.drinkgo.cart.dto.response;

import com.example.drinkgo.cart.dto.request.CartItemRequest;
import lombok.Data;

import java.util.List;

@Data
public class CartResponse {
    private List<CartItemRequest> items;
    private Double totalPrice;
}
