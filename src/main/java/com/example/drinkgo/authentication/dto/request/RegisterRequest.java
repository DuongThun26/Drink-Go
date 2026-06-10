package com.example.drinkgo.authentication.dto.request;

import com.example.drinkgo.address.dto.request.AddressRequest;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {
    private String username;
    private String password;
    private AddressRequest addressRequest;
}
