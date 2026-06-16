package com.example.drinkgo.review.mapper;

import com.example.drinkgo.review.dto.request.ReviewRequest;
import com.example.drinkgo.review.dto.response.ReviewResponse;
import com.example.drinkgo.review.entity.ReviewEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ReviewMapper {
    @Mapping(source = "product.id", target = "productId")
    @Mapping(source = "user.fullname", target = "fullName")
    ReviewResponse toResponse(ReviewEntity review);

    @Mapping(source = "product.id", target = "productId")
    @Mapping(source = "user.fullname", target = "fullName")
    List<ReviewResponse> toListResponse(List<ReviewEntity> reviewEntities);

    ReviewEntity toEntity(ReviewRequest request);
}
