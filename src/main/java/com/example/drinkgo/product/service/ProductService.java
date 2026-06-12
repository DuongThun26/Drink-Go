package com.example.drinkgo.product.service;

import com.example.drinkgo.category.entity.CategoryEntity;
import com.example.drinkgo.category.repository.CategoryRepository;
import com.example.drinkgo.product.dto.request.ProductRequest;
import com.example.drinkgo.product.dto.response.ProductResponse;
import com.example.drinkgo.product.entity.ProductEntity;
import com.example.drinkgo.product.exception.ProductNotFoundException;
import com.example.drinkgo.product.exception.ToppingNotFoundException;
import com.example.drinkgo.product.repository.ProductRepository;
import com.example.drinkgo.product.repository.ProductVariantRepository;
import com.example.drinkgo.product.exception.ProductHasVariantsException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ModelMapper modelMapper;
    private final ProductVariantRepository productVariantRepository;

    public List<ProductResponse> getAllProducts(){
        return productRepository.findAll().stream()
                .map(productEntity -> modelMapper.map(productEntity, ProductResponse.class))
                .collect(Collectors.toList());
    }

    public ProductResponse createProduct(ProductRequest request){
        CategoryEntity category = categoryRepository.findById(request.getCategoryId()).orElseThrow(() -> new ToppingNotFoundException("Category does not exits"));
        ProductEntity product = ProductEntity.builder()
                .name(request.getName())
                .images(request.getImages())
                .description(request.getDescription())
                .productType(request.getProductType())
                .category(category)
                .build();
        productRepository.save(product);
        return modelMapper.map(product, ProductResponse.class);
    }

    public ProductResponse updateProduct(Long id, ProductRequest request){
        ProductEntity product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Product not found with id: " + id));

        CategoryEntity category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ToppingNotFoundException("Category does not exist"));

        product.setName(request.getName());
        product.setImages(request.getImages());
        product.setDescription(request.getDescription());
        product.setProductType(request.getProductType());
        product.setCategory(category);

        ProductEntity updated = productRepository.save(product);
        return modelMapper.map(updated, ProductResponse.class);
    }

    public void deleteProduct(Long id){
        ProductEntity product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Product not found with id: " + id));
        if (productVariantRepository.existsByProductId(id)){
            throw new ProductHasVariantsException("Cannot delete product with id " + id + " because it has associated variants.");
        }

        productRepository.delete(product);
    }

}
