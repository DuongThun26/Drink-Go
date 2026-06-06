package com.example.drinkgo.authentication.service;

import com.example.drinkgo.authentication.dto.request.LoginRequest;
import com.example.drinkgo.authentication.dto.response.LoginResponse;
import com.example.drinkgo.user.entity.UserEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final AuthenticationManager authenticationManager;


    public LoginResponse login(LoginRequest request){
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword());
        Authentication authenticate = authenticationManager.authenticate(authenticationToken);
        UserEntity user = (UserEntity) authenticate.getPrincipal();
        return LoginResponse.builder()
                .accessToken("1234")
                .refreshToken("123")
                .build();
    }
}
