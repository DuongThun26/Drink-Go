package com.example.drinkgo.order.entity;

import com.example.drinkgo.common.BaseEntity;
import com.example.drinkgo.order.enums.OrderStatus;
import com.example.drinkgo.order.enums.PaymentMethod;
import com.example.drinkgo.user.entity.UserEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.List;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "orders")
public class OrderEntity extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "code")
    private String code;

    @Column(name = "totalamount")
    private Long totalAmount;

    @Column(name = "discouuntamount")
    private Long discountAmount;

    @Column(name = "finalamount")
    private Long finalAmount;

    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;

    @Column(name = "note")
    private String note;

    @Column(name = "receivename")
    private String receivename;

    @NotBlank(message = "Require enter phone")
    @Column(name = "receivephone")
    private String receivephone;

    @NotBlank(message = "Require enter address")
    @Column(name = "province")
    private String province;

    @NotBlank(message = "Require enter address")
    @Column(name = "district")
    private String district;

    @NotBlank(message = "Require enter address")
    @Column(name = "ward")
    private String ward;

    @NotBlank(message = "Require enter address")
    @Column(name = "detailaddress")
    private String detailaddress;

    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserEntity user;

    @OneToMany(mappedBy = "order", fetch = FetchType.LAZY)
    private List<OrderDetailEntity> orderDetails;
}
