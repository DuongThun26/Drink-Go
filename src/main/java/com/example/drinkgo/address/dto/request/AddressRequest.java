package com.example.drinkgo.address.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AddressRequest {
    @NotBlank(message = "receivename is required")
    private String receivename;

    @NotBlank(message = "receivephone is required")
    @Pattern(regexp = "\\d{10,11}", message = "receivephone must be 10 to 11 digits")
    private String receivephone;

    @NotBlank(message = "district is required")
    private String district;

    @NotBlank(message = "ward is required")
    private String ward;

    @NotBlank(message = "province is required")
    private String province;

    @NotBlank(message = "detailaddress is required")
    private String detailaddress;
}
