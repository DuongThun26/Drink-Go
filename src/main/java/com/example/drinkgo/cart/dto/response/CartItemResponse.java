package com.example.drinkgo.cart.dto.response;

import com.example.drinkgo.product.dto.response.ToppingResponse;
import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CartItemResponse {
    private Long productVariantId;
    private Integer quantity;
    private Long totalPrice;
    private List<ToppingResponse> toppings;
}
