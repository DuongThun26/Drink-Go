package com.example.drinkgo.product.dto.response;

import com.example.drinkgo.product.enums.SizeStatus;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductSizeResponse {
    private Long id;
    private String code;
    private String name;
    private SizeStatus status;
}
