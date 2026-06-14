package com.example.drinkgo.storesetting.dto.request;

import com.example.drinkgo.storesetting.enums.DayOfWeeks;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalTime;

@Getter
@Setter
public class StoreScheduleRequest {
    private DayOfWeeks dayOfWeek;

    @NotNull
    private LocalTime openTime;

    @NotNull
    private LocalTime closeTime;
}
