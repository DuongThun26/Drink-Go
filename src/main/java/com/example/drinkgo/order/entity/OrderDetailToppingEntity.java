package com.example.drinkgo.order.entity;

import com.example.drinkgo.common.BaseEntity;
import com.example.drinkgo.product.entity.ToppingEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Builder
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "orderdetailtoppings")
public class OrderDetailToppingEntity extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "toppingname")
    private String toppingName;

    @Column(name = "toppingprice")
    private Long toppingPrice;

    @Column(name = "quantity")
    private Long quantity;

    @ManyToOne
    @JoinColumn(name = "orderdetail_id")
    private OrderDetailEntity orderDetail;

    @ManyToOne
    @JoinColumn(name = "topping_id")
    private ToppingEntity topping;
}
