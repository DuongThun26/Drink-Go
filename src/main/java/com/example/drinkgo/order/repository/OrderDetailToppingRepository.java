package com.example.drinkgo.order.repository;

import com.example.drinkgo.order.entity.OrderDetailEntity;
import com.example.drinkgo.order.entity.OrderDetailToppingEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderDetailToppingRepository extends JpaRepository<OrderDetailToppingEntity, Long> {
    List<OrderDetailToppingEntity> findByOrderDetail(OrderDetailEntity orderDetail);
}

