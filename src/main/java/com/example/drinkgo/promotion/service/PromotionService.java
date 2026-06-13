package com.example.drinkgo.promotion.service;

import com.example.drinkgo.promotion.dto.request.PromotionRequest;
import com.example.drinkgo.promotion.dto.request.PromotionValidateRequest;
import com.example.drinkgo.promotion.dto.response.PromotionResponse;
import com.example.drinkgo.promotion.dto.response.PromotionSummaryResponse;
import com.example.drinkgo.promotion.entity.PromotionEntity;
import com.example.drinkgo.promotion.enums.PromotionStatus;
import com.example.drinkgo.promotion.mapper.PromotionMapper;
import com.example.drinkgo.promotion.repository.PromotionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PromotionService {

    private final PromotionRepository promotionRepository;
    private final PromotionMapper promotionMapper;

    public List<PromotionSummaryResponse> getPromotions(){
        return promotionMapper.toListResponse(promotionRepository.findAll());
    }

    public PromotionResponse getPromotion(Long id){
        PromotionEntity promotion = promotionRepository.findById(id).orElseThrow(() -> new RuntimeException("Promotion not found"));
        return promotionMapper.toResponse(promotion);
    }
    public PromotionResponse create(PromotionRequest request){
        PromotionEntity promotion = promotionMapper.toEntity(request);
        promotionRepository.save(promotion);
        return promotionMapper.toResponse(promotion);
    }

    public PromotionResponse update(Long id, PromotionRequest request){
        PromotionEntity promotion = promotionRepository.findById(id).orElseThrow(() -> new RuntimeException("Promotion not found"));
        promotionMapper.updateEntity(request, promotion);
        promotionRepository.save(promotion);
        return promotionMapper.toResponse(promotion);
    }

    public void delete(Long id){
        if(promotionRepository.existsById(id)){
            promotionRepository.deleteById(id);
        }
        else{
            throw new RuntimeException("Promotion does not exists");
        }
    }

    public boolean validate(PromotionValidateRequest request){
        PromotionEntity promotion = promotionRepository.findByCode(request.getCode());
        if(promotion == null) {
            throw new RuntimeException("Promotion does not exists");
        }
        if (promotion.getStatus() != PromotionStatus.ACTIVE || promotion.getQuantity() <= 0 || promotion.getPromotionStart().after(new Date()) || promotion.getPromotionEnd().before(new Date())) {
            throw new RuntimeException("Promotion invalid");
        }
        return true;
    }
}
