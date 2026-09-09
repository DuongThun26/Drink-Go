import React from 'react';
import { useCart } from '../hooks/useCart.js';
import './CartSummary.css';

const CartSummary = () => {
  const { totalPrice, finalAmount, discountAmount } = useCart();

  return (
    <div className="cart-summary">
      <h3>Order Summary</h3>
      <div className="summary-row">
        <span>Subtotal</span>
        <span>${totalPrice.toFixed(2)}</span>
      </div>
      {discountAmount > 0 && (
        <div className="summary-row discount">
          <span>Discount</span>
          <span>-${discountAmount.toFixed(2)}</span>
        </div>
      )}
      <div className="summary-row total">
        <span>Total</span>
        <span>${finalAmount.toFixed(2)}</span>
      </div>
      <button className="checkout-btn">Proceed to Checkout</button>
    </div>
  );
};

export default CartSummary;
