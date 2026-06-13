package com.example.drinkgo.promotion.entity;

import com.example.drinkgo.promotion.enums.PromotionStatus;
import com.example.drinkgo.promotion.enums.PromotionType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.Date;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "promotions")
public class PromotionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Promotion name not blank")
    @Column(name = "name")
    private String name;

    @NotBlank(message = "Promotion code not blank")
    @Column(name = "code")
    private String code;

    @Column(name = "promotionstart")
    private Date promotionStart;

    @Column(name = "promotionend")
    private Date promotionEnd;

    @Column(name = "discountpercent")
    private Integer discountPercent;

    @Column(name = "quantity")
    private Long quantity;

    private PromotionStatus status;

    private PromotionType promotionType;
}
