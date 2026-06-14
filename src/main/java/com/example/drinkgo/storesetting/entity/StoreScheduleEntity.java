package com.example.drinkgo.storesetting.entity;

import com.example.drinkgo.common.BaseEntity;
import com.example.drinkgo.storesetting.enums.DayOfWeeks;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalTime;

@Entity
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "storeschedules")
public class StoreScheduleEntity extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "dayofweek")
    private DayOfWeeks dayOfWeek;

    @NotNull
    @Column(name = "opentime")
    private LocalTime openTime;

    @NotNull
    @Column(name = "closetime")
    private LocalTime closeTime;
}
