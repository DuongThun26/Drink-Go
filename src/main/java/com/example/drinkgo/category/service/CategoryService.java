package com.example.drinkgo.category.service;

import com.example.drinkgo.category.dto.request.CategoryRequest;
import com.example.drinkgo.category.dto.response.CategoryDetailResponse;
import com.example.drinkgo.category.dto.response.CategoryResponse;
import com.example.drinkgo.category.entity.CategoryEntity;
import com.example.drinkgo.category.exception.CategoryHasProductsException;
import com.example.drinkgo.category.exception.CategoryNotFoundException;
import com.example.drinkgo.category.mapper.CategoryMapper;
import com.example.drinkgo.category.repository.CategoryRepository;
import com.example.drinkgo.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final CategoryMapper categoryMapper;

    @Transactional(readOnly = true)
    public List<CategoryResponse> getAllCategories() {
        List<CategoryEntity> categoryEntities = categoryRepository.findAll();
        return categoryMapper.toListResponse(categoryEntities);
    }
    @Transactional(readOnly = true)
    public CategoryDetailResponse getCategoryById(Long id){
        if(id == null || id <= 0){
            throw new IllegalArgumentException("Category ID must be positive");
        }
        CategoryEntity categoryEntity = categoryRepository.findById(id).orElseThrow(() -> new CategoryNotFoundException("Category not found!"));
        return categoryMapper.toDetailResponse(categoryEntity);
    }


    public CategoryResponse createCategory(CategoryRequest categoryRequest) {
        try {
            CategoryEntity categoryEntity = categoryMapper.toEntity(categoryRequest);
            categoryRepository.save(categoryEntity);
            return categoryMapper.toResponse(categoryEntity);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create category", e);
        }
    }

    public CategoryResponse updateCategory(Long id, CategoryRequest categoryRequest){
        CategoryEntity categoryEntity = categoryRepository.findById(id).orElseThrow(() -> new CategoryNotFoundException("Category not found!"));
        categoryMapper.updateEntity(categoryRequest, categoryEntity);
        categoryRepository.save(categoryEntity);
        return categoryMapper.toResponse(categoryEntity);
    }

    public void deleteCategory(Long id){
        CategoryEntity categoryEntity = categoryRepository.findById(id).orElseThrow(() -> new CategoryNotFoundException("Category not found!"));
        if (productRepository.existsByCategoryId(id)) {
            throw new CategoryHasProductsException("Cannot delete category with id " + id + " because it has associated products.");
        }
        categoryRepository.delete(categoryEntity);
    }
}
