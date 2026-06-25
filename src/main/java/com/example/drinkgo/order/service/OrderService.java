package com.example.drinkgo.order.service;

import com.example.drinkgo.order.dto.request.OrderRequest;
import com.example.drinkgo.order.dto.response.OrderDetailResponse;
import com.example.drinkgo.order.dto.response.OrderResponse;

import java.util.List;
import java.util.Map;

public interface OrderService {
    List<OrderResponse> getOrders(Map<String, Object> orderSearch);
    OrderDetailResponse getOrder(Long id);
    OrderResponse createOrder(OrderRequest order, String cartGuest);
    void deleteOrder(Long id);
    OrderResponse cancelOrder(String cartGuest, Long id);
}