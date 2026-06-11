package com.example.drinkgo.category.service;

import com.example.drinkgo.category.dto.request.CategoryRequest;
import com.example.drinkgo.category.dto.response.CategoryResponse;
import com.example.drinkgo.category.entity.CategoryEntity;
import com.example.drinkgo.category.enums.CategoryStatus;
import com.example.drinkgo.category.exception.CategoryNotFoundException;
import com.example.drinkgo.category.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CategoryService {

    private final CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public List<CategoryResponse> getAllCategories() {
        try {
            List<CategoryEntity> categoryEntities = categoryRepository.findAll();
            if (categoryEntities.isEmpty()) {
                throw new CategoryNotFoundException("No categories found");
            }
            return categoryEntities.stream()
                    .map(categoryEntity -> CategoryResponse.builder()
                            .id(categoryEntity.getId())
                            .name(categoryEntity.getName())
                            .code(categoryEntity.getCode())
                            .description(categoryEntity.getDescription())
                            .status(String.valueOf(categoryEntity.getStatus()))
                            .build())
                    .toList();
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch categories", e);
        }
    }

    public CategoryResponse getCategoryById(Long id){
        CategoryEntity categoryEntity = categoryRepository.findById(id).orElseThrow(() -> new CategoryNotFoundException("Category not found!"));
        if(id == null || id <= 0){
            throw new IllegalArgumentException("Category ID must be positive");
        }
        return CategoryResponse.builder()
                .id(categoryEntity.getId())
                .name(categoryEntity.getName())
                .code(categoryEntity.getCode())
                .status(String.valueOf(categoryEntity.getStatus()))
                .description(categoryEntity.getDescription())
                .build();
    }


    public CategoryResponse createCategory(CategoryRequest categoryRequest) {
        try {
            CategoryEntity categoryEntity = CategoryEntity.builder()
                    .name(categoryRequest.getName())
                    .code(categoryRequest.getCode())
                    .description(categoryRequest.getDescription())
                    .status(categoryRequest.getStatus())
                    .build();

            categoryRepository.save(categoryEntity);
            return CategoryResponse.builder()
                    .id(categoryEntity.getId())
                    .name(categoryEntity.getName())
                    .code(categoryEntity.getCode())
                    .description(categoryEntity.getDescription())
                    .status(String.valueOf(categoryEntity.getStatus()))
                    .build();
        } catch (Exception e) {
            throw new RuntimeException("Failed to create category", e);
        }
    }

    public CategoryResponse updateCategory(Long id, CategoryRequest categoryRequest){
        CategoryEntity categoryEntity = categoryRepository.findById(id).orElseThrow(() -> new CategoryNotFoundException("Category not found!"));
        categoryEntity.setName(categoryRequest.getName());
        categoryEntity.setCode(categoryRequest.getCode());
        categoryEntity.setDescription(categoryRequest.getDescription());
        categoryEntity.setStatus((CategoryStatus) categoryRequest.getStatus());
        categoryRepository.save(categoryEntity);
        return CategoryResponse.builder()
                .id(categoryEntity.getId())
                .name(categoryEntity.getName())
                .code(categoryEntity.getCode())
                .description(categoryEntity.getDescription())
                .status(String.valueOf(categoryEntity.getStatus()))
                .build();
    }

    public void deleteCategory(Long id){
        CategoryEntity categoryEntity = categoryRepository.findById(id).orElseThrow(() -> new CategoryNotFoundException("Category not found!"));
        categoryRepository.delete(categoryEntity);
    }
}
