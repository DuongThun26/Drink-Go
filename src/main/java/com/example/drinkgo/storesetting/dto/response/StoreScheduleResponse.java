package com.example.drinkgo.storesetting.dto.response;

import com.example.drinkgo.storesetting.enums.DayOfWeeks;
import lombok.*;

import java.time.LocalTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StoreScheduleResponse {
    private Long id;
    private DayOfWeeks dayOfWeek;
    private LocalTime openTime;
    private LocalTime closeTime;
}
