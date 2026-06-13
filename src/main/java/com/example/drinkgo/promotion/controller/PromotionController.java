package com.example.drinkgo.promotion.controller;

import com.example.drinkgo.promotion.dto.request.PromotionRequest;
import com.example.drinkgo.promotion.dto.request.PromotionValidateRequest;
import com.example.drinkgo.promotion.dto.response.PromotionResponse;
import com.example.drinkgo.promotion.dto.response.PromotionSummaryResponse;
import com.example.drinkgo.promotion.service.PromotionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class PromotionController {

    private final PromotionService promotionService;

    @GetMapping(value = "/promotions")
    public List<PromotionSummaryResponse> getPromotions(){
        return promotionService.getPromotions();
    }

    @GetMapping(value = "/promotions/{id}")
    public PromotionResponse getPromotion(@PathVariable Long id){
        return promotionService.getPromotion(id);
    }

    @PostMapping(value = "/admin/promotions")
    public PromotionResponse create(@Valid @RequestBody PromotionRequest request){
        return promotionService.create(request);
    }

    @PutMapping(value = "/admin/promotions/{id}")
    public PromotionResponse update(@PathVariable Long id, @Valid @RequestBody PromotionRequest request){
        return promotionService.update(id, request);
    }

    @DeleteMapping(value = "/admin/promotions/{id}")
    public void delete(@PathVariable Long id){
        promotionService.delete(id);
    }

    @PostMapping(value = "/promotions/validate")
    public boolean validate(@Valid @RequestBody PromotionValidateRequest request){
        return promotionService.validate(request);
    }
}
