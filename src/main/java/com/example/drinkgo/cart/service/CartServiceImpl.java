package com.example.drinkgo.cart.service;

import com.example.drinkgo.cart.dto.request.CartItemRequest;
import com.example.drinkgo.cart.dto.response.CartItemResponse;
import com.example.drinkgo.cart.dto.response.CartResponse;
import com.example.drinkgo.cart.entity.CartEntity;
import com.example.drinkgo.cart.entity.CartItemEntity;
import com.example.drinkgo.cart.mapper.CartMapper;
import com.example.drinkgo.cart.repository.CartItemRepository;
import com.example.drinkgo.cart.repository.CartRepository;
import com.example.drinkgo.product.entity.ProductVariantEntity;
import com.example.drinkgo.product.entity.ToppingEntity;
import com.example.drinkgo.product.mapper.ToppingMapper;
import com.example.drinkgo.product.repository.ProductVariantRepository;
import com.example.drinkgo.product.repository.ToppingRepository;
import com.example.drinkgo.user.entity.UserEntity;
import com.example.drinkgo.user.exception.UserNotFoundException;
import com.example.drinkgo.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductVariantRepository productVariantRepository;
    private final UserRepository userRepository;
    private final ToppingRepository toppingRepository;
    private final CartMapper cartMapper;
    private final ToppingMapper toppingMapper;

    // Lấy cart
    @Override
    public CartResponse getCart(String cartGuest, Long userId) {
        CartEntity cartEntity = getCartEntity(cartGuest, userId);
        return mapToCartDto(cartEntity);
    }

    // Thêm item vào cart
    @Override
    public CartResponse addItemToCart(String cartGuest, Long userId, CartItemRequest item) {
        CartEntity cartEntity = getCartEntity(cartGuest, userId);
        Optional<ProductVariantEntity> productVariant = productVariantRepository.findById(item.getProductVariantId());
        List<ToppingEntity> toppings = toppingRepository.findAllById(item.getToppings());
        if (productVariant.isPresent()) {
            Optional<CartItemEntity> existingItem = cartEntity.getCartItems().stream()
                    .filter(cartItem -> cartItem.getProductVariant().getId().equals(item.getProductVariantId()))
                    .findFirst();

            if (existingItem.isPresent()) {
                CartItemEntity cartItem = existingItem.get();
                cartItem.setQuantity(cartItem.getQuantity() + item.getQuantity());
                cartItem.setToppings(toppings);
                cartItemRepository.save(cartItem);
            } else {
                CartItemEntity cartItem = new CartItemEntity();
                cartItem.setCart(cartEntity);
                cartItem.setProductVariant(productVariant.get());
                cartItem.setQuantity(Long.valueOf(item.getQuantity()));
                cartItem.setUnitPrice(productVariant.get().getPrice());
                cartItem.setToppings(toppings);
                cartItemRepository.save(cartItem);
                cartEntity.getCartItems().add(cartItem);
            }
            cartRepository.save(cartEntity);
        }
        return mapToCartDto(cartEntity);
    }

    // Cập nhật số lượng item trong cart
    @Override
    public CartResponse updateCartItem(String cartGuest, Long userId, Long id, CartItemRequest item) {
        CartEntity cartEntity = getCartEntity(cartGuest, userId);
        Optional<CartItemEntity> cartItem = cartItemRepository.findById(id);
        if (cartItem.isPresent() && cartItem.get().getCart().getId().equals(cartEntity.getId())) {
            cartItem.get().setQuantity(Long.valueOf(item.getQuantity()));
            cartItemRepository.save(cartItem.get());
        }
        return mapToCartDto(cartEntity);
    }


    // Xóa sản phẩm trong cart
    @Override
    public void deleteCartItem(String cartGuest, Long userId, Long id) {
        CartEntity cartEntity = getCartEntity(cartGuest, userId);
        Optional<CartItemEntity> cartItem = cartItemRepository.findById(id);
        if (cartItem.isPresent() && cartItem.get().getCart().getId().equals(cartEntity.getId())) {
            cartItemRepository.deleteById(id);
        }
    }

    // Xóa cart
    @Override
    public void clearCart(String cartGuest, Long userId) {
        CartEntity cartEntity = getCartEntity(cartGuest, userId);
        cartItemRepository.deleteAll(cartEntity.getCartItems());
    }

    // Merge cart
    @Override
    public void mergeCarts(String cartGuest, Long userId) {
        Optional<CartEntity> guestCartOpt = cartRepository.findBySessionId(cartGuest);
        if (guestCartOpt.isPresent()) {
            CartEntity guestCart = guestCartOpt.get();
            CartEntity userCart = getCartEntity(null, userId);

            for (CartItemEntity guestItem : guestCart.getCartItems()) {
                Optional<CartItemEntity> existingItem = userCart.getCartItems().stream()
                        .filter(cartItem -> cartItem.getProductVariant().getId().equals(guestItem.getProductVariant().getId()))
                        .findFirst();

                if (existingItem.isPresent()) {
                    CartItemEntity userItem = existingItem.get();
                    userItem.setQuantity(userItem.getQuantity() + guestItem.getQuantity());
                    cartItemRepository.save(userItem);
                } else {
                    guestItem.setCart(userCart);
                    cartItemRepository.save(guestItem);
                }
            }
            cartRepository.delete(guestCart);
        }
    }

    // Lấy cart
    private CartEntity getCartEntity(String cartGuest, Long userId) {
        if (userId != null) {
            UserEntity user = userRepository.findById(userId)
                    .orElseThrow(() -> new UserNotFoundException("User with ID " + userId + " not found."));

            return cartRepository.findByUserId(userId).orElseGet(() -> {
                CartEntity newCart = new CartEntity();
                newCart.setUser(user);
                return cartRepository.save(newCart);
            });
        }

        if (cartGuest != null && !cartGuest.isEmpty()) {
            return cartRepository.findBySessionId(cartGuest).orElseGet(() -> {
                CartEntity newCart = new CartEntity();
                newCart.setSessionId(cartGuest);
                return cartRepository.save(newCart);
            });
        }

        throw new IllegalArgumentException("Cannot get cart. Both userId and cartGuest are null.");
    }

    private CartResponse mapToCartDto(CartEntity cartEntity) {
        CartResponse cartDto = new CartResponse();
        if (cartEntity != null) {
            List<CartItemResponse> cartItemResponses = cartEntity.getCartItems().stream().map(this::mapToCartItemDto).collect(Collectors.toList());
            cartDto.setItems(cartItemResponses);
            cartDto.setTotalPrice(cartItemResponses.stream().mapToLong(CartItemResponse::getTotalPrice).sum());
        }
        return cartDto;
    }

    private CartItemResponse mapToCartItemDto(CartItemEntity cartItemEntity) {
        CartItemResponse cartItemResponse = cartMapper.toCartItemResponse(cartItemEntity);
        List<ToppingEntity> toppings = cartItemEntity.getToppings();
        Long toppingPrices = toppings.stream().mapToLong(topping -> topping.getPrice()).sum();
        cartItemResponse.setTotalPrice(cartItemEntity.getUnitPrice() * cartItemEntity.getQuantity() + toppingPrices);
        return cartItemResponse;
    }

}