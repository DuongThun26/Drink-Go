package com.example.drinkgo.authentication.controller;

import com.example.drinkgo.authentication.dto.request.ChangePasswordRequest;
import com.example.drinkgo.authentication.dto.request.ForgotPasswordRequest;
import com.example.drinkgo.authentication.dto.request.LoginRequest;
import com.example.drinkgo.authentication.dto.request.RefreshRequest;
import com.example.drinkgo.authentication.dto.request.ResetPasswordRequest;
import com.example.drinkgo.authentication.dto.response.ForgotPasswordResponse;
import com.example.drinkgo.authentication.dto.response.LoginResponse;
import com.example.drinkgo.authentication.service.AuthenticationService;
import com.example.drinkgo.user.dto.request.UserRequest;
import com.example.drinkgo.user.dto.response.UserResponse;
import com.example.drinkgo.user.service.UserService;
import com.nimbusds.jose.JOSEException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.BadCredentialsException;
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
    public LoginResponse login(@Valid @RequestBody LoginRequest request){
        return authenticationService.login(request);
    }

    @PostMapping(value = "/auth/register")
    public UserResponse register(@Valid @RequestBody UserRequest request){
        return userService.create(request);
    }

    @PostMapping(value = "/auth/refresh")
    public LoginResponse refresh(@Valid @RequestBody RefreshRequest request) throws ParseException, JOSEException {
        return authenticationService.refresh(request);
    }

    @PostMapping(value = "/auth/logout")
    public void logout(@RequestHeader(value = "Authorization", required = false) String bearerToken) throws ParseException {
        if (bearerToken == null || bearerToken.isBlank()) {
            throw new org.springframework.security.authentication.BadCredentialsException("Missing Authorization header");
        }
        String token = bearerToken.replace("Bearer ", "");
        authenticationService.logout(token);
    }

    @PostMapping(value = "/auth/change")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> change(@Valid @RequestBody ChangePasswordRequest request){
        authenticationService.change(request);
        return ResponseEntity.ok("Password changed successfully!");
    }

    @PostMapping(value = "/auth/forgot")
    public ResponseEntity<?> forgot(@Valid @RequestBody ForgotPasswordRequest request){
        ForgotPasswordResponse resp = authenticationService.forgot(request);
        return ResponseEntity.ok(resp);
    }

    @PostMapping(value = "/auth/reset")
    public ResponseEntity<?> reset(@Valid @RequestBody ResetPasswordRequest request){
        authenticationService.reset(request);
        return ResponseEntity.ok("Password reset successful!");
    }
}
