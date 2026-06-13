package com.example.drinkgo.promotion.mapper;

import com.example.drinkgo.promotion.dto.request.PromotionRequest;
import com.example.drinkgo.promotion.dto.response.PromotionResponse;
import com.example.drinkgo.promotion.dto.response.PromotionSummaryResponse;
import com.example.drinkgo.promotion.entity.PromotionEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface PromotionMapper {
    PromotionResponse toResponse(PromotionEntity promotion);
    PromotionSummaryResponse toSummaryResponse(PromotionEntity promotion);
    PromotionEntity toEntity(PromotionRequest request);
    List<PromotionSummaryResponse> toListResponse(List<PromotionEntity> promotionEntities);
    void updateEntity(PromotionRequest request, @MappingTarget PromotionEntity promotion);
}
