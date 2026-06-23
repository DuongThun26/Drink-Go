package com.example.drinkgo.product.repository;

import com.example.drinkgo.product.entity.ProductVariantEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariantEntity, Long> {
    List<ProductVariantEntity> findByProductId(Long id);

    boolean existsByProductId(Long productId);

    ProductVariantEntity findByProductIdAndSizeName(Long productId, String sizeName);
}
