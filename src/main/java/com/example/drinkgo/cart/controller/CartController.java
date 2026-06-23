package com.example.drinkgo.cart.controller;

import com.example.drinkgo.authentication.security.AuthenticationFacade;
import com.example.drinkgo.cart.dto.request.CartItemRequest;
import com.example.drinkgo.cart.service.CartService;
import com.example.drinkgo.user.entity.UserEntity;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;
    private final AuthenticationFacade authenticationFacade;

    private Long getUserId() {
        try {
            UserEntity user = authenticationFacade.getCurrentUser();
            return user.getId();
        } catch (Exception e) {
            return null;
        }
    }

    @GetMapping
    public ResponseEntity<?> getCart(@CookieValue(name = "cart_guest", required = false) String cartGuest,
                                     HttpServletResponse response) {
        Long userId = getUserId();
        if (userId == null && cartGuest == null) {
            cartGuest = UUID.randomUUID().toString();
            Cookie cookie = new Cookie("cart_guest", cartGuest);
            cookie.setPath("/");
            cookie.setMaxAge(60 * 60 * 24 * 30); // 30 days
            response.addCookie(cookie);
        }
        return ResponseEntity.ok(cartService.getCart(cartGuest, userId));
    }

    @PostMapping("/items")
    public ResponseEntity<?> addItemToCart(@CookieValue(name = "cart_guest", required = false) String cartGuest,
                                           @RequestBody CartItemRequest item,
                                           HttpServletResponse response) {
        Long userId = getUserId();
        if (userId == null && cartGuest == null) {
            cartGuest = UUID.randomUUID().toString();
            Cookie cookie = new Cookie("cart_guest", cartGuest);
            cookie.setPath("/");
            cookie.setMaxAge(60 * 60 * 24 * 30); // 30 days
            response.addCookie(cookie);
        }
        return ResponseEntity.ok(cartService.addItemToCart(cartGuest, userId, item));
    }

    @PutMapping("/items/{id}")
    public ResponseEntity<?> updateCartItem(@CookieValue(name = "cart_guest", required = false) String cartGuest,
                                            @PathVariable Long id,
                                            @RequestBody CartItemRequest item) {
        Long userId = getUserId();
        return ResponseEntity.ok(cartService.updateCartItem(cartGuest, userId, id, item));
    }

    @DeleteMapping("/items/{id}")
    public ResponseEntity<?> deleteCartItem(@CookieValue(name = "cart_guest", required = false) String cartGuest,
                                            @PathVariable Long id) {
        Long userId = getUserId();
        cartService.deleteCartItem(cartGuest, userId, id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/items")
    public ResponseEntity<?> clearCart(@CookieValue(name = "cart_guest", required = false) String cartGuest) {
        Long userId = getUserId();
        cartService.clearCart(cartGuest, userId);
        return ResponseEntity.ok().build();
    }
}