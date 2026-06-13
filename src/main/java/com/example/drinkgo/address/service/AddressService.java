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
    // Guest đặt hàng không cần login
    public Long createForGuest(AddressRequest request){
        return null;
    }

    // Khi đăng kí thì điền luôn địa chỉ
    public Long createWhenRegister(AddressRequest request){
        UserEntity user = authenticationFacade.getCurrentUser();
        AddressEntity address = AddressEntity.builder()
                .receivename(request.getReceivename())
                .receivephone(request.getReceivephone())
                .province(request.getProvince())
                .district(request.getDistrict())
                .ward(request.getWard())
                .detailaddress(request.getDetailaddress())
                .user(user)
                .build();
        addressRepository.save(address);
        return address.getId();
    }

    // Khi đã đăng nhập và người dùng muốn thêm địa chỉ
    public Long create(AddressRequest request){
        UserEntity user = authenticationFacade.getCurrentUser();
        AddressEntity address = AddressEntity.builder()
                .receivename(request.getReceivename())
                .receivephone(request.getReceivephone())
                .province(request.getProvince())
                .district(request.getDistrict())
                .ward(request.getWard())
                .detailaddress(request.getDetailaddress())
                .user(user)
                .build();
        addressRepository.save(address);
        return address.getId();
    }

    public void update(Long id, AddressRequest request){
        UserEntity user = authenticationFacade.getCurrentUser();
        AddressEntity address = addressRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new AddressNotFoundException("Address not found with id: " + id));
        address.setReceivename(request.getReceivename());
        address.setReceivephone(request.getReceivephone());
        address.setProvince(request.getProvince());
        address.setWard(request.getWard());
        address.setDistrict(request.getDistrict());
        address.setDetailaddress(request.getDetailaddress());
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
