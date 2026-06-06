package com.example.drinkgo.user.controller;

import com.example.drinkgo.user.dto.request.UserRequest;
import com.example.drinkgo.user.dto.response.UserResponse;
import com.example.drinkgo.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @Value("${server.servlet.context-path}")
    private String API;

    @PostMapping(value = "/users")
    public UserResponse create(@RequestBody UserRequest request){
        return userService.create(request);
    }

}
