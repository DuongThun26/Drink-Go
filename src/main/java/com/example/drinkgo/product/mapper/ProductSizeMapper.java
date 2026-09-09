package com.example.drinkgo.product.mapper;

import com.example.drinkgo.product.dto.request.ProductSizeRequest;
import com.example.drinkgo.product.dto.response.ProductSizeResponse;
import com.example.drinkgo.product.dto.response.ProductSizeSummaryResponse;
import com.example.drinkgo.product.entity.ProductSize;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ProductSizeMapper {
    ProductSizeResponse toResponse(ProductSize productSize);
    ProductSizeSummaryResponse toSummaryResponse(ProductSize productSize);
    ProductSize toEntity(ProductSizeRequest request);
    List<ProductSizeResponse> toListResponse(List<ProductSize> productSizes);
    List<ProductSizeSummaryResponse> toListSummaryResponse(List<ProductSize> productSizes);
    void updateEntity(ProductSizeRequest request, @MappingTarget ProductSize productSize);
}
