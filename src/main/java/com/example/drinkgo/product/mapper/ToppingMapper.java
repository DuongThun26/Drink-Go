package com.example.drinkgo.product.mapper;

import com.example.drinkgo.product.dto.request.ToppingRequest;
import com.example.drinkgo.product.dto.response.ToppingResponse;
import com.example.drinkgo.product.entity.ToppingEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ToppingMapper {
    ToppingResponse toResponse(ToppingEntity topping);
    ToppingEntity toEntity(ToppingRequest request);
    void updateEntity(ToppingRequest request, @MappingTarget ToppingEntity topping);
    List<ToppingResponse> toListResponse(List<ToppingEntity> toppingEntities);
}
