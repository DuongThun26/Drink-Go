package com.example.drinkgo.product.dto.response;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductVariantSummaryResponse {
    private String sizeName;
    private Long price;
    private Long quantity;
}
