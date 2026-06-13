package com.example.drinkgo.address.controller;

import com.example.drinkgo.address.dto.request.AddressRequest;
import com.example.drinkgo.address.dto.response.AddressResponse;
import com.example.drinkgo.address.service.AddressService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/address/guest")
public class AddressGuestController {
    private final AddressService addressService;
    @PostMapping
    public AddressResponse createForGuest(@Valid @RequestBody AddressRequest request){
        return addressService.createForGuest(request);
    }
}
