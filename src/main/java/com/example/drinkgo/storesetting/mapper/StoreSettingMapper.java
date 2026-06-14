package com.example.drinkgo.storesetting.mapper;

import com.example.drinkgo.storesetting.dto.request.StoreSettingRequest;
import com.example.drinkgo.storesetting.dto.response.StoreSettingResponse;
import com.example.drinkgo.storesetting.entity.StoreSettingEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface StoreSettingMapper {
    StoreSettingResponse toResponse(StoreSettingEntity storeSetting);
    StoreSettingEntity toEntity(StoreSettingRequest request);
    void updateEntity(StoreSettingRequest request, @MappingTarget StoreSettingEntity storeSetting);
}
