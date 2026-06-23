package com.example.drinkgo.order.service;

import com.example.drinkgo.authentication.security.AuthenticationFacade;
import com.example.drinkgo.cart.entity.CartEntity;
import com.example.drinkgo.cart.entity.CartItemEntity;
import com.example.drinkgo.cart.repository.CartItemRepository;
import com.example.drinkgo.cart.repository.CartRepository;
import com.example.drinkgo.order.dto.request.OrderRequest;
import com.example.drinkgo.order.dto.response.OrderDetailResponse;
import com.example.drinkgo.order.dto.response.OrderToppingResponse;
import com.example.drinkgo.order.dto.response.OrderItemResponse;
import com.example.drinkgo.order.dto.response.OrderResponse;
import com.example.drinkgo.order.entity.OrderDetailEntity;
import com.example.drinkgo.order.entity.OrderDetailToppingEntity;
import com.example.drinkgo.order.entity.OrderEntity;
import com.example.drinkgo.order.exception.OrderNotFoundException;
import com.example.drinkgo.order.mapper.OrderMapper;
import com.example.drinkgo.order.repository.OrderDetailRepository;
import com.example.drinkgo.order.repository.OrderRepository;
import com.example.drinkgo.user.entity.UserEntity;
import com.example.drinkgo.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService{
    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;
    private final UserRepository userRepository;
    private final OrderDetailService orderDetailService;
    private final AuthenticationFacade authenticationFacade;
    private final CartRepository cartRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final CartItemRepository cartItemRepository;

    @Override
    public Page<OrderResponse> getOrders(Pageable pageable) {
        Page<OrderEntity> orderEntities = orderRepository.findAll(pageable);
        return orderEntities.map(orderMapper::toResponse);
    }

    @Override
    public OrderDetailResponse getOrder(Long id) {
        OrderEntity order = orderRepository.findById(id).orElseThrow(() -> new OrderNotFoundException("Order not found"));
        OrderDetailResponse orderDetailResponse = OrderDetailResponse.builder()
                .id(order.getId())
                .code(order.getCode())
                .orderStatus(order.getStatus())
                .finalAmount(order.getFinalAmount())
                .receiveName(order.getReceivename())
                .build();
        List<OrderDetailEntity> orderDetails = order.getOrderDetails();
        List<OrderItemResponse> orderItems = new ArrayList<>();
        for(OrderDetailEntity item : orderDetails){
            List<OrderDetailToppingEntity> toppings = item.getOrderDetailToppings();
            List<OrderToppingResponse> toppingResponses = new ArrayList<>();
            for(OrderDetailToppingEntity topping : toppings){
                toppingResponses.add(OrderToppingResponse.builder()
                                .toppingName(topping.getToppingName())
                                .toppingPrice(topping.getToppingPrice())
                                .quantity(topping.getQuantity())
                                .build());
            }
            OrderItemResponse orderItem = OrderItemResponse.builder()
                    .productName(item.getProductName())
                    .sizeName(item.getSizeName())
                    .quantity(item.getQuantity())
                    .unitPrice(item.getUnitPrice())
                    .toppings(toppingResponses)
                    .build();
            orderItems.add(orderItem);
        }
        orderDetailResponse.setOrderItems(orderItems);
        return orderDetailResponse;
    }

    @Override
    @Transactional
    public OrderResponse createOrder(OrderRequest orderRequest, String cartGuest) {
        CartEntity cart;
        UserEntity user = null;
        try {
            user = authenticationFacade.getCurrentUser();
        } catch (Exception e) {

        }
        if (user != null) {
            cart = cartRepository.findByUserId(user.getId())
                    .orElseThrow(() -> new OrderNotFoundException("Cart not found for user"));
        } else if (cartGuest != null && !cartGuest.isEmpty()) {
            cart = cartRepository.findBySessionId(cartGuest)
                    .orElseThrow(() -> new OrderNotFoundException("Cart not found for guest"));
        } else {
            throw new OrderNotFoundException("Cannot create order without a cart");
        }
        List<CartItemEntity> cartItems = cart.getCartItems();
        OrderEntity order = orderMapper.toEntity(orderRequest);
        if (user != null) {
            order.setUser(user);
        }
        orderRepository.save(order);
        Long totalAmount = 0L;
        for(CartItemEntity item : cartItems){
            Long price = item.getUnitPrice();
            Long quantity = item.getQuantity();
            totalAmount += price * quantity;
            OrderDetailEntity orderDetail = OrderDetailEntity.builder()
                    .quantity(quantity)
                    .unitPrice(item.getUnitPrice())
                    .sizeName(item.getProductVariant().getSizeName())
                    .productName(item.getProductVariant().getProduct().getName())
                    .productVariantId(item.getProductVariant().getId())
                    .order(order)
                    .build();
            orderDetailRepository.save(orderDetail);
        }
        order.setPaymentMethod(orderRequest.getPaymentMethod());
        order.setTotalAmount(totalAmount);
        order.setFinalAmount(totalAmount);
        orderRepository.save(order);
        cartItemRepository.deleteAll(cartItems);
        return orderMapper.toResponse(order);
    }

    @Override
    public void deleteOrder(Long id) {

    }
}