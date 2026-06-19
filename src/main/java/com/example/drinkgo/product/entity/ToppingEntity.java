package com.example.drinkgo.product.entity;

import com.example.drinkgo.cart.entity.CartItemEntity;
import com.example.drinkgo.common.BaseEntity;
import com.example.drinkgo.order.entity.OrderDetailToppingEntity;
import com.example.drinkgo.product.enums.ToppingStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
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
@Table(name = "toppings")
public class ToppingEntity extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Topping name must not be blank")
    @Column(name = "name")
    private String name;

    @NotNull(message = "Topping price must not be null")
    @PositiveOrZero(message = "Topping price must >= 0")
    @Column(name = "price")
    private Long price;

    @NotNull(message = "Topping status must not be null")
    @Enumerated(EnumType.STRING)
    private ToppingStatus status;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "producttopping",
        joinColumns = @JoinColumn(name = "topping_id"),
        inverseJoinColumns = @JoinColumn(name = "product_id"))
    private List<ProductEntity> products;

    @ManyToMany(mappedBy = "toppings", fetch = FetchType.LAZY)
    private List<CartItemEntity> cartItems;

    @OneToMany(mappedBy = "topping", fetch = FetchType.LAZY)
    private List<OrderDetailToppingEntity> orderDetailToppings;
}
