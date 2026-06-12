package com.example.drinkgo.product.service;

import com.example.drinkgo.product.dto.request.ToppingRequest;
import com.example.drinkgo.product.dto.response.ToppingResponse;
import com.example.drinkgo.product.entity.ToppingEntity;
import com.example.drinkgo.product.exception.ToppingNotFoundException;
import com.example.drinkgo.product.repository.ToppingRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ToppingService {
    private final ToppingRepository toppingRepository;
    private final ModelMapper modelMapper;

    public List<ToppingResponse> getAllToppings(){
        List<ToppingEntity> toppingEntities = toppingRepository.findAll();
        return toppingEntities.stream().map(
                toppingEntity -> modelMapper.map(toppingEntity, ToppingResponse.class)).collect(Collectors.toList());

    }
    public ToppingResponse createTopping(ToppingRequest request){
        ToppingEntity topping = ToppingEntity.builder()
                .name(request.getName())
                .price(request.getPrice())
                .status(request.getStatus())
                .build();
        toppingRepository.save(topping);
        return modelMapper.map(topping, ToppingResponse.class);
    }
    public ToppingResponse updateTopping(Long id, ToppingRequest request){
        ToppingEntity topping = toppingRepository.findById(id).orElseThrow(() -> new ToppingNotFoundException("Topping not found!"));
        topping.setName(request.getName());
        topping.setPrice(request.getPrice());
        topping.setStatus(request.getStatus());
        toppingRepository.save(topping);
        return modelMapper.map(topping, ToppingResponse.class);
    }
    public void deleteTopping(Long id){
        ToppingEntity topping = toppingRepository.findById(id).orElseThrow(() -> new ToppingNotFoundException("Topping not found!"));
        toppingRepository.delete(topping);
    }
}
