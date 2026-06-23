package com.example.drinkgo.order.dto.request;

import com.example.drinkgo.order.enums.PaymentMethod;
import lombok.Getter;

@Getter
public class OrderRequest {
    private PaymentMethod paymentMethod;
    private String note;
    private String receivename;
    private String receivephone;
    private String province;
    private String district;
    private String ward;
    private String detailaddress;
}