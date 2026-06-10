package com.example.drinkgo.address.controller;

import com.example.drinkgo.address.dto.request.AddressRequest;
import com.example.drinkgo.address.dto.response.AddressResponse;
import com.example.drinkgo.address.service.AddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/users/me/addresses")
public class AddressController {

    private final AddressService addressService;

    // Validate địa chỉ Guest
    @PostMapping(value = "/validate")
    public boolean validateAddress(@RequestBody AddressRequest request){
        return request.getReceivename() != null && !request.getReceivename().isEmpty()
                && request.getReceivephone() != null && request.getReceivephone().matches("[0-9]{10,11}")
                && request.getProvince() != null && !request.getProvince().isEmpty();
    }

    @GetMapping
    public List<AddressResponse> getAllForCurrentUser(){
        return addressService.getAllForCurrentUser();
    }

    @PostMapping
    public Long create(@Valid @RequestBody AddressRequest request){
        return addressService.create(request);
    }

    @PutMapping(value = "/{id}")
    public void update(@PathVariable Long id, @Valid @RequestBody AddressRequest request){
        addressService.update(id, request);
    }

    @DeleteMapping(value = "/{id}")
    public void delete(@PathVariable Long id){
        addressService.delete(id);
    }
}
