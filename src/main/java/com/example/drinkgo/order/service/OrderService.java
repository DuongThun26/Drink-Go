package com.example.drinkgo.order.service;

import com.example.drinkgo.order.dto.request.OrderRequest;
import com.example.drinkgo.order.dto.response.OrderResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface OrderService {
    Page<OrderResponse> getOrders(Pageable pageable);
    OrderResponse getOrder(Long id);
    OrderResponse createOrder(OrderRequest order, String cartGuest);
    void deleteOrder(Long id);
}