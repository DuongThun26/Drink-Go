package com.example.drinkgo.user.service;

import com.example.drinkgo.user.dto.request.UserRequest;
import com.example.drinkgo.user.dto.response.UserResponse;
import com.example.drinkgo.user.entity.UserEntity;
import com.example.drinkgo.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class UserService {

    private final UserRepository userRepository;

    public UserResponse create(UserRequest request){
        if(userRepository.existsByUsername(request.getUsername())){
            throw new RuntimeException("User already exists");
        }
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String encodedPassword = passwordEncoder.encode(request.getPassword());
        UserEntity userEntity = UserEntity.builder()
                .username(request.getUsername())
                .password(encodedPassword)
                .build();
        userRepository.save(userEntity);
        return UserResponse.builder()
                .id(userEntity.getId())
                .build();
    }
}
