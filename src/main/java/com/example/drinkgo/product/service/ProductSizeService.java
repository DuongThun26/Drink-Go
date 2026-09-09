package com.example.drinkgo.product.service;

import com.example.drinkgo.product.dto.request.ProductSizeRequest;
import com.example.drinkgo.product.dto.response.ProductSizeResponse;
import com.example.drinkgo.product.entity.ProductSize;
import com.example.drinkgo.product.exception.ProductNotFoundException;
import com.example.drinkgo.product.mapper.ProductSizeMapper;
import com.example.drinkgo.product.repository.ProductSizeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductSizeService {
    private final ProductSizeRepository productSizeRepository;
    private final ProductSizeMapper productSizeMapper;

    @Transactional(readOnly = true)
    public List<ProductSizeResponse> getAllSizes() {
        return productSizeMapper.toListResponse(productSizeRepository.findAll());
    }

    @Transactional(readOnly = true)
    public ProductSizeResponse getSizeById(Long id) {
        ProductSize size = productSizeRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Size not found with id: " + id));
        return productSizeMapper.toResponse(size);
    }

    public ProductSizeResponse createSize(ProductSizeRequest request) {
        ProductSize size = productSizeMapper.toEntity(request);
        ProductSize saved = productSizeRepository.save(size);
        return productSizeMapper.toResponse(saved);
    }

    public ProductSizeResponse updateSize(Long id, ProductSizeRequest request) {
        ProductSize size = productSizeRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Size not found with id: " + id));
        productSizeMapper.updateEntity(request, size);
        ProductSize updated = productSizeRepository.save(size);
        return productSizeMapper.toResponse(updated);
    }

    public void deleteSize(Long id) {
        ProductSize size = productSizeRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Size not found with id: " + id));
        productSizeRepository.delete(size);
    }
}
