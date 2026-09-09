package com.example.drinkgo.promotion.dto.response;

import com.example.drinkgo.promotion.enums.PromotionStatus;
import com.example.drinkgo.promotion.enums.PromotionType;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PromotionResponse {
    private Long id;
    private String name;
    private String code;
    private LocalDateTime promotionStart;
    private LocalDateTime promotionEnd;
    private Integer discountPercent;
    private Long quantity;
    private PromotionStatus status;
    private PromotionType promotionType;
}
