package com.example.drinkgo.product.dto.response;

import com.example.drinkgo.product.enums.ToppingStatus;
import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ToppingResponse {
    private Long id;
    private String name;
    private Long price;
    private ToppingStatus status;
    private List<String> images;
}
