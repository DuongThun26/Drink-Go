package com.example.drinkgo.authentication.entity;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.TimeToLive;

import java.util.concurrent.TimeUnit;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@RedisHash("blacklist:access")
@Builder
public class AccessTokenBlacklist {
    @Id
    private String jwtId;

    @TimeToLive(unit = TimeUnit.MILLISECONDS)
    private Long timeToLive;
}
