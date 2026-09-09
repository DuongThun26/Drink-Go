package com.example.drinkgo.product.dto.request;

import com.example.drinkgo.product.enums.SizeStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;

@Getter
public class ProductSizeRequest {
    @NotBlank(message = "Size code must not be blank")
    @Size(max = 50, message = "Size code must not exceed 50 characters")
    private String code;

    @NotBlank(message = "Size name must not be blank")
    @Size(max = 256, message = "Size name must not exceed 256 characters")
    private String name;

    private SizeStatus status;
}
