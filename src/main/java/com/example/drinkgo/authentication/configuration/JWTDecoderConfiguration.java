package com.example.drinkgo.authentication.configuration;

import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class JWTDecoderConfiguration implements JwtDecoder {

    @Override
    public Jwt decode(String token) throws JwtException {
        return null;
    }
}
