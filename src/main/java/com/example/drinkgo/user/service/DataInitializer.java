package com.example.drinkgo.user.service;

import com.example.drinkgo.user.entity.RoleEntity;
import com.example.drinkgo.user.entity.UserEntity;
import com.example.drinkgo.user.enums.UserStatus;
import com.example.drinkgo.user.repository.RoleRepository;
import com.example.drinkgo.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private static final String USER_ROLE = "USER";
    private static final String ADMIN_ROLE = "ADMIN";
    private static final String DEFAULT_ADMIN_USERNAME = "admin";
    private static final String DEFAULT_ADMIN_PASSWORD = "admin123";

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        ensureRole(USER_ROLE, "User");
        RoleEntity adminRole = ensureRole(ADMIN_ROLE, "Admin");
        ensureDefaultAdmin(adminRole);
    }

    private RoleEntity ensureRole(String code, String name) {
        return roleRepository.findByCode(code)
                .orElseGet(() -> roleRepository.save(RoleEntity.builder()
                        .code(code)
                        .name(name)
                        .build()));
    }

    private void ensureDefaultAdmin(RoleEntity adminRole) {
        if (userRepository.existsByRoles_Code(ADMIN_ROLE)) {
            return;
        }

        UserEntity admin = userRepository.findByUsername(DEFAULT_ADMIN_USERNAME)
                .orElseGet(UserEntity::new);
        admin.setUsername(DEFAULT_ADMIN_USERNAME);
        admin.setPassword(passwordEncoder.encode(DEFAULT_ADMIN_PASSWORD));
        admin.setStatus(UserStatus.ACTIVE);
        admin.setRoles(List.of(adminRole));
        userRepository.save(admin);
    }
}
