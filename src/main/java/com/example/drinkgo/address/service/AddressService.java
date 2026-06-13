package com.example.drinkgo.address.service;

import com.example.drinkgo.address.dto.request.AddressRequest;
import com.example.drinkgo.address.dto.response.AddressResponse;
import com.example.drinkgo.address.entity.AddressEntity;
import com.example.drinkgo.address.exception.AddressNotFoundException;
import com.example.drinkgo.address.mapper.AddressMapper;
import com.example.drinkgo.address.repository.AddressRepository;
import com.example.drinkgo.authentication.security.AuthenticationFacade;
import com.example.drinkgo.user.entity.UserEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AddressService {

    private final AddressRepository addressRepository;
    private final AuthenticationFacade authenticationFacade;
    private final AddressMapper addressMapper;

    public List<AddressResponse> getAllForCurrentUser(){
        UserEntity user = authenticationFacade.getCurrentUser();
        List<AddressEntity> addressEntities = addressRepository.findAllByUser(user);
        return addressMapper.toListResponse(addressEntities);
    }

    public AddressResponse createForGuest(AddressRequest request){
        AddressEntity address = addressMapper.toEntity(request);
        address.setUser(null);
        addressRepository.save(address);
        return addressMapper.toResponse(address);
    }

    // Đăng kí thêm cả địa chỉ
    public AddressResponse createWhenRegister(AddressRequest request, UserEntity user){
        AddressEntity address = addressMapper.toEntity(request);
        address.setUser(user);
        addressRepository.save(address);
        return addressMapper.toResponse(address);
    }

    // Khi đã đăng nhập và người dùng muốn thêm địa chỉ
    public AddressResponse create(AddressRequest request){
        UserEntity user = authenticationFacade.getCurrentUser();
        AddressEntity address = addressMapper.toEntity(request);
        address.setUser(user);
        addressRepository.save(address);
        return addressMapper.toResponse(address);
    }

    public void update(Long id, AddressRequest request){
        UserEntity user = authenticationFacade.getCurrentUser();
        AddressEntity address = addressRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new AddressNotFoundException("Address not found with id: " + id));
        addressMapper.updateEntity(request, address);
        addressRepository.save(address);
    }

    public void delete(Long id){
        UserEntity user = authenticationFacade.getCurrentUser();
        boolean exists = addressRepository.existsByIdAndUserId(id, user.getId());
        if(exists){
            addressRepository.deleteById(id);
        } else {
            throw new AddressNotFoundException("Address not found with id: " + id);
        }
    }
}
