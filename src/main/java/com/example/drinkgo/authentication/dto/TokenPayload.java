package com.example.drinkgo.authentication.dto;


import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TokenPayload {
    private String token;
    private Long timeToLive;
    private String jwtId;
}
