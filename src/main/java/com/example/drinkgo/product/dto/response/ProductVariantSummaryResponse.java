package com.example.drinkgo.product.dto.response;

import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductVariantSummaryResponse {
    private Long id;
    private ProductSizeSummaryResponse size;
    private Long price;
    private Long quantity;
    private List<String> images;
}
