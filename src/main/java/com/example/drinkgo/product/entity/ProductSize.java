package com.example.drinkgo.product.entity;

import com.example.drinkgo.common.BaseEntity;
import com.example.drinkgo.product.enums.SizeStatus;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "productsizes")
public class ProductSize extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "code")
    private String code;

    @Column(name = "name")
    private String name;

    @Enumerated(EnumType.STRING)
    private SizeStatus status;

    @OneToMany(mappedBy = "size", fetch = FetchType.LAZY)
    private List<ProductVariantEntity> productVariants;

}
