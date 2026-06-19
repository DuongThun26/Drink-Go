package com.example.drinkgo.order.entity;

import com.example.drinkgo.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "orderdetails")
public class OrderDetailEntity extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "quantity")
    private Long quantity;

    @Column(name = "unitprice")
    private Long unitPrice;

    @Column(name = "totalprice")
    private Long totalPrice;

    @Column(name = "productname")
    private String productName;

    @Column(name = "sizename")
    private String sizeName;

    @Column(name = "productvariant_id")
    private Long productVariantId;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private OrderEntity order;

    @OneToMany(mappedBy = "orderDetail", fetch = FetchType.LAZY)
    private List<OrderDetailToppingEntity> orderDetailToppings;

}
