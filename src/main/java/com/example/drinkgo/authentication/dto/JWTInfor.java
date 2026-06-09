package com.example.drinkgo.authentication.dto;

import lombok.*;

import java.util.Date;
import java.util.UUID;


@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JWTInfor {
    private String id;
    private Date issueTime;
    private Date expirationTime;
    private String refreshTokenId;
    private String subject;
    private String type;
}
