package com.example.drinkgo.product.configuration;

import com.example.drinkgo.product.exception.ToppingNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class ToppingExceptionHanlder {
    @ExceptionHandler(ToppingNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleToppingNotFound(ToppingNotFoundException ex){
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.NOT_FOUND.value());
        body.put("message", ex.getMessage());
        body.put("error", "Topping not found!");
        return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
    }
}
