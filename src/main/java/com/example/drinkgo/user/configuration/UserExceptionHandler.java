package com.example.drinkgo.user.configuration;

import com.example.drinkgo.user.exception.UserNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class UserExceptionHandler {
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleUserException(UserNotFoundException ex){
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalTime.now());
        body.put("status", HttpStatus.NOT_FOUND);
        body.put("message", ex.getMessage());
        body.put("error", "Order does not exists");
        return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
    }
}
