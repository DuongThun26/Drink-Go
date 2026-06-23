package com.example.drinkgo.order.mapper;

import com.example.drinkgo.order.dto.response.OrderDetailResponse;
import com.example.drinkgo.order.dto.response.OrderItemResponse;
import com.example.drinkgo.order.entity.OrderDetailEntity;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface OrderDetailMapper {
    OrderDetailResponse toResponse(OrderDetailEntity orderDetail);
    OrderItemResponse toOrderItemResponse(OrderDetailEntity orderDetail);
    List<OrderItemResponse> toListOrderItemResponse(List<OrderDetailEntity> orderDetailEntities);
}
