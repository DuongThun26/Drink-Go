package com.example.drinkgo.product.dto.request;

import com.example.drinkgo.product.enums.ToppingStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;

@Getter
public class ToppingRequest {
    @NotBlank(message = "Topping name must not be blank")
    private String name;

    @NotNull(message = "Topping price must not be null")
    @PositiveOrZero(message = "Topping price must >= 0")
    private Long price;

    @NotNull(message = "Topping status must not be null")
    private ToppingStatus status;
}
