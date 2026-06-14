package com.example.drinkgo.storesetting.repository;

import com.example.drinkgo.storesetting.entity.StoreSettingEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StoreSettingRepository extends JpaRepository<StoreSettingEntity, Long> {
}
