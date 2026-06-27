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
import com.example.drinkgo.order.entity.OrderDetailToppingEntity;
import com.example.drinkgo.order.entity.OrderEntity;
import com.example.drinkgo.order.enums.OrderStatus;
import com.example.drinkgo.order.exception.OrderNotFoundException;
import com.example.drinkgo.order.mapper.OrderMapper;
import com.example.drinkgo.order.repository.OrderDetailRepository;
import com.example.drinkgo.order.repository.OrderDetailToppingRepository;
import com.example.drinkgo.order.repository.OrderRepository;
import com.example.drinkgo.product.entity.ProductEntity;
import com.example.drinkgo.product.entity.ProductVariantEntity;
import com.example.drinkgo.product.entity.ToppingEntity;
import com.example.drinkgo.product.enums.ProductType;
import com.example.drinkgo.product.exception.ProductVariantNotFoundException;
import com.example.drinkgo.product.repository.ProductRepository;
import com.example.drinkgo.product.repository.ProductVariantRepository;
import com.example.drinkgo.user.entity.UserEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
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
    private final OrderDetailToppingRepository orderDetailToppingRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductVariantRepository productVariantRepository;
    private final OrderSearchConverter orderSearchConverter;


    @Override
    public List<OrderResponse> getOrders(Map<String, Object> orderSearch, String cartGuest) {
        OrderSearch search = orderSearchConverter.toOrderSearch(orderSearch);
        applyPermissionScope(search, cartGuest);
        List<OrderEntity> orderEntities = orderRepository.findOrders(search);
        return orderMapper.toResponseList(orderEntities);
    }

    // Thêm điều kiện lọc theo vai trò
    private void applyPermissionScope(OrderSearch search, String cartGuest) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean authenticated = auth != null
                && auth.isAuthenticated()
                && !"anonymousUser".equals(auth.getPrincipal());

        if (authenticated) {
            boolean isAdmin = auth.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .anyMatch("ROLE_ADMIN"::equals);
            if (isAdmin) {
                return;
            }
            UserEntity user = authenticationFacade.getCurrentUser();
            search.setUserId(user.getId());
            search.setSessionId(null);
            return;
        }
        search.setUserId(null);
        search.setSessionId(cartGuest);
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
        user = authenticationFacade.getCurrentUser();
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

        // Tạo order entity
        OrderEntity order = orderMapper.toEntity(orderRequest);
        if (user != null) {
            order.setUser(user);
        } else {
            order.setSessionId(cartGuest);
        }
        // Sinh order code
        String orderCode = "ORD-" + System.currentTimeMillis();
        order.setCode(orderCode);
        orderRepository.save(order);

        // Xử lý order details và toppings
        Long totalAmount = 0L;

        for (CartItemEntity cartItem : cartItems) {
            Long productPrice = cartItem.getUnitPrice() * cartItem.getQuantity();
            Long toppingTotalCost = 0L;

            // Tạo order detail
            OrderDetailEntity orderDetail = OrderDetailEntity.builder()
                    .quantity(cartItem.getQuantity())
                    .unitPrice(cartItem.getUnitPrice())
                    .sizeName(cartItem.getProductVariant().getSizeName())
                    .productName(cartItem.getProductVariant().getProduct().getName())
                    .productVariantId(cartItem.getProductVariant().getId())
                    .order(order)
                    .build();
            orderDetailRepository.save(orderDetail);

            // Tạo order detail topping
            if (cartItem.getToppings() != null && !cartItem.getToppings().isEmpty()) {
                List<OrderDetailToppingEntity> orderDetailToppings = new java.util.ArrayList<>();

                for (ToppingEntity topping : cartItem.getToppings()) {
                    // Lấy tên và giá topping tại lúc xét
                    OrderDetailToppingEntity orderDetailTopping = OrderDetailToppingEntity.builder()
                            .toppingName(topping.getName())           // Snapshot name
                            .toppingPrice(topping.getPrice())         // Snapshot price
                            .quantity(1L)                             // Qty 1 for each topping
                            .orderDetail(orderDetail)
                            .topping(topping)                         // Reference for audit
                            .build();

                    orderDetailToppingRepository.save(orderDetailTopping);
                    orderDetailToppings.add(orderDetailTopping);

                    // Tính tổng giá topping
                    toppingTotalCost += topping.getPrice();
                }
                orderDetail.setOrderDetailToppings(orderDetailToppings);
            }

            // Tính total price
            Long detailTotalPrice = productPrice + toppingTotalCost;
            orderDetail.setTotalPrice(detailTotalPrice);
            orderDetailRepository.save(orderDetail);

            totalAmount += detailTotalPrice;
        }

        order.setPaymentMethod(orderRequest.getPaymentMethod());
        order.setTotalAmount(totalAmount);
        order.setDiscountAmount(0L);
        order.setFinalAmount(totalAmount);
        order.setStatus(OrderStatus.PENDING);
        orderRepository.save(order);

        // Xóa đơn hàng khỏi cart
        cartItemRepository.deleteAll(cartItems);
        return orderMapper.toResponse(order);
    }



    // Hủy đơn hàng
    @Transactional
    @Override
    public OrderResponse cancelOrder(String cartGuest, Long id) {
        OrderEntity order = getAccessibleOrder(cartGuest, id);
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

    // Xác nhận đơn hàng
    @Override
    public OrderResponse confirmOrder(String sessionId, Long id) {
        OrderEntity order = getAccessibleOrder(sessionId, id);
        if(order.getStatus().equals(OrderStatus.PENDING)){
            order.setStatus(OrderStatus.CONFIRMED);
            orderRepository.save(order);
            return orderMapper.toResponse(order);
        }
        else{
            throw new RuntimeException("The order has been confirmed or canceled!");
        }

    }

    // Chuẩn bị đơn hàng
    @Override
    public OrderResponse preparingOrder(String sessionId, Long id) {
        OrderEntity order = getAccessibleOrder(sessionId, id);
        if(order.getStatus().equals(OrderStatus.CONFIRMED)){
            order.setStatus(OrderStatus.PREPARING);
            orderRepository.save(order);
            return orderMapper.toResponse(order);
        }
        else{
            throw new RuntimeException("The order has been preparing or canceled!");
        }
    }

    // Đang ship
    @Override
    public OrderResponse shippingOrder(String sessionId, Long id) {
        OrderEntity order = getAccessibleOrder(sessionId, id);
        if(order.getStatus().equals(OrderStatus.PREPARING)){
            order.setStatus(OrderStatus.SHIPPING);
            orderRepository.save(order);
            return orderMapper.toResponse(order);
        }
        else{
            throw new RuntimeException("The order has been shipping or canceled!");
        }
    }

    // Giao hàng
    @Override
    public OrderResponse deliveredOrder(String sessionId, Long id) {
        OrderEntity order = getAccessibleOrder(sessionId, id);
        if(order.getStatus().equals(OrderStatus.SHIPPING)){
            order.setStatus(OrderStatus.DELIVERED);
            orderRepository.save(order);
            return orderMapper.toResponse(order);
        }
        else{
            throw new RuntimeException("The order has been delivered or canceled!");
        }
    }

    // Hoàn thành đơn hàng
    @Override
    public OrderResponse completedOrder(String sessionId, Long id) {
        OrderEntity order = getAccessibleOrder(sessionId, id);
        if(order.getStatus().equals(OrderStatus.DELIVERED)){
            order.setStatus(OrderStatus.COMPLETED);
            orderRepository.save(order);
            return orderMapper.toResponse(order);
        }
        else{
            throw new RuntimeException("The order has been canceled!");
        }
    }

    // Lấy order
    private OrderEntity getAccessibleOrder(String cartGuest, Long id){
        OrderEntity order = null;
        UserEntity user = authenticationFacade.getCurrentUser();
        if(user != null){
            order = orderRepository.findByUserAndId(user, id);
        }
        else{
            order = orderRepository.findBySessionIdAndId(cartGuest, id);
        }
        if(order == null){
            throw new OrderNotFoundException("Order not found or you don't have permission to access it");
        }
        return order;
    }
}