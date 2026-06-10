package com.example.drinkgo.address.dto.response;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddressResponse {
    private Long id;
    private String receivename;
    private String receivephone;
    private String district;
    private String ward;
    private String province;
    private String detailaddress;
}
