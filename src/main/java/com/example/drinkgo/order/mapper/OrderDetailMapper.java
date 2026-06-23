package com.example.drinkgo.order.mapper;

import com.example.drinkgo.order.dto.request.OrderDetailRequest;
import com.example.drinkgo.order.dto.response.OrderDetailResponse;
import com.example.drinkgo.order.entity.OrderDetailEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface OrderDetailMapper {
    OrderDetailResponse toResponse(OrderDetailEntity orderDetail);
    OrderDetailEntity toEntity(OrderDetailRequest request);
}
