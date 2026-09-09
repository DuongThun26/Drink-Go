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
    private Long id;
    private Long productVariantId;
    private String productName;
    private String variantSizeName;
    private Long variantPrice;
    private Integer quantity;
    private Long totalPrice;
    private List<ToppingResponse> toppings;
    private List<ToppingResponse> availableToppings;
}
