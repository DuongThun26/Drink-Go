package com.example.drinkgo.product.configuration;

import com.example.drinkgo.product.exception.ProductHasVariantsException;
import com.example.drinkgo.product.exception.ProductNotFoundException;
import com.example.drinkgo.product.exception.ProductVariantNotFoundException;
import com.example.drinkgo.product.exception.ToppingNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class ProductExceptionHandler {

    @ExceptionHandler(ProductNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleProductNotFound(ProductNotFoundException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.NOT_FOUND.value());
        body.put("message", ex.getMessage());
        body.put("error", "Product Not Found");
        return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(ProductHasVariantsException.class)
    public ResponseEntity<Map<String, Object>> handleProductHasVariants(ProductHasVariantsException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.BAD_REQUEST.value());
        body.put("message", ex.getMessage());
        body.put("error", "Product Has Variants");
        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ProductVariantNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleProductVariantNotFound(ProductVariantNotFoundException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.NOT_FOUND.value());
        body.put("message", ex.getMessage());
        body.put("error", "Product Variant Not Found");
        return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(ToppingNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleToppingNotFound(ToppingNotFoundException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.NOT_FOUND.value());
        body.put("message", ex.getMessage());
        body.put("error", "Topping Not Found");
        return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
    }
}
