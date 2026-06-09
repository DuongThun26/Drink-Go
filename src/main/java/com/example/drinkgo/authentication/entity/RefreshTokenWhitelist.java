package com.example.drinkgo.authentication.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.TimeToLive;

import java.util.concurrent.TimeUnit;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@RedisHash("whitelist:access")
public class RefreshTokenWhitelist {
    @Id
    private String jwtId;

    @TimeToLive(unit = TimeUnit.MILLISECONDS)
    private Long timeToLive;
}
