package com.example.drinkgo.product.mapper;

import com.example.drinkgo.product.dto.request.ProductVariantRequest;
import com.example.drinkgo.product.dto.response.ProductVariantResponse;
import com.example.drinkgo.product.entity.ProductVariantEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ProductVariantMapper {
    ProductVariantResponse toResponse(ProductVariantEntity productVariant);
    ProductVariantEntity toEntity(ProductVariantRequest request);
    List<ProductVariantResponse> toListResponse(List<ProductVariantEntity> productVariantEntities);
    void updateEntity(ProductVariantRequest request, @MappingTarget ProductVariantEntity productVariant);

}
