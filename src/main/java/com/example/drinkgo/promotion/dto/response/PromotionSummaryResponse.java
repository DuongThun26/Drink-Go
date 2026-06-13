package com.example.drinkgo.promotion.dto.response;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PromotionSummaryResponse {
    private Long id;
    private String name;
    private String code;
}
