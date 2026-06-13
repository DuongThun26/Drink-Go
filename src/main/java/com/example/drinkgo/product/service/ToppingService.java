package com.example.drinkgo.product.service;

import com.example.drinkgo.product.dto.request.ToppingRequest;
import com.example.drinkgo.product.dto.response.ToppingResponse;
import com.example.drinkgo.product.entity.ToppingEntity;
import com.example.drinkgo.product.exception.ToppingNotFoundException;
import com.example.drinkgo.product.mapper.ToppingMapper;
import com.example.drinkgo.product.repository.ToppingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ToppingService {
    private final ToppingRepository toppingRepository;
    private final ToppingMapper toppingMapper;

    public List<ToppingResponse> getAllToppings(){
        return toppingMapper.toListResponse(toppingRepository.findAll());
    }
    public ToppingResponse createTopping(ToppingRequest request){
        ToppingEntity topping = toppingMapper.toEntity(request);
        toppingRepository.save(topping);
        return toppingMapper.toResponse(topping);
    }
    public ToppingResponse updateTopping(Long id, ToppingRequest request){
        ToppingEntity topping = toppingRepository.findById(id).orElseThrow(() -> new ToppingNotFoundException("Topping not found!"));
        toppingMapper.updateEntity(request, topping);
        toppingRepository.save(topping);
        return toppingMapper.toResponse(topping);
    }
    public void deleteTopping(Long id){
        ToppingEntity topping = toppingRepository.findById(id).orElseThrow(() -> new ToppingNotFoundException("Topping not found!"));
        toppingRepository.delete(topping);
    }
}
