package com.example.drinkgo.cart.controller;

import com.example.drinkgo.cart.dto.request.CartItemRequest;
import com.example.drinkgo.cart.service.CartService;
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

    // Lấy thông tin giỏ hàng của khách hàng
    @GetMapping
    public ResponseEntity<?> getCart(@CookieValue(name = "cart_guest", required = false) String cartGuest,
                                     @RequestHeader(name = "user_id", required = false) Long userId,
                                     HttpServletResponse response) {
        // Nếu không phải là user và là lần đầu mua hàng
        if (userId == null && cartGuest == null) {
            cartGuest = UUID.randomUUID().toString();
            Cookie cookie = new Cookie("cart_guest", cartGuest);
            cookie.setPath("/");
            cookie.setMaxAge(60 * 60 * 24 * 30); // 30 days
            response.addCookie(cookie);
        }
        return ResponseEntity.ok(cartService.getCart(cartGuest, userId));
    }

    // Thêm sản phẩm vào giỏ hàng
    @PostMapping("/items")
    public ResponseEntity<?> addItemToCart(@CookieValue(name = "cart_guest", required = false) String cartGuest,
                                           @RequestHeader(name = "user_id", required = false) Long userId,
                                           @RequestBody CartItemRequest item,
                                           HttpServletResponse response) {
        if (userId == null && cartGuest == null) {
            cartGuest = UUID.randomUUID().toString();
            Cookie cookie = new Cookie("cart_guest", cartGuest);
            cookie.setPath("/");
            cookie.setMaxAge(60 * 60 * 24 * 30); // 30 days
            response.addCookie(cookie);
        }
        return ResponseEntity.ok(cartService.addItemToCart(cartGuest, userId, item));
    }

    // Cập nhật số lượng sản phẩm trong giỏ hàng
    @PutMapping("/items/{id}")
    public ResponseEntity<?> updateCartItem(@CookieValue(name = "cart_guest", required = false) String cartGuest,
                                            @RequestHeader(name = "user_id", required = false) Long userId,
                                            @PathVariable Long id,
                                            @RequestBody CartItemRequest item) {
        return ResponseEntity.ok(cartService.updateCartItem(cartGuest, userId, id, item));
    }

    // Xóa sản phẩm khỏi giỏ hàng
    @DeleteMapping("/items/{id}")
    public ResponseEntity<?> deleteCartItem(@CookieValue(name = "cart_guest", required = false) String cartGuest,
                                            @RequestHeader(name = "user_id", required = false) Long userId,
                                            @PathVariable Long id) {
        cartService.deleteCartItem(cartGuest, userId, id);
        return ResponseEntity.ok().build();
    }

    // Xóa tất cả sản phẩm khỏi giỏ hàng
    @DeleteMapping("/items")
    public ResponseEntity<?> clearCart(@CookieValue(name = "cart_guest", required = false) String cartGuest,
                                       @RequestHeader(name = "user_id", required = false) Long userId) {
        cartService.clearCart(cartGuest, userId);
        return ResponseEntity.ok().build();
    }
}
