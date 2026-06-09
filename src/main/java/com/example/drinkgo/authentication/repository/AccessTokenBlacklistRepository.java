package com.example.drinkgo.authentication.repository;

import com.example.drinkgo.authentication.entity.AccessTokenBlacklist;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AccessTokenBlacklistRepository extends CrudRepository<AccessTokenBlacklist, String> {
}
