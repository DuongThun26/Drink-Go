package com.example.drinkgo.storesetting.service;

import com.example.drinkgo.storesetting.dto.request.StoreScheduleRequest;
import com.example.drinkgo.storesetting.dto.request.StoreSettingRequest;
import com.example.drinkgo.storesetting.dto.response.StoreScheduleResponse;
import com.example.drinkgo.storesetting.dto.response.StoreSettingResponse;
import com.example.drinkgo.storesetting.entity.StoreScheduleEntity;
import com.example.drinkgo.storesetting.entity.StoreSettingEntity;
import com.example.drinkgo.storesetting.mapper.StoreScheduleMapper;
import com.example.drinkgo.storesetting.mapper.StoreSettingMapper;
import com.example.drinkgo.storesetting.repository.StoreScheduleRepository;
import com.example.drinkgo.storesetting.repository.StoreSettingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StoreSettingService {
    private final StoreSettingRepository storeSettingRepository;
    private final StoreSettingMapper storeSettingMapper;
    private final StoreScheduleRepository storeScheduleRepository;
    private final StoreScheduleMapper storeScheduleMapper;

    public StoreSettingResponse getStoreSetting(){
        return storeSettingMapper.toResponse(storeSettingRepository.findById(1L).orElseThrow(() -> new RuntimeException("Not found")));
    }

    public StoreSettingResponse update(StoreSettingRequest request){
        StoreSettingEntity storeSetting = storeSettingRepository.findById(1L).orElseThrow(() -> new RuntimeException("not found"));
        storeSettingMapper.updateEntity(request, storeSetting);
        storeSettingRepository.save(storeSetting);
        return storeSettingMapper.toResponse(storeSetting);
    }
    public List<StoreScheduleResponse> getSchedules(){
        return storeScheduleMapper.toListResponse(storeScheduleRepository.findAll());
    }
    public StoreScheduleResponse create(StoreScheduleRequest request){
        StoreScheduleEntity schedule = storeScheduleMapper.toEntity(request);
        storeScheduleRepository.save(schedule);
        return storeScheduleMapper.toResponse(schedule);
    }
    public StoreScheduleResponse update(Long id, StoreScheduleRequest request){
        StoreScheduleEntity schedule = storeScheduleRepository.findById(id).orElseThrow(() -> new RuntimeException("Schedule does not exists"));
        storeScheduleMapper.updateEntity(request, schedule);
        storeScheduleRepository.save(schedule);
        return storeScheduleMapper.toResponse(schedule);
    }
    public void delete(Long id){
        StoreScheduleEntity schedule = storeScheduleRepository.findById(id).orElseThrow(() -> new RuntimeException("Schedule does not exists"));
        storeScheduleRepository.delete(schedule);
    }

    // Dùng khi order
    public boolean isStoreAvailble(){
        StoreSettingEntity storeSetting = storeSettingRepository.findById(1L).orElseThrow(() -> new RuntimeException("Not found"));
        if(!storeSetting.getIsOpen()){
            return false;
        }
        DayOfWeek today = LocalDate.now().getDayOfWeek();
        StoreScheduleEntity schedule = storeScheduleRepository.findByDayOfWeek(today);
        LocalTime now = LocalTime.now();
        return !now.isBefore(schedule.getOpenTime())
                && !now.isAfter(schedule.getCloseTime());
    }
}
