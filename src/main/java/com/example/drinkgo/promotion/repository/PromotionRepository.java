package com.example.drinkgo.promotion.repository;

import com.example.drinkgo.promotion.entity.PromotionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PromotionRepository extends JpaRepository<PromotionEntity, Long> {
    PromotionEntity findByCode(String code);

    boolean existsByCode(String code);
}
