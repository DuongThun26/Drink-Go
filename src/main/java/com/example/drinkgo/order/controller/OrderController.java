package com.example.drinkgo.order.controller;

import com.example.drinkgo.order.dto.request.OrderRequest;
import com.example.drinkgo.order.dto.response.OrderDetailResponse;
import com.example.drinkgo.order.dto.response.OrderResponse;
import com.example.drinkgo.order.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    // Lấy danh sách tất cả các đơn hàng (admin)
    @GetMapping(value = "/admin/orders")
    public List<OrderResponse> getOrders(@RequestParam(required = false) Map<String, Object> orderSearch) {
        return orderService.getOrders(orderSearch, null);
    }

    // Lấy danh sách đơn hàng của tôi (user hoặc guest)
    @GetMapping(value = "/orders")
    public List<OrderResponse> getMyOrders(@RequestParam(required = false) Map<String, Object> orderSearch,
                                           @CookieValue(name = "cart_guest", required = false) String cartGuest){
        return orderService.getOrders(orderSearch, cartGuest);
    }

    // Lấy thông tin chi tiết đơn hàng
    @GetMapping(value = "/orders/{id}")
    public OrderDetailResponse getOrder(@PathVariable Long id){
        return orderService.getOrder(id);
    }

    // Tạo đơn hàng từ cart
    @PostMapping(value = "/orders")
    public OrderResponse createOrder(@Valid @RequestBody OrderRequest orderRequest,
                                     @CookieValue(name = "cart_guest", required = false) String cartGuest) {
        return orderService.createOrder(orderRequest, cartGuest);
    }

    // Hủy đơn hàng
    @PatchMapping(value = "/orders/{id}/cancel")
    public OrderResponse cancelOrder(@CookieValue(name = "cart_guest", required = false) String cartGuest, @PathVariable Long id){
        return orderService.cancelOrder(cartGuest, id);
    }

    // Xác nhận đơn hàng
    @PatchMapping(value = "/admin/orders/{id}/confirm")
    public OrderResponse confirmOrder(@CookieValue(name = "cart_guest", required = false) String cartGuest, @PathVariable Long id){
        return orderService.confirmOrder(cartGuest, id);
    }

    // Chuẩn bị đơn hàng
    @PatchMapping(value = "/admin/orders/{id}/preparing")
    public OrderResponse preparingOrder(@CookieValue(name = "cart_guest", required = false) String cartGuest, @PathVariable Long id){
        return orderService.preparingOrder(cartGuest, id);
    }

    // Đang ship
    @PatchMapping(value = "/admin/orders/{id}/shipping")
    public OrderResponse shippingOrder(@CookieValue(name = "cart_guest", required = false) String cartGuest, @PathVariable Long id){
        return orderService.shippingOrder(cartGuest, id);
    }

    // Giao thành công
    @PatchMapping(value = "/admin/orders/{id}/delivered")
    public OrderResponse deliveredOrder(@CookieValue(name = "cart_guest", required = false) String cartGuest, @PathVariable Long id){
        return orderService.deliveredOrder(cartGuest, id);
    }

    // Hoàn thành
    @PatchMapping(value = "/admin/orders/{id}/completed")
    public OrderResponse completedOrder(@CookieValue(name = "cart_guest", required = false) String cartGuest, @PathVariable Long id){
        return orderService.completedOrder(cartGuest, id);
    }
}