package com.example.drinkgo.product.service;

import com.example.drinkgo.product.dto.request.ProductVariantRequest;
import com.example.drinkgo.product.dto.response.ProductVariantResponse;
import com.example.drinkgo.product.entity.ProductEntity;
import com.example.drinkgo.product.entity.ProductVariantEntity;
import com.example.drinkgo.product.exception.ProductVariantNotFoundException;
import com.example.drinkgo.product.repository.ProductRepository;
import com.example.drinkgo.product.repository.ProductVariantRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductVariantService {
    private final ProductVariantRepository productVariantRepository;
    private final ProductRepository productRepository;
    private final ModelMapper modelMapper;

    public List<ProductVariantResponse> getProductVariants(Long productId) {
        if (productRepository.existsById(productId)) {
            return productVariantRepository.findByProductId(productId).stream()
                    .map(variant -> ProductVariantResponse.builder()
                            .id(variant.getId())
                            .sizeName(variant.getSizeName())
                            .price(variant.getPrice())
                            .productId(variant.getProduct().getId())
                            .build()).toList();
        }
        else {
            throw new RuntimeException("The Product does not exits");
        }
    }

    public ProductVariantResponse createProductVariant(Long productId, ProductVariantRequest request){
        ProductEntity product = productRepository.findById(productId).orElseThrow(() -> new RuntimeException("Product not found"));
        ProductVariantEntity variant = ProductVariantEntity.builder()
                .sizeName(request.getSizeName())
                .price(request.getPrice())
                .product(product)
                .build();
        productVariantRepository.save(variant);
        return modelMapper.map(variant, ProductVariantResponse.class);
    }

    public ProductVariantResponse updateProductVariant(Long productId, Long variantId, ProductVariantRequest request){
        ProductEntity product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        ProductVariantEntity variant = productVariantRepository.findById(variantId)
                .orElseThrow(() -> new ProductVariantNotFoundException("Variant not found"));

        variant.setSizeName(request.getSizeName());
        variant.setPrice(request.getPrice());

        ProductVariantEntity updated = productVariantRepository.save(variant);

        return ProductVariantResponse.builder()
                .id(updated.getId())
                .sizeName(updated.getSizeName())
                .price(updated.getPrice())
                .productId(updated.getProduct().getId())
                .build();
    }

    public void deleteProductVariant(Long productId, Long variantId){
        ProductEntity product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        ProductVariantEntity variant = productVariantRepository.findById(variantId)
                .orElseThrow(() -> new ProductVariantNotFoundException("Variant not found"));

        productVariantRepository.delete(variant);
    }


}
