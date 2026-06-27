package com.example.drinkgo.order.dto.response;

import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderItemResponse {
    private String productName;
    private String sizeName;
    private Long quantity;
    private Long unitPrice;
    private List<OrderToppingResponse> toppings;
}
