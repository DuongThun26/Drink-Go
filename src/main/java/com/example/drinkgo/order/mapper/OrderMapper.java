package com.example.drinkgo.order.mapper;

import com.example.drinkgo.order.dto.request.OrderRequest;
import com.example.drinkgo.order.dto.response.OrderResponse;
import com.example.drinkgo.order.entity.OrderEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface OrderMapper {
    OrderResponse toResponse(OrderEntity order);

    OrderEntity toEntity(OrderRequest request);

}
