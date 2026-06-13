package com.example.drinkgo.address.mapper;

import com.example.drinkgo.address.dto.request.AddressRequest;
import com.example.drinkgo.address.dto.response.AddressResponse;
import com.example.drinkgo.address.entity.AddressEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface AddressMapper {
    AddressResponse toResponse(AddressEntity address);
    AddressEntity toEntity(AddressRequest request);
    List<AddressResponse> toListResponse(List<AddressEntity> addressEntities);
    void updateEntity(AddressRequest request, @MappingTarget AddressEntity address);
}
