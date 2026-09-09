package com.example.drinkgo.product.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;

@Getter
public class ProductVariantRequest {

    @NotNull(message = "Size ID must not be null")
    private Long sizeId;

    @NotNull(message = "Price must not be null")
    @PositiveOrZero(message = "Price must be greater than or equal to 0")
    private Long price;

    @NotNull(message = "Quantity must not be null")
    @PositiveOrZero(message = "Quantity must be greater than or equal to 0")
    private Long quantity;

    private Long productId;
}
