package com.example.drinkgo.order.repository;

import com.example.drinkgo.order.entity.OrderEntity;
import com.example.drinkgo.user.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<OrderEntity, Long>, OrderRepositoryCustom {
    OrderEntity findByUserAndId(UserEntity user, Long id);
    OrderEntity findBySessionIdAndId(String sessionId, Long id);
    List<OrderEntity> findAllByUser(UserEntity user);
    List<OrderEntity> findAllBySessionId(String sessionId);
}
