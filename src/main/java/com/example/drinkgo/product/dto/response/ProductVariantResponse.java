package com.example.drinkgo.product.dto.response;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductVariantResponse {
    private Long id;

    @NotBlank(message = "Size name must not be blank")
    @Size(max = 256, message = "Size name must not exceed 256 characters")
    private String sizeName;

    @NotNull(message = "Price must not be null")
    @PositiveOrZero(message = "Price must be greater than or equal to 0")
    private Long price;

    private Long productId;
}
