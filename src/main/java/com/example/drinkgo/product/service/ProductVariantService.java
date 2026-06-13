package com.example.drinkgo.product.service;

import com.example.drinkgo.product.dto.request.ProductVariantRequest;
import com.example.drinkgo.product.dto.response.ProductVariantResponse;
import com.example.drinkgo.product.entity.ProductEntity;
import com.example.drinkgo.product.entity.ProductVariantEntity;
import com.example.drinkgo.product.exception.ProductVariantNotFoundException;
import com.example.drinkgo.product.mapper.ProductVariantMapper;
import com.example.drinkgo.product.repository.ProductRepository;
import com.example.drinkgo.product.repository.ProductVariantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductVariantService {
    private final ProductVariantRepository productVariantRepository;
    private final ProductRepository productRepository;
    private final ProductVariantMapper productVariantMapper;

    public List<ProductVariantResponse> getProductVariants(Long productId) {
        if (productRepository.existsById(productId)) {
            return productVariantMapper.toListResponse(productVariantRepository.findByProductId(productId));
        }
        else {
            throw new RuntimeException("The Product does not exists");
        }
    }

    public ProductVariantResponse createProductVariant(Long productId, ProductVariantRequest request){
        ProductEntity product = productRepository.findById(productId).orElseThrow(() -> new RuntimeException("Product not found"));
        ProductVariantEntity variant = productVariantMapper.toEntity(request);
        variant.setProduct(product);
        productVariantRepository.save(variant);
        return productVariantMapper.toResponse(variant);
    }

    public ProductVariantResponse updateProductVariant(Long productId, Long variantId, ProductVariantRequest request){
        ProductVariantEntity variant = productVariantRepository.findById(variantId)
                .orElseThrow(() -> new ProductVariantNotFoundException("Variant not found"));
        if (variant.getProduct() == null || !variant.getProduct().getId().equals(productId)) {
            throw new ProductVariantNotFoundException("Variant not found for product id: " + productId);
        }
        productVariantMapper.updateEntity(request, variant);
        ProductVariantEntity updated = productVariantRepository.save(variant);

        return productVariantMapper.toResponse(updated);
    }

    public void deleteProductVariant(Long productId, Long variantId){
        ProductVariantEntity variant = productVariantRepository.findById(variantId)
                .orElseThrow(() -> new ProductVariantNotFoundException("Variant not found"));
        if (variant.getProduct() == null || !variant.getProduct().getId().equals(productId)) {
            throw new ProductVariantNotFoundException("Variant not found for product id: " + productId);
        }
        productVariantRepository.delete(variant);
    }


}
