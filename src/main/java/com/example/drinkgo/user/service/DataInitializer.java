package com.example.drinkgo.user.service;

import com.example.drinkgo.user.entity.RoleEntity;
import com.example.drinkgo.user.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;

    @Override
    public void run(String... args) throws Exception {
        if(roleRepository.findByCode("USER").isEmpty()){
            roleRepository.save(RoleEntity.builder().code("USER").name("User").build());
        }
        if(roleRepository.findByCode("ADMIN").isEmpty()){
            roleRepository.save(RoleEntity.builder().code("ADMIN").name("Admin").build());
        }
    }
}

