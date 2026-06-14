package com.example.drinkgo.storesetting.mapper;

import com.example.drinkgo.storesetting.dto.request.StoreScheduleRequest;
import com.example.drinkgo.storesetting.dto.response.StoreScheduleResponse;
import com.example.drinkgo.storesetting.entity.StoreScheduleEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface StoreScheduleMapper {
    List<StoreScheduleResponse> toListResponse(List<StoreScheduleEntity> storeScheduleEntities);
    StoreScheduleResponse toResponse(StoreScheduleEntity schedule);
    StoreScheduleEntity toEntity(StoreScheduleRequest request);
    void updateEntity(StoreScheduleRequest request, @MappingTarget StoreScheduleEntity storeSchedule);
}
