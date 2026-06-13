package com.example.drinkgo.promotion.dto.response;

import com.example.drinkgo.promotion.enums.PromotionStatus;
import com.example.drinkgo.promotion.enums.PromotionType;
import lombok.*;

import java.util.Date;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PromotionResponse {
    private Long id;
    private String name;
    private String code;
    private Date promotionStart;
    private Date promotionEnd;
    private Integer discountPercent;
    private Long quantity;
    private PromotionStatus status;
    private PromotionType promotionType;
}
