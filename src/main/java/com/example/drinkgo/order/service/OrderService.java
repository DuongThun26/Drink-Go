package com.example.drinkgo.order.service;

import com.example.drinkgo.order.dto.request.OrderRequest;
import com.example.drinkgo.order.dto.response.OrderDetailResponse;
import com.example.drinkgo.order.dto.response.OrderResponse;

import java.util.List;
import java.util.Map;

public interface OrderService {
    List<OrderResponse> getOrders(Map<String, Object> orderSearch, String sessionId);
    OrderDetailResponse getOrder(Long id);
    OrderResponse createOrder(OrderRequest order, String cartGuest);
    OrderResponse cancelOrder(String sessionId, Long id);
    OrderResponse confirmOrder(String sessionId, Long id);
    OrderResponse preparingOrder(String sessionId, Long id);
    OrderResponse shippingOrder(String sessionId, Long id);
    OrderResponse deliveredOrder(String sessionId, Long id);
    OrderResponse completedOrder(String sessionId, Long id);
}