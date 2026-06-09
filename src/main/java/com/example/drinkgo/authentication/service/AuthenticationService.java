package com.example.drinkgo.authentication.service;

import com.example.drinkgo.authentication.dto.JWTInfor;
import com.example.drinkgo.authentication.dto.TokenPayload;
import com.example.drinkgo.authentication.dto.request.LoginRequest;
import com.example.drinkgo.authentication.dto.request.RefreshRequest;
import com.example.drinkgo.authentication.dto.response.LoginResponse;
import com.example.drinkgo.authentication.entity.AccessTokenBlacklist;
import com.example.drinkgo.authentication.entity.RefreshTokenWhitelist;
import com.example.drinkgo.authentication.repository.AccessTokenBlacklistRepository;
import com.example.drinkgo.authentication.repository.RefreshTokenWhitelistRepository;
import com.example.drinkgo.user.entity.UserEntity;
import com.example.drinkgo.user.repository.UserRepository;
import com.nimbusds.jose.JOSEException;
import lombok.RequiredArgsConstructor;
import org.antlr.v4.runtime.Token;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.util.Date;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final AuthenticationManager authenticationManager;

    private final JWTService jwtService;
    private final AccessTokenBlacklistRepository accessTokenBlacklistRepository;
    private final RefreshTokenWhitelistRepository refreshTokenWhitelistRepository;
    private final UserRepository userRepository;

    public LoginResponse login(LoginRequest request){
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword());
        Authentication authenticate = authenticationManager.authenticate(authenticationToken);
        UserEntity user = (UserEntity) authenticate.getPrincipal();
        return issueTokens(user);
    }
    public LoginResponse refresh(RefreshRequest request) throws ParseException, JOSEException {
        String oldRefreshToken = request.getRefreshToken();
        if(oldRefreshToken == null || !jwtService.verifyRefreshToken(oldRefreshToken)){
            throw new BadCredentialsException("Invalid refresh token!");
        }
        JWTInfor jwtInfor = jwtService.parse(oldRefreshToken);
        UserEntity user = userRepository.findByUsername(jwtInfor.getSubject()).orElseThrow(() -> new BadCredentialsException("User not found!"));
        refreshTokenWhitelistRepository.deleteById(jwtInfor.getId());
        return issueTokens(user);
    }
    public LoginResponse issueTokens(UserEntity user){
        TokenPayload refreshTokenPayload = jwtService.generateRefreshToken(user);
        TokenPayload accessTokenPayload = jwtService.generateAccessToken(user, refreshTokenPayload.getJwtId());

        RefreshTokenWhitelist refreshTokenWhitelist = RefreshTokenWhitelist.builder()
                .jwtId(refreshTokenPayload.getJwtId())
                .timeToLive(refreshTokenPayload.getTimeToLive())
                .build();
        refreshTokenWhitelistRepository.save(refreshTokenWhitelist);
        return LoginResponse.builder()
                .accessToken(accessTokenPayload.getToken())
                .refreshToken(refreshTokenPayload.getToken())
                .build();
    }
    public void logout(String token) throws ParseException {
        JWTInfor jwtInfor = jwtService.parse(token);
        String jwtId = jwtInfor.getId();
        Date issueTime = jwtInfor.getIssueTime();
        Date expirationTime = jwtInfor.getExpirationTime();
        if(expirationTime.before(new Date())) return;
        AccessTokenBlacklist redisToken = AccessTokenBlacklist.builder()
                .jwtId(jwtId)
                .timeToLive(expirationTime.getTime() - new Date().getTime())
                .build();
        accessTokenBlacklistRepository.save(redisToken);
        String refreshJwtId = jwtInfor.getRefreshTokenId();
        if(refreshJwtId != null && refreshTokenWhitelistRepository.existsById(refreshJwtId)){
            refreshTokenWhitelistRepository.deleteById(refreshJwtId);
        }
    }
}
