package com.example.drinkgo.product.dto.response;

import com.example.drinkgo.product.enums.ToppingStatus;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ToppingResponse {
    private Long id;
    private String name;
    private Long price;
    private ToppingStatus status;
}
