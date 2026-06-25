package com.example.drinkgo.order.repository;

import com.example.drinkgo.order.dto.OrderSearch;
import com.example.drinkgo.order.entity.OrderEntity;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepositoryCustom {
    List<OrderEntity> findOrders(OrderSearch orderSearch);
}
