package com.example.drinkgo.user.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@AllArgsConstructor
public class UserRequest {
    private String username;
    private String password;
}
