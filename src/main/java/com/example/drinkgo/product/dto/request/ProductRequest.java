package com.example.drinkgo.product.dto.request;

import com.example.drinkgo.product.enums.ProductType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

import java.util.List;

@Getter
public class ProductRequest {
    @NotBlank(message = "Product name must not be blank")
    private String name;

    private List<String> images;

    private String description;

    @NotNull(message = "Product type must not be null")
    private ProductType productType;

    private Long categoryId;
}
