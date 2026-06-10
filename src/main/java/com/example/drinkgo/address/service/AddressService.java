package com.example.drinkgo.address.service;

import com.example.drinkgo.address.dto.request.AddressRequest;
import com.example.drinkgo.address.dto.response.AddressResponse;
import com.example.drinkgo.address.entity.AddressEntity;
import com.example.drinkgo.address.repository.AddressRepository;
import com.example.drinkgo.authentication.security.AuthenticationFacade;
import com.example.drinkgo.user.entity.UserEntity;
import com.example.drinkgo.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AddressService {

    private final AddressRepository addressRepository;
    private final AuthenticationFacade authenticationFacade;

    public List<AddressResponse> getAllForCurrentUser(){
        UserEntity user = authenticationFacade.getCurrentUser();
        List<AddressEntity> addressEntities = addressRepository.findAllByUser(user);
        List<AddressResponse> addresses = new ArrayList<>();
        for(AddressEntity e : addressEntities){
            AddressResponse address = AddressResponse.builder()
                    .id(e.getId())
                    .receivename(e.getReceivename())
                    .receivephone(e.getReceivephone())
                    .province(e.getProvince())
                    .district(e.getDistrict())
                    .ward(e.getWard())
                    .detailaddress(e.getDetailaddress())
                    .build();
            addresses.add(address);
        }
        return addresses;
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
        AddressEntity address = addressRepository.findByIdAndUserId(id, user.getId()).orElseThrow(() -> new RuntimeException("Not found address!"));
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
        if(addressRepository.existsByIdAndUserId(id, user.getId())){
            addressRepository.deleteById(id);
        }
    }
}
