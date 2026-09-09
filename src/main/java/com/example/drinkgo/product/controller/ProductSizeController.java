package com.example.drinkgo.product.controller;

import com.example.drinkgo.product.dto.request.ProductSizeRequest;
import com.example.drinkgo.product.dto.response.ProductSizeResponse;
import com.example.drinkgo.product.service.ProductSizeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ProductSizeController {
    private final ProductSizeService productSizeService;

    @GetMapping(value = "/sizes")
    public List<ProductSizeResponse> getAllSizes() {
        return productSizeService.getAllSizes();
    }

    @GetMapping(value = "/sizes/{id}")
    public ProductSizeResponse getSizeById(@PathVariable Long id) {
        return productSizeService.getSizeById(id);
    }

    @PostMapping(value = "/admin/sizes")
    @ResponseStatus(HttpStatus.CREATED)
    public ProductSizeResponse createSize(@Valid @RequestBody ProductSizeRequest request) {
        return productSizeService.createSize(request);
    }

    @PutMapping(value = "/admin/sizes/{id}")
    public ProductSizeResponse updateSize(
            @PathVariable Long id,
            @Valid @RequestBody ProductSizeRequest request) {
        return productSizeService.updateSize(id, request);
    }

    @DeleteMapping(value = "/admin/sizes/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteSize(@PathVariable Long id) {
        productSizeService.deleteSize(id);
    }
}
