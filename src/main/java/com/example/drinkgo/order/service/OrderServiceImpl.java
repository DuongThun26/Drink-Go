package com.example.drinkgo.order.service;

import com.example.drinkgo.authentication.security.AuthenticationFacade;
import com.example.drinkgo.cart.entity.CartEntity;
import com.example.drinkgo.cart.entity.CartItemEntity;
import com.example.drinkgo.cart.repository.CartItemRepository;
import com.example.drinkgo.cart.repository.CartRepository;
import com.example.drinkgo.order.converter.OrderSearchConverter;
import com.example.drinkgo.order.dto.OrderSearch;
import com.example.drinkgo.order.dto.request.OrderRequest;
import com.example.drinkgo.order.dto.response.OrderDetailResponse;
import com.example.drinkgo.order.dto.response.OrderResponse;
import com.example.drinkgo.order.entity.OrderDetailEntity;
import com.example.drinkgo.order.entity.OrderEntity;
import com.example.drinkgo.order.enums.OrderStatus;
import com.example.drinkgo.order.exception.OrderNotFoundException;
import com.example.drinkgo.order.mapper.OrderMapper;
import com.example.drinkgo.order.repository.OrderDetailRepository;
import com.example.drinkgo.order.repository.OrderRepository;
import com.example.drinkgo.product.entity.ProductEntity;
import com.example.drinkgo.product.entity.ProductVariantEntity;
import com.example.drinkgo.product.enums.ProductType;
import com.example.drinkgo.product.exception.ProductVariantNotFoundException;
import com.example.drinkgo.product.repository.ProductRepository;
import com.example.drinkgo.product.repository.ProductVariantRepository;
import com.example.drinkgo.user.entity.UserEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService{
    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;
    private final ProductRepository productRepository;
    private final AuthenticationFacade authenticationFacade;
    private final CartRepository cartRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductVariantRepository productVariantRepository;
    private final OrderSearchConverter orderSearchConverter;


    @Override
    public List<OrderResponse> getOrders(Map<String, Object> orderSearch) {
        OrderSearch orderSearchConver = orderSearchConverter.toOrderSearch(orderSearch);
        List<OrderEntity> orderEntities = orderRepository.findOrders(orderSearchConver);
        return orderMapper.toResponseList(orderEntities);
    }

    // Lấy thông tin chi tiết đơn hàng
    @Override
    public OrderDetailResponse getOrder(Long id) {
        OrderEntity order = orderRepository.findById(id).orElseThrow(() -> new OrderNotFoundException("Order not found"));
        return orderMapper.toOrderDetail(order);
    }

    // Tạo đơn hàng từ cart
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
        else{
            order.setSessionId(cartGuest);
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

    // Xóa đơn hàng
    @Override
    public void deleteOrder(Long id) {

    }


    // Hủy đơn hàng
    @Transactional
    @Override
    public OrderResponse cancelOrder(String cartGuest, Long id) {
        UserEntity user = null;
        OrderEntity order;
        user = authenticationFacade.getCurrentUser();
        if(user != null){
            order = orderRepository.findByUserAndId(user, id);
        }
        else{
            order = orderRepository.findBySessionIdAndId(cartGuest, id);
        }
        OrderStatus orderStatus = order.getStatus();
        if(orderStatus.equals(OrderStatus.CANCELLED)){
            throw new RuntimeException("Order already cancelled");
        }
        else if(orderStatus.equals(OrderStatus.PENDING) || orderStatus.equals(OrderStatus.CONFIRMED)){
            List<OrderDetailEntity> orderDetail = order.getOrderDetails();
            for(OrderDetailEntity item : orderDetail){
                ProductVariantEntity variant = productVariantRepository.findById(item.getProductVariantId()).orElseThrow(() ->
                        new ProductVariantNotFoundException("Product variant not found"));
                ProductEntity product = variant.getProduct();
                if(product.getProductType().equals(ProductType.READY_MADE)){
                    variant.setQuantity(variant.getQuantity() + item.getQuantity());
                    productVariantRepository.save(variant);
                }
            }
            order.setStatus(OrderStatus.CANCELLED);
            orderRepository.save(order);
            return orderMapper.toResponse(order);
        }
        else{
            throw new RuntimeException("Order cannot be cancelled");
        }
    }
}