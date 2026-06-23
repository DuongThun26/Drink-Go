package com.example.drinkgo.util;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class CookieService {

    private static final String CART_GUEST_COOKIE = "cart_guest";
    private static final int COOKIE_MAX_AGE_DAYS = 30;

    public String getOrCreateCartGuest(String cartGuestCookie, HttpServletResponse response) {
        if (cartGuestCookie == null) {
            String newCartGuest = UUID.randomUUID().toString();
            Cookie cookie = new Cookie(CART_GUEST_COOKIE, newCartGuest);
            cookie.setPath("/");
            cookie.setMaxAge(60 * 60 * 24 * COOKIE_MAX_AGE_DAYS);
            response.addCookie(cookie);
            return newCartGuest;
        }
        return cartGuestCookie;
    }
}