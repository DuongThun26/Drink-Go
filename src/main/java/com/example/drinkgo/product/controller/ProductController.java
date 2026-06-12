package com.example.drinkgo.product.controller;

import com.example.drinkgo.product.dto.request.ProductRequest;
import com.example.drinkgo.product.dto.response.ProductDetailResponse;
import com.example.drinkgo.product.dto.response.ProductResponse;
import com.example.drinkgo.product.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping(value = "/products")
    public List<ProductResponse> getAllProducts(){
        return productService.getAllProducts();
    }

    @GetMapping(value = "/products/{id}")
    public ProductDetailResponse getProductById(@PathVariable Long id){
        return productService.getProductById(id);
    }

    @PostMapping(value = "/admin/products")
    @ResponseStatus(HttpStatus.CREATED)
    public ProductResponse createProduct(@Valid @RequestBody ProductRequest request){
        return productService.createProduct(request);
    }

    @PutMapping(value = "/admin/products/{id}")
    public ProductResponse updateProduct(@PathVariable Long id, @Valid @RequestBody ProductRequest request){
        return productService.updateProduct(id, request);
    }

    @DeleteMapping(value = "/admin/products/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProduct(@PathVariable Long id){
        productService.deleteProduct(id);
    }
}
