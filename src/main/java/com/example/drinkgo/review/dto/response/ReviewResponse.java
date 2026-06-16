package com.example.drinkgo.review.dto.response;

import lombok.*;

@Builder
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponse {
    private Long id;
    private Long rating;
    private String comment;
    private Long productId;
    private String fullName;
}
