package com.example.drinkgo.product.mapper;

import com.example.drinkgo.product.dto.request.ProductVariantRequest;
import com.example.drinkgo.product.dto.response.ProductVariantResponse;
import com.example.drinkgo.product.dto.response.ProductVariantSummaryResponse;
import com.example.drinkgo.product.entity.ProductVariantEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring", uses = {ProductSizeMapper.class})
public interface ProductVariantMapper {
    @Mapping(source = "size", target = "size")
    ProductVariantResponse toResponse(ProductVariantEntity productVariant);

    @Mapping(source = "size", target = "size")
    ProductVariantSummaryResponse toSummaryResponse(ProductVariantEntity productVariant);

    @Mapping(target = "size", ignore = true)
    ProductVariantEntity toEntity(ProductVariantRequest request);

    List<ProductVariantResponse> toListResponse(List<ProductVariantEntity> productVariantEntities);
    List<ProductVariantSummaryResponse> toListSummaryResponse(List<ProductVariantEntity> productVariantEntities);

    @Mapping(target = "size", ignore = true)
    void updateEntity(ProductVariantRequest request, @MappingTarget ProductVariantEntity productVariant);
}
