package com.example.drinkgo.user.dto.request;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
public class UserRequest {
    private String username;
    private String password;
}
