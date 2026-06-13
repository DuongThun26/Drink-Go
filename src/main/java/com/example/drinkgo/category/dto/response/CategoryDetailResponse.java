package com.example.drinkgo.category.dto.response;

import com.example.drinkgo.category.enums.CategoryStatus;
import com.example.drinkgo.product.dto.response.ProductSummaryResponse;
import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryDetailResponse {
    private Long id;
    private String name;
    private String code;
    private String description;
    private CategoryStatus status;
    private List<ProductSummaryResponse> products;
}
