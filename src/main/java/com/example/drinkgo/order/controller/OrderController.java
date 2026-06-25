package com.example.drinkgo.order.controller;

import com.example.drinkgo.order.dto.request.OrderRequest;
import com.example.drinkgo.order.dto.response.OrderDetailResponse;
import com.example.drinkgo.order.dto.response.OrderResponse;
import com.example.drinkgo.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    // Lấy danh sách tất cả các đơn hàng
    @GetMapping(value = "/admin/orders")
    public List<OrderResponse> getOrders(@RequestParam(required = false) Map<String, Object> orderSearch) {
        return orderService.getOrders(orderSearch);
    }


    // Lấy thông tin chi tiết đơn hàng
    @GetMapping(value = "/orders/{id}")
    public OrderDetailResponse getOrder(@PathVariable Long id){
        return orderService.getOrder(id);
    }

    // Tạo đơn hàng từ cart
    @PostMapping(value = "/orders")
    public OrderResponse createOrder(@RequestBody OrderRequest orderRequest,
                                     @CookieValue(name = "cart_guest", required = false) String cartGuest) {
        return orderService.createOrder(orderRequest, cartGuest);
    }

    // Hủy đơn hàng
    @PatchMapping(value = "/orders/{id}/cancel")
    public OrderResponse cancelOrder(@CookieValue(name = "cart_guest", required = false) String cartGuest, @PathVariable Long id){
        return orderService.cancelOrder(cartGuest, id);
    }
}