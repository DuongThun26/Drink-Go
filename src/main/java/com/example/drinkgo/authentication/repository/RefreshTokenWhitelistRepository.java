package com.example.drinkgo.authentication.repository;

import com.example.drinkgo.authentication.entity.RefreshTokenWhitelist;
import org.springframework.data.repository.CrudRepository;

public interface RefreshTokenWhitelistRepository extends CrudRepository<RefreshTokenWhitelist, String> {
}
