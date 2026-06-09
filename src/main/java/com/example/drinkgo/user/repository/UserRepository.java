package com.example.drinkgo.user.repository;

import com.example.drinkgo.user.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {
    boolean existsByUsername(String username);
    Optional <UserEntity> findByUsername(String username);
    Optional<UserEntity> findByEmail(String email);
}
