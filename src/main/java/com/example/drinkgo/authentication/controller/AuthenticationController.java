package com.example.drinkgo.authentication.controller;

import com.example.drinkgo.authentication.dto.request.LoginRequest;
import com.example.drinkgo.authentication.dto.response.LoginResponse;
import com.example.drinkgo.authentication.service.AuthenticationService;
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

    @PostMapping(value = "/auth/login")
    public LoginResponse login(@RequestBody LoginRequest request){
        return authenticationService.login(request);
    }

    @PostMapping(value = "/auth/logout")
    public void logout(@RequestHeader("Authorization") String bearerToken) throws ParseException {
        String token = bearerToken.replace("Bearer ", "");
        authenticationService.logout(token);
    }
}
