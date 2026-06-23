package com.example.drinkgo.order.controller;

import com.example.drinkgo.order.dto.request.OrderRequest;
import com.example.drinkgo.order.dto.response.OrderDetailResponse;
import com.example.drinkgo.order.dto.response.OrderResponse;
import com.example.drinkgo.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/orders")
public class OrderController {

    private final OrderService orderService;

    @GetMapping
    public Page<OrderResponse> getOrders(Pageable pageable) {
        return orderService.getOrders(pageable);
    }

    @GetMapping(value = "/{id}")
    public OrderDetailResponse getOrder(@PathVariable Long id){
        return orderService.getOrder(id);
    }

    @PostMapping
    public OrderResponse createOrder(@RequestBody OrderRequest orderRequest,
                                     @CookieValue(name = "cart_guest", required = false) String cartGuest) {
        return orderService.createOrder(orderRequest, cartGuest);
    }
}