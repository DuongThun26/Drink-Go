package com.example.drinkgo.order.dto.response;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderToppingResponse {
    private String toppingName;
    private Long toppingPrice;
    private Long quantity;
}
