package com.example.drinkgo.product.entity;

import com.example.drinkgo.cart.entity.CartItemEntity;
import com.example.drinkgo.common.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.*;

import java.util.List;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "productvariants")
public class ProductVariantEntity extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Price must not be null")
    @PositiveOrZero(message = "Price must be greater than or equal to 0")
    @Column(name = "price")
    private Long price;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "size_id")
    private ProductSize size;

    @Column(name = "quantity")
    private Long quantity;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id")
    private ProductEntity product;

    @OneToMany(mappedBy = "productVariant")
    private List<CartItemEntity> cartItems;

}
