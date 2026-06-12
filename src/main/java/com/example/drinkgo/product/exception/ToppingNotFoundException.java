package com.example.drinkgo.product.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.NOT_FOUND)
public class ToppingNotFoundException extends RuntimeException {
    public ToppingNotFoundException(String message) {
        super(message);
    }
}
