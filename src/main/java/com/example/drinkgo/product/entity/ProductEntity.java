package com.example.drinkgo.product.entity;

import com.example.drinkgo.category.entity.CategoryEntity;
import com.example.drinkgo.common.BaseEntity;
import com.example.drinkgo.product.enums.ProductType;
import com.example.drinkgo.review.entity.ReviewEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "products")
public class ProductEntity extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "images")
    private List<String> images;

    @Column(name = "description")
    private String description;

    @Column(name = "producttype")
    private ProductType productType;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id")
    private CategoryEntity category;

    @OneToMany(mappedBy = "product", fetch = FetchType.LAZY)
    private List<ProductVariantEntity> variants;

    @ManyToMany(mappedBy = "products", fetch = FetchType.LAZY)
    private List<ToppingEntity> toppings;

    @OneToMany(mappedBy = "product")
    private List<ReviewEntity> reviews;
}
