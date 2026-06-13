package com.example.drinkgo.address.entity;

import com.example.drinkgo.common.BaseEntity;
import com.example.drinkgo.user.entity.UserEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "addresses")
public class AddressEntity extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

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

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = true)
    private UserEntity user;
}
