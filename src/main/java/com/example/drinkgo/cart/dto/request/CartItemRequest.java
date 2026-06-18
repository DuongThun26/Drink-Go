package com.example.drinkgo.cart.dto.request;

import lombok.Data;

@Data
public class CartItemRequest {
    private Long productVariantId;
    private Integer quantity;
}
