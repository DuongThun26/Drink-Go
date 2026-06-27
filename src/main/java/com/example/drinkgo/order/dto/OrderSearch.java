package com.example.drinkgo.order.dto;

import com.example.drinkgo.order.enums.OrderStatus;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderSearch {
    private OrderStatus orderStatus;
    private String receiveName;
    private String receivePhone;
    private String paymentMethod;
    private LocalDate fromDate;
    private LocalDate toDate;
    private Long userId;
    private String sessionId;
}
