package com.example.drinkgo.order.mapper;

import com.example.drinkgo.order.dto.response.OrderItemResponse;
import com.example.drinkgo.order.entity.OrderDetailEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", uses = {OrderToppingMapper.class})
public interface OrderDetailMapper {
    @Mapping(source = "orderDetailToppings", target = "toppings")
    OrderItemResponse toOrderItemResponse(OrderDetailEntity orderDetail);

    List<OrderItemResponse> toListOrderItemResponse(List<OrderDetailEntity> orderDetailEntities);
}
