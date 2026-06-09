package com.example.drinkgo.authentication.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.TimeToLive;

import java.util.concurrent.TimeUnit;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@RedisHash("password:reset")
public class PasswordResetToken {
    @Id
    private String token;

    private String username;

    @TimeToLive(unit = TimeUnit.MILLISECONDS)
    private Long timeToLive;
}

