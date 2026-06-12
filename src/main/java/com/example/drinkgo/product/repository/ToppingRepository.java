package com.example.drinkgo.product.repository;

import com.example.drinkgo.product.entity.ToppingEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ToppingRepository extends JpaRepository<ToppingEntity, Long> {
}
