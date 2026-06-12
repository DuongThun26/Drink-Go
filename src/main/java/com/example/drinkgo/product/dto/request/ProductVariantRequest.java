package com.example.drinkgo.product.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.Getter;

@Getter
public class ProductVariantRequest {

    @NotBlank(message = "Size name must not be blank")
    @Size(max = 256, message = "Size name must not exceed 256 characters")
    private String sizeName;

    @NotNull(message = "Price must not be null")
    @PositiveOrZero(message = "Price must be greater than or equal to 0")
    private Long price;

    private Long productId;
}
