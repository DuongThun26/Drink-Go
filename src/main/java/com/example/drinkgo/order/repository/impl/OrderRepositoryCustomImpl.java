package com.example.drinkgo.order.repository.impl;

import com.example.drinkgo.order.dto.OrderSearch;
import com.example.drinkgo.order.entity.OrderEntity;
import com.example.drinkgo.order.repository.OrderRepositoryCustom;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;

import java.util.List;

public class OrderRepositoryCustomImpl implements OrderRepositoryCustom {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<OrderEntity> findOrders(OrderSearch orderSearch) {
        StringBuilder sql = new StringBuilder("SELECT * FROM orders o ");
        StringBuilder where = new StringBuilder(" WHERE 1 = 1 ");
        queryNormal(orderSearch, where);
        querySpecial(orderSearch, where);
        sql.append(where);
        Query query = entityManager.createNativeQuery(sql.toString(), OrderEntity.class);
        setParameter(query, orderSearch);
        return query.getResultList();
    }

    private void querySpecial(OrderSearch orderSearch, StringBuilder where) {
        if(orderSearch.getFromDate() != null && orderSearch.getToDate() != null){
            where.append(" AND o.created_at BETWEEN :fromDate AND :toDate ");
        }
        else if(orderSearch.getFromDate() != null){
            where.append(" AND o.created_at >= :fromDate ");
        }
        else if(orderSearch.getToDate() != null){
            where.append(" AND o.created_at <= :toDate ");
        }
    }

    private void queryNormal(OrderSearch orderSearch, StringBuilder where) {
        if(orderSearch.getOrderStatus() != null){
            where.append(" AND o.status = :status ");
        }
        if(orderSearch.getReceiveName() != null){
            where.append(" AND o.receivename LIKE :receiveName ");
        }
        if(orderSearch.getReceivePhone() != null){
            where.append(" AND o.receivephone = :receivePhone ");
        }
    }

    private void setParameter(Query query, OrderSearch orderSearch){
        if(orderSearch.getOrderStatus() != null){
            query.setParameter(
                    "status", orderSearch.getOrderStatus().name()
            );
        }
        if(orderSearch.getReceiveName() != null){
            query.setParameter(
                    "receiveName", "%" + orderSearch.getReceiveName() + "%"
            );
        }
        if(orderSearch.getReceivePhone() != null){
            query.setParameter(
                    "receivePhone", orderSearch.getReceivePhone()
            );
        }
        if(orderSearch.getFromDate() != null
                && orderSearch.getToDate() != null){

            query.setParameter(
                    "fromDate",
                    orderSearch.getFromDate().atStartOfDay()
            );

            query.setParameter(
                    "toDate",
                    orderSearch.getToDate().atTime(23,59,59)
            );
        }
        else if(orderSearch.getFromDate() != null){

            query.setParameter(
                    "fromDate",
                    orderSearch.getFromDate().atStartOfDay()
            );
        }
        else if(orderSearch.getToDate() != null){

            query.setParameter(
                    "toDate",
                    orderSearch.getToDate().atTime(23,59,59)
            );
        }
    }
}

