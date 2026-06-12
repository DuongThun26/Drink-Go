package com.example.drinkgo.product.controller;

import com.example.drinkgo.product.dto.request.ToppingRequest;
import com.example.drinkgo.product.dto.response.ToppingResponse;
import com.example.drinkgo.product.service.ToppingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ToppingController {
    private final ToppingService toppingService;

    @GetMapping(value = "/toppings")
    public List<ToppingResponse> getAllToppings(){
        return toppingService.getAllToppings();
    }

    @PostMapping(value = "/admin/toppings")
    public ToppingResponse createTopping(@Valid @RequestBody ToppingRequest request){
        return toppingService.createTopping(request);
    }

    @PutMapping(value = "/admin/toppings/{id}")
    public ToppingResponse updateTopping(@PathVariable Long id, @Valid @RequestBody ToppingRequest request){
        return toppingService.updateTopping(id, request);
    }

    @DeleteMapping(value = "/admin/toppings/{id}")
    public void deleteTopping(@PathVariable Long id){
        toppingService.deleteTopping(id);
    }

}
