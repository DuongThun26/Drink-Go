package com.example.drinkgo.authentication.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ForgotPasswordResponse {
    private String resetToken;
    private Long timeToLive;
}

