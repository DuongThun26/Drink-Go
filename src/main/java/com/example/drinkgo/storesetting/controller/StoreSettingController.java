package com.example.drinkgo.storesetting.controller;

import com.example.drinkgo.storesetting.dto.request.StoreScheduleRequest;
import com.example.drinkgo.storesetting.dto.request.StoreSettingRequest;
import com.example.drinkgo.storesetting.dto.response.StoreScheduleResponse;
import com.example.drinkgo.storesetting.dto.response.StoreSettingResponse;
import com.example.drinkgo.storesetting.service.StoreSettingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class StoreSettingController {
    private final StoreSettingService storeSettingService;

    @GetMapping(value = "/store-settings")
    public StoreSettingResponse getStoreSetting(){
        return storeSettingService.getStoreSetting();
    }

    @PutMapping(value = "/admin/store-settings")
    public StoreSettingResponse update(@Valid  @RequestBody StoreSettingRequest request){
        return storeSettingService.update(request);
    }

    @GetMapping(value = "/store-schedules")
    List<StoreScheduleResponse> getSchedules(){
        return storeSettingService.getSchedules();
    }

    @PostMapping("/admin/store-schedules")
    public StoreScheduleResponse create(@Valid @RequestBody StoreScheduleRequest request){
        return storeSettingService.create(request);
    }

    @PutMapping("/admin/store-schedules/{id}")
    public StoreScheduleResponse update(@PathVariable Long id, @Valid @RequestBody StoreScheduleRequest request){
        return storeSettingService.update(id, request);
    }

    @DeleteMapping("/admin/store-schedules/{id}")
    public void delete(@PathVariable Long id){
        storeSettingService.delete(id);
    }
}
