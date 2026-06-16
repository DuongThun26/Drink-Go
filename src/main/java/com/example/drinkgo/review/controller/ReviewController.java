package com.example.drinkgo.review.controller;

import com.example.drinkgo.review.dto.request.ReviewRequest;
import com.example.drinkgo.review.dto.response.ReviewResponse;
import com.example.drinkgo.review.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewService reviewService;

    @GetMapping(value = "/products/{productId}/reviews")
    public List<ReviewResponse> getReviews(@PathVariable Long productId){
        return reviewService.getReviews(productId);
    }

    @PostMapping(value = "/products/{productId}/reviews")
    public ReviewResponse create(@PathVariable Long productId, @Valid @RequestBody ReviewRequest request){
        return reviewService.create(productId, request);
    }

    @PutMapping(value = "/products/{productId}/reviews/{id}")
    public ReviewResponse update(@PathVariable Long id,@Valid @RequestBody ReviewRequest request){
        return reviewService.update(id, request);
    }

    @DeleteMapping("/products/{productId}/reviews/{id}")
    public void delete(@PathVariable Long id){
        reviewService.delete(id);
    }
}
