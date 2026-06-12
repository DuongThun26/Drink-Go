package com.example.drinkgo.product.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.BAD_REQUEST)
public class ProductHasVariantsException extends RuntimeException {
    public ProductHasVariantsException(String message) {
        super(message);
    }
}

