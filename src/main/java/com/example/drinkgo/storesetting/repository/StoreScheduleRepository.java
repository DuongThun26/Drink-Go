package com.example.drinkgo.storesetting.repository;

import com.example.drinkgo.storesetting.entity.StoreScheduleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.DayOfWeek;

@Repository
public interface StoreScheduleRepository extends JpaRepository<StoreScheduleEntity, Long> {
    StoreScheduleEntity findByDayOfWeek(DayOfWeek today);
}
