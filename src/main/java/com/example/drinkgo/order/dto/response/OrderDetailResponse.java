package com.example.drinkgo.order.dto.response;

import com.example.drinkgo.order.enums.OrderStatus;
import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderDetailResponse {
    private Long id;
    private String code;
    private OrderStatus orderStatus;
    private Long finalAmount;
    private String receiveName;
    private List<OrderItemResponse> orderItems;
}
