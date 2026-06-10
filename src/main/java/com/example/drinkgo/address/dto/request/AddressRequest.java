package com.example.drinkgo.address.dto.request;

import lombok.Getter;

@Getter
public class AddressRequest {
    private String receivename;
    private String receivephone;
    private String district;
    private String ward;
    private String province;
    private String detailaddress;
}
