package com.example.drinkgo.product.dto.response;

import com.example.drinkgo.category.dto.response.CategoryResponse;
import com.example.drinkgo.product.enums.ProductType;
import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductDetailResponse {
    private Long id;
    private String name;
    private List<String> images;
    private String description;
    private ProductType productType;
    private CategoryResponse category;
    private List<ProductVariantResponse> variants;
    private List<ToppingResponse> toppings;
}
