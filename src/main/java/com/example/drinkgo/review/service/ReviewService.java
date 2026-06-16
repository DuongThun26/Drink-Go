package com.example.drinkgo.review.service;

import com.example.drinkgo.authentication.security.AuthenticationFacade;
import com.example.drinkgo.product.entity.ProductEntity;
import com.example.drinkgo.product.exception.ProductNotFoundException;
import com.example.drinkgo.product.repository.ProductRepository;
import com.example.drinkgo.review.dto.request.ReviewRequest;
import com.example.drinkgo.review.dto.response.ReviewResponse;
import com.example.drinkgo.review.entity.ReviewEntity;
import com.example.drinkgo.review.exception.ReviewNotFoundException;
import com.example.drinkgo.review.mapper.ReviewMapper;
import com.example.drinkgo.review.repository.ReviewRepository;
import com.example.drinkgo.user.entity.UserEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {
    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final AuthenticationFacade authenticationFacade;
    private final ReviewMapper reviewMapper;

    public List<ReviewResponse> getReviews(Long productId){
        List<ReviewEntity> reviewEntities = reviewRepository.findAllByProductId(productId);
        return reviewMapper.toListResponse(reviewEntities);
    }

    public ReviewResponse create(Long productId, ReviewRequest request){
        ProductEntity product = productRepository.findById(productId).orElseThrow(() -> new ProductNotFoundException("Product does not exists"));
        UserEntity user = authenticationFacade.getCurrentUser();
        ReviewEntity review = reviewMapper.toEntity(request);
        review.setUser(user);
        review.setProduct(product);
        reviewRepository.save(review);
        return reviewMapper.toResponse(review);
    }

    public ReviewResponse update(Long id, ReviewRequest request){
        ReviewEntity review = reviewRepository.findById(id).orElseThrow(() -> new ReviewNotFoundException("Review does not exists"));
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        reviewRepository.save(review);
        return reviewMapper.toResponse(review);
    }

    public void delete(Long id){
        ReviewEntity review = reviewRepository.findById(id).orElseThrow(() -> new ReviewNotFoundException("Review does not exists"));
        reviewRepository.delete(review);
    }
}
