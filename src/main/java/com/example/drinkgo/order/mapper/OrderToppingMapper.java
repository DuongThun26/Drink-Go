package com.example.drinkgo.order.mapper;

import com.example.drinkgo.order.dto.response.OrderToppingResponse;
import com.example.drinkgo.order.entity.OrderDetailToppingEntity;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface OrderToppingMapper {
    OrderToppingResponse toResponse(OrderDetailToppingEntity topping);
    List<OrderToppingResponse> toListResponse(List<OrderDetailToppingEntity> toppingEntities);
}
