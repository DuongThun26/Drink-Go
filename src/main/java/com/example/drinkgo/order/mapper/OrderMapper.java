package com.example.drinkgo.order.mapper;

import com.example.drinkgo.order.dto.request.OrderRequest;
import com.example.drinkgo.order.dto.response.OrderDetailResponse;
import com.example.drinkgo.order.dto.response.OrderResponse;
import com.example.drinkgo.order.entity.OrderEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface OrderMapper {
    OrderResponse toResponse(OrderEntity order);
    @Mapping(source = "status", target = "orderStatus")
    @Mapping(source = "receivename", target = "receiveName")
    @Mapping(source = "orderDetails", target = "orderItems")
    OrderDetailResponse toOrderDetail(OrderEntity order);
    OrderEntity toEntity(OrderRequest request);

    List<OrderResponse> toResponseList(List<OrderEntity> orderEntities);
}
