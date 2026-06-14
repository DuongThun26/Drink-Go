package com.example.drinkgo.product.service;

import com.example.drinkgo.category.entity.CategoryEntity;
import com.example.drinkgo.category.exception.CategoryNotFoundException;
import com.example.drinkgo.category.repository.CategoryRepository;
import com.example.drinkgo.product.dto.request.ProductRequest;
import com.example.drinkgo.product.dto.response.ProductDetailResponse;
import com.example.drinkgo.product.dto.response.ProductResponse;
import com.example.drinkgo.product.entity.ProductEntity;
import com.example.drinkgo.product.exception.ProductHasVariantsException;
import com.example.drinkgo.product.exception.ProductNotFoundException;
import com.example.drinkgo.product.exception.ToppingNotFoundException;
import com.example.drinkgo.product.mapper.ProductMapper;
import com.example.drinkgo.product.repository.ProductRepository;
import com.example.drinkgo.product.repository.ProductVariantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductMapper productMapper;
    private final ProductVariantRepository productVariantRepository;

    public List<ProductResponse> getAllProducts(){
        List<ProductEntity> product = productRepository.findAll();
        return productMapper.toListProduct(product);
    }

    @Transactional(readOnly = true)
    public ProductDetailResponse getProductById(Long id){
        ProductEntity product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Product not found with id: " + id));
        return productMapper.toDetailResponse(product);
    }

    public ProductResponse createProduct(ProductRequest request){
        if(request.getCategoryId() == null){
            throw new IllegalArgumentException("Category Id is required");
        }
        if(!categoryRepository.existsById(request.getCategoryId())){
            throw new CategoryNotFoundException("Category does not exists");
        }
        ProductEntity product = productMapper.toEntity(request);
        productRepository.save(product);
        return productMapper.toResponse(product);
    }

    public ProductResponse updateProduct(Long id, ProductRequest request){
        ProductEntity product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Product not found with id: " + id));

        CategoryEntity category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ToppingNotFoundException("Category does not exist"));

        productMapper.updateEntity(request, product);
        product.setCategory(category);
        ProductEntity updated = productRepository.save(product);
        return productMapper.toResponse(updated);
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
