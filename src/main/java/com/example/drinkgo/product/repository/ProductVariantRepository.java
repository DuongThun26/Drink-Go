package com.example.drinkgo.product.repository;

import com.example.drinkgo.product.entity.ProductVariantEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariantEntity, Long> {
    Optional<ProductVariantEntity> findByProductId(Long id);
}
