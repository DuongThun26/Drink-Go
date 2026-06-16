package com.example.drinkgo.address.configuration;

import com.example.drinkgo.address.exception.AddressNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;


@RestControllerAdvice
public class AddressExceptionHandler {

    @ExceptionHandler(AddressNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleAddressNotFound(AddressNotFoundException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.NOT_FOUND.value());
        body.put("message", ex.getMessage());
        body.put("error", "Address Not Found");
        return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
    }
}
