package com.example.drinkgo.cart.mapper;

import com.example.drinkgo.cart.dto.response.CartItemResponse;
import com.example.drinkgo.cart.dto.response.CartResponse;
import com.example.drinkgo.cart.entity.CartEntity;
import com.example.drinkgo.cart.entity.CartItemEntity;
import com.example.drinkgo.product.dto.response.ToppingResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", uses = ToppingResponse.class)
public interface CartMapper {
    @Mapping(source = "productVariant.id", target = "productVariantId")
    CartItemResponse toCartItemResponse(CartItemEntity cartItem);

    @Mapping(source = "productVariant.id", target = "productVariantId")
    List<CartItemResponse> toListCartItemResponse(List<CartItemEntity> cartItemEntities);

    CartResponse toCartResponse(CartEntity cart);
}
