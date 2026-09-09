package com.example.drinkgo.product.dto.response;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductSizeSummaryResponse {
    private Long id;
    private String code;
    private String name;
}
