package com.example.drinkgo.product.mapper;

import com.example.drinkgo.product.dto.request.ProductRequest;
import com.example.drinkgo.product.dto.response.ProductDetailResponse;
import com.example.drinkgo.product.dto.response.ProductResponse;
import com.example.drinkgo.product.entity.ProductEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ProductMapper {
    @Mapping(source = "category.name", target = "category")
    ProductResponse toResponse(ProductEntity product);
    ProductEntity toEntity(ProductRequest request);
    @Mapping(source = "category.name", target = "category")
    List<ProductResponse> toListProduct(List<ProductEntity> productEntities);
    @Mapping(source = "category.name", target = "category")
    ProductDetailResponse toDetailResponse(ProductEntity product);
    void updateEntity(ProductRequest request, @MappingTarget ProductEntity product);
}
