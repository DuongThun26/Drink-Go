package com.example.drinkgo.cart.repository;

import com.example.drinkgo.cart.entity.CartEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<CartEntity, Long> {
    Optional<CartEntity> findBySessionId(String sessionId);
    Optional<CartEntity> findByUserId(Long userId);
}
