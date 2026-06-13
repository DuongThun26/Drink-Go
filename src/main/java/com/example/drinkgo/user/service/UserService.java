package com.example.drinkgo.user.service;

import com.example.drinkgo.address.dto.request.AddressRequest;
import com.example.drinkgo.address.service.AddressService;
import com.example.drinkgo.user.dto.request.UserRequest;
import com.example.drinkgo.user.dto.response.UserResponse;
import com.example.drinkgo.user.entity.RoleEntity;
import com.example.drinkgo.user.entity.UserEntity;
import com.example.drinkgo.user.repository.RoleRepository;
import com.example.drinkgo.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class UserService {

    private final UserRepository userRepository;
    private final AddressService addressService;
    private final RoleRepository roleRepository;

    public UserResponse create(UserRequest request, AddressRequest address){
        if(userRepository.existsByUsername(request.getUsername())){
            throw new RuntimeException("User already exists");
        }
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String encodedPassword = passwordEncoder.encode(request.getPassword());
        UserEntity userEntity = UserEntity.builder()
                .username(request.getUsername())
                .password(encodedPassword)
                .build();
        RoleEntity userRole = roleRepository.findByCode("USER")
                .orElseGet(() -> roleRepository.save(RoleEntity.builder().code("USER").name("User").build()));
        userEntity.setRoles(List.of(userRole));

        userRepository.save(userEntity);
        if(address != null){
            addressService.createWhenRegister(address, userEntity);
        }
        return UserResponse.builder()
                .id(userEntity.getId())
                .build();
    }
}
