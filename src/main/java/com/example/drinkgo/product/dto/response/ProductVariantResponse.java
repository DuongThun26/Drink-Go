package com.example.drinkgo.product.dto.response;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductVariantResponse {
    private Long id;

    @NotNull(message = "Size must not be null")
    private ProductSizeResponse size;

    @NotNull(message = "Price must not be null")
    @PositiveOrZero(message = "Price must be greater than or equal to 0")
    private Long price;

    @NotNull(message = "Quantity must not be null")
    @PositiveOrZero(message = "Quantity must be greater than or equal to 0")
    private Long quantity;

    private Long productId;
}
