package com.example.drinkgo.authentication.repository;

import com.example.drinkgo.authentication.entity.RedisToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface RedisTokenRepository extends CrudRepository<RedisToken, String> {
}
