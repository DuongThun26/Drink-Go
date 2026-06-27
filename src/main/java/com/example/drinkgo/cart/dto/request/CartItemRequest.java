package com.example.drinkgo.cart.dto.request;

import lombok.Data;

import java.util.List;

@Data
public class CartItemRequest {
    private Long productVariantId;
    private Integer quantity;
    private List<Long> toppings;
}
