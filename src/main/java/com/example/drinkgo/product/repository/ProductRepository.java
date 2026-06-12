package com.example.drinkgo.product.repository;

import com.example.drinkgo.category.entity.CategoryEntity;
import com.example.drinkgo.product.entity.ProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<ProductEntity, Long> {
	boolean existsByCategoryId(Long categoryId);
}
