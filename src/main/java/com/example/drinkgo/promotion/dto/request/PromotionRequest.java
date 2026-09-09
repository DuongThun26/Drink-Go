package com.example.drinkgo.promotion.dto.request;

import com.example.drinkgo.promotion.enums.PromotionStatus;
import com.example.drinkgo.promotion.enums.PromotionType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class PromotionRequest {
    @NotBlank(message = "Promotion name not blank")
    private String name;

    @NotBlank(message = "Promotion code not blank")
    private String code;

    @NotNull(message = "Promotion start date not null")
    private LocalDateTime promotionStart;

    @NotNull(message = "Promotion end date not null")
    private LocalDateTime promotionEnd;

    @NotNull
    private Integer discountPercent;

    private Long quantity;

    private PromotionStatus status;

    private PromotionType promotionType;
}
