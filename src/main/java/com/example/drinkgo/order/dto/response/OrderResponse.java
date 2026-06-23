package com.example.drinkgo.order.dto.response;

import com.example.drinkgo.order.enums.OrderStatus;
import com.example.drinkgo.order.enums.PaymentMethod;
import com.example.drinkgo.user.dto.response.UserResponse;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderResponse {
    private Long id;
    private String code;
    private Long totalAmount;
    private Long discountAmount;
    private Long finalAmount;
    private PaymentMethod paymentMethod;
    private String note;
    private String receivename;
    private String receivephone;
    private String province;
    private String district;
    private String ward;
    private String detailaddress;
    private OrderStatus status;
    private UserResponse user;
}
