package com.example.drinkgo.authentication.controller;

import com.example.drinkgo.authentication.dto.request.LoginRequest;
import com.example.drinkgo.authentication.dto.request.RefreshRequest;
import com.example.drinkgo.authentication.dto.response.LoginResponse;
import com.example.drinkgo.authentication.service.AuthenticationService;
import com.example.drinkgo.user.dto.request.UserRequest;
import com.example.drinkgo.user.dto.response.UserResponse;
import com.example.drinkgo.user.service.UserService;
import com.nimbusds.jose.JOSEException;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import java.text.ParseException;

@RestController
@RequiredArgsConstructor
public class AuthenticationController {
    private final AuthenticationService authenticationService;
    private final UserService userService;

    @PostMapping(value = "/auth/login")
    public LoginResponse login(@RequestBody LoginRequest request){
        return authenticationService.login(request);
    }

    @PostMapping(value = "/auth/register")
    public UserResponse register(@RequestBody UserRequest request){
        return userService.create(request);
    }

    @PostMapping(value = "/auth/refresh")
    public LoginResponse refresh(@RequestBody RefreshRequest request) throws ParseException, JOSEException {
        return authenticationService.refresh(request);
    }
    @PostMapping(value = "/auth/logout")
    public void logout(@RequestHeader(value = "Authorization", required = false) String bearerToken) throws ParseException {
        String token = bearerToken.replace("Bearer ", "");
        authenticationService.logout(token);
    }
}
