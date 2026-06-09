package com.example.drinkgo.authentication.repository;

import com.example.drinkgo.authentication.entity.PasswordResetToken;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PasswordResetTokenRepository extends CrudRepository<PasswordResetToken, String> {
}

