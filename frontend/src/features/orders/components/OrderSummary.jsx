import React from 'react';
import './OrderSummary.css';

const OrderSummary = ({ cart, shippingCost = 5.00 }) => {
  const { totalPrice, discountAmount, finalAmount } = cart;
  const totalWithShipping = finalAmount + shippingCost;

  return (
    <div className="order-summary">
      <h4>Review Your Order</h4>
      <div className="summary-details">
        <div className="summary-line">
          <span>Subtotal:</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
        {discountAmount > 0 && (
          <div className="summary-line discount">
            <span>Discount:</span>
            <span>-${discountAmount.toFixed(2)}</span>
          </div>
        )}
        <div className="summary-line">
          <span>Shipping:</span>
          <span>${shippingCost.toFixed(2)}</span>
        </div>
        <div className="summary-line total">
          <span>Total:</span>
          <span>${totalWithShipping.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
