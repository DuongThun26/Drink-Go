package com.example.drinkgo.category.dto.request;

import com.example.drinkgo.category.enums.CategoryStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CategoryRequest {
    @NotBlank(message = "Category name cannot be blank")
    @Size(min = 1, max = 100, message = "Category name must be between 1 and 100 characters")
    private String name;

    @Size(min = 1, max = 50, message = "Category code must be between 1 and 50 characters")
    private String code;

    @Size(max = 256, message = "Category description cannot exceed 256 characters")
    private String description;

    @NotNull(message = "Category status cannot be null")
    private CategoryStatus status;
}
