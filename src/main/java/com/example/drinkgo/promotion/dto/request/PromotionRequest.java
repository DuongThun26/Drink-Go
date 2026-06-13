package com.example.drinkgo.promotion.dto.request;

import com.example.drinkgo.promotion.enums.PromotionStatus;
import com.example.drinkgo.promotion.enums.PromotionType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

import java.util.Date;

@Getter
public class PromotionRequest {
    @NotBlank(message = "Promotion name not blank")
    private String name;

    @NotBlank(message = "Promotion code not blank")
    private String code;

    private Date promotionStart;

    private Date promotionEnd;

    @NotNull
    private Integer discountPercent;

    private Long quantity;

    private PromotionStatus status;

    private PromotionType promotionType;
}
