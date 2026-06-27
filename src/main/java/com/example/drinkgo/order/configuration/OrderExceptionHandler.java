package com.example.drinkgo.order.configuration;

import com.example.drinkgo.order.exception.OrderNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class OrderExceptionHandler {
    @ExceptionHandler(OrderNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleOrderException(OrderNotFoundException ex){
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalTime.now());
        body.put("status", HttpStatus.NOT_FOUND);
        body.put("message", ex.getMessage());
        body.put("error", "Order does not exists");
        return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
    }
}
