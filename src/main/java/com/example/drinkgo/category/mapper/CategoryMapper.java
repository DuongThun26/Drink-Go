package com.example.drinkgo.category.mapper;

import com.example.drinkgo.category.dto.request.CategoryRequest;
import com.example.drinkgo.category.dto.response.CategoryDetailResponse;
import com.example.drinkgo.category.dto.response.CategoryResponse;
import com.example.drinkgo.category.entity.CategoryEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    CategoryResponse toResponse(CategoryEntity category);
    CategoryEntity toEntity(CategoryRequest category);
    List<CategoryResponse> toListResponse(List<CategoryEntity> listCategory);
    CategoryDetailResponse toDetailResponse(CategoryEntity category);
    void updateEntity(CategoryRequest request, @MappingTarget CategoryEntity category);
}
