package com.example.drinkgo.order.converter;

import com.example.drinkgo.order.dto.OrderSearch;
import com.example.drinkgo.order.enums.OrderStatus;
import com.example.drinkgo.util.MapUtil;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Map;

@Component
public class OrderSearchConverter {
    public OrderSearch toOrderSearch(Map<String, Object> orderSearch){
        OrderSearch orderSearchConverter = OrderSearch.builder()
                .orderStatus(MapUtil.convertMap(orderSearch, "orderStatus", OrderStatus.class))
                .receiveName(MapUtil.convertMap(orderSearch, "receiveName", String.class))
                .receivePhone(MapUtil.convertMap(orderSearch, "receivePhone", String.class))
                .paymentMethod(MapUtil.convertMap(orderSearch, "paymentMethod", String.class))
                .fromDate(MapUtil.convertMap(orderSearch, "fromDate", LocalDate.class))
                .toDate(MapUtil.convertMap(orderSearch, "toDate", LocalDate.class))
                .build();
        return orderSearchConverter;
    }
}
