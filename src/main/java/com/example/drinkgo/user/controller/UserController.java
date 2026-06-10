package com.example.drinkgo.user.controller;

import com.example.drinkgo.authentication.dto.request.RegisterRequest;
import com.example.drinkgo.user.dto.request.UserRequest;
import com.example.drinkgo.user.dto.response.UserResponse;
import com.example.drinkgo.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping(value = "/users")
    public UserResponse create(@RequestBody RegisterRequest request){
        return userService.create(new UserRequest(request.getUsername(), request.getPassword()), request.getAddressRequest());
    }

}
