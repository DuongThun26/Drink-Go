package com.example.drinkgo.authentication.service;

import com.example.drinkgo.user.entity.UserEntity;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jwt.JWTClaimsSet;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.temporal.ChronoUnit;
import java.util.Date;

@Service
@RequiredArgsConstructor
public class JWTService {

    @Value("${secretkey}")
    private String secretKey;

    public String generateAccessToken(UserEntity user){
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);
        Date issueTime = new Date();
        Date expirationTime = Date.from(issueTime.toInstant().plus(15, ChronoUnit.MINUTES));
        JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                .subject(user.getUsername())
                .issueTime(issueTime)
                .expirationTime(expirationTime)
                .build();
        Payload payload = new Payload(claimsSet.toJSONObject());
        JWSObject jwsObject = new JWSObject(header, payload);
        try {
            jwsObject.sign(new MACSigner(secretKey));
        } catch (JOSEException e) {
            throw new RuntimeException(e);
        }
        return jwsObject.serialize();
    }

    public String generateRefreshToken(UserEntity user){
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);
        Date issueTime = new Date();
        Date expirationTime = Date.from(issueTime.toInstant().plus(14, ChronoUnit.DAYS));
        JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                .subject(user.getUsername())
                .issueTime(issueTime)
                .expirationTime(expirationTime)
                .build();
        Payload payload = new Payload(claimsSet.toJSONObject());
        JWSObject jwsObject = new JWSObject(header, payload);
        try {
            jwsObject.sign(new MACSigner(secretKey));
        } catch (JOSEException e) {
            throw new RuntimeException(e);
        }
        return jwsObject.serialize();
    }
}
