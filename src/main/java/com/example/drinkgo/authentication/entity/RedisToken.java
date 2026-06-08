package com.example.drinkgo.authentication.entity;
import jakarta.persistence.Entity;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.TimeToLive;

import java.util.concurrent.TimeUnit;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@RedisHash("RedisHash")
@Builder
public class RedisToken {
    @Id
    private String jwtId;

    @TimeToLive(unit = TimeUnit.DAYS)
    private Long expiredTime;
}
