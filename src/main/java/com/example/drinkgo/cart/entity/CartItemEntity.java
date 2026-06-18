package com.example.drinkgo.cart.entity;

import com.example.drinkgo.common.BaseEntity;
import com.example.drinkgo.product.entity.ProductVariantEntity;
import com.example.drinkgo.product.entity.ToppingEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "cartitems")
public class CartItemEntity extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "quantity")
    private Long quantity;

    @Column(name = "unitprice")
    private Long unitPrice;

    @ManyToOne
    @JoinColumn(name = "cart_id")
    private CartEntity cart;

    @ManyToOne
    @JoinColumn(name = "productvariant_id")
    private ProductVariantEntity productVariant;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "cartitemtopping",joinColumns = @JoinColumn(name = "cartitem_id"),
    inverseJoinColumns = @JoinColumn(name = "topping_id"))
    private List<ToppingEntity> toppings;
}
