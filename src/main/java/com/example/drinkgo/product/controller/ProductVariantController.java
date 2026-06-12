package com.example.drinkgo.product.controller;

import com.example.drinkgo.product.dto.request.ProductVariantRequest;
import com.example.drinkgo.product.dto.response.ProductVariantResponse;
import com.example.drinkgo.product.service.ProductVariantService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ProductVariantController {
    private final ProductVariantService productVariantService;

    @GetMapping(value = "/products/{productId}/variants")
    public List<ProductVariantResponse> getProductVariants(@PathVariable Long productId) {
        return productVariantService.getProductVariants(productId);
    }

    @PostMapping(value = "/admin/products/{productId}/variants")
    @ResponseStatus(HttpStatus.CREATED)
    public ProductVariantResponse createProductVariant(
            @PathVariable Long productId,
            @Valid @RequestBody ProductVariantRequest request) {
        return productVariantService.createProductVariant(productId, request);
    }

    @PutMapping(value = "/admin/products/{productId}/variants/{id}")
    public ProductVariantResponse updateProductVariant(
            @PathVariable Long productId,
            @PathVariable Long id,
            @Valid @RequestBody ProductVariantRequest request) {
        return productVariantService.updateProductVariant(productId, id, request);
    }

    @DeleteMapping(value = "/admin/products/{productId}/variants/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProductVariant(
            @PathVariable Long productId,
            @PathVariable Long id) {
        productVariantService.deleteProductVariant(productId, id);
    }
}
