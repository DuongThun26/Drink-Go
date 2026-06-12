package com.example.drinkgo.product.dto.response;

import com.example.drinkgo.product.enums.ProductType;
import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductResponse {
    private Long id;
    private String name;
    private List<String> images;
    private String description;
    private ProductType productType;
    private Long categoryId;
}
