package com.example.drinkgo.category.configuration;

import com.example.drinkgo.category.exception.CategoryHasProductsException;
import com.example.drinkgo.category.exception.CategoryNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class CategoryExceptionHandler {

    @ExceptionHandler(CategoryNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleCategoryNotFound(CategoryNotFoundException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.NOT_FOUND.value());
        body.put("message", ex.getMessage());
        body.put("error", "Category Not Found");
        return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(CategoryHasProductsException.class)
    public ResponseEntity<Map<String, Object>> handleCategoryHasProducts(CategoryHasProductsException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.BAD_REQUEST.value());
        body.put("message", ex.getMessage());
        body.put("error", "Category Has Products");
        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }
}
