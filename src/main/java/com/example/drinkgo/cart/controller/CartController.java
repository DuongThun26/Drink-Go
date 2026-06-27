package com.example.drinkgo.cart.controller;

import com.example.drinkgo.authentication.security.AuthenticationFacade;
import com.example.drinkgo.cart.dto.request.CartItemRequest;
import com.example.drinkgo.cart.dto.response.CartResponse;
import com.example.drinkgo.cart.service.CartService;
import com.example.drinkgo.user.entity.UserEntity;
import com.example.drinkgo.util.CookieService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;
    private final AuthenticationFacade authenticationFacade;
    private final CookieService cookieService;

    private Long getUserId() {
        try {
            UserEntity user = authenticationFacade.getCurrentUser();
            return user.getId();
        } catch (Exception e) {
            return null;
        }
    }

    @GetMapping
    public ResponseEntity<CartResponse> getCart(@CookieValue(name = "cart_guest", required = false) String cartGuest,
                                                HttpServletResponse response) {
        Long userId = getUserId();
        if (userId == null) {
            cartGuest = cookieService.getOrCreateCartGuest(cartGuest, response);
        }
        return ResponseEntity.ok(cartService.getCart(cartGuest, userId));
    }

    @PostMapping("/items")
    public ResponseEntity<CartResponse> addItemToCart(@CookieValue(name = "cart_guest", required = false) String cartGuest,
                                                      @RequestBody CartItemRequest item,
                                                      HttpServletResponse response) {
        Long userId = getUserId();
        if (userId == null) {
            cartGuest = cookieService.getOrCreateCartGuest(cartGuest, response);
        }
        return ResponseEntity.ok(cartService.addItemToCart(cartGuest, userId, item));
    }

    @PutMapping("/items/{id}")
    public ResponseEntity<CartResponse> updateCartItem(@CookieValue(name = "cart_guest", required = false) String cartGuest,
                                                       @PathVariable Long id,
                                                       @RequestBody CartItemRequest item,
                                                       HttpServletResponse response) {
        Long userId = getUserId();
        if (userId == null) {
            cartGuest = cookieService.getOrCreateCartGuest(cartGuest, response);
        }
        return ResponseEntity.ok(cartService.updateCartItem(cartGuest, userId, id, item));
    }

    @DeleteMapping("/items/{id}")
    public ResponseEntity<Void> deleteCartItem(@CookieValue(name = "cart_guest", required = false) String cartGuest,
                                               @PathVariable Long id,
                                               HttpServletResponse response) {
        Long userId = getUserId();
        if (userId == null) {
            cartGuest = cookieService.getOrCreateCartGuest(cartGuest, response);
        }
        cartService.deleteCartItem(cartGuest, userId, id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/items")
    public ResponseEntity<Void> clearCart(@CookieValue(name = "cart_guest", required = false) String cartGuest,
                                          HttpServletResponse response) {
        Long userId = getUserId();
        if (userId == null) {
            cartGuest = cookieService.getOrCreateCartGuest(cartGuest, response);
        }
        cartService.clearCart(cartGuest, userId);
        return ResponseEntity.ok().build();
    }
}