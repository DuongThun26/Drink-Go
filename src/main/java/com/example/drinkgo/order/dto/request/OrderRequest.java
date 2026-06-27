package com.example.drinkgo.order.dto.request;

import com.example.drinkgo.order.enums.PaymentMethod;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;

@Getter
public class OrderRequest {
    private PaymentMethod paymentMethod;
    private String note;
    private String receivename;

    @NotNull
    @Pattern(regexp = "^[0-9]{10,11}$", message = "Phone must be 10-11 digits")
    private String receivephone;

    @NotBlank(message = "Require enter province")
    private String province;

    @NotBlank(message = "Require enter district")
    private String district;

    @NotBlank(message = "Require enter ward")
    private String ward;

    private String detailaddress;
}