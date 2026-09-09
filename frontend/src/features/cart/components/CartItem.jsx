import React from 'react';
import { useDispatch } from 'react-redux';
import { removeFromCart } from '../store/cartSlice.js';
import './CartItem.css';

const CartItem = ({ item }) => {
  const dispatch = useDispatch();

  const handleRemove = () => {
    dispatch(removeFromCart({ itemId: item.id, sessionId: item.sessionId }));
  };

  return (
    <div className="cart-item">
      <img src={item.product.imageUrl} alt={item.product.name} className="cart-item-image" />
      <div className="cart-item-details">
        <span className="cart-item-name">{item.product.name}</span>
        <span className="cart-item-quantity">Quantity: {item.quantity}</span>
      </div>
      <div className="cart-item-actions">
        <span className="cart-item-price">${(item.price * item.quantity).toFixed(2)}</span>
        <button onClick={handleRemove} className="remove-btn">Remove</button>
      </div>
    </div>
  );
};

export default CartItem;
