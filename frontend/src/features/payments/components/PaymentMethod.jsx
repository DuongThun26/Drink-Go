import React from 'react';
import './PaymentMethod.css';

const PaymentMethod = ({ method, isSelected, onSelect }) => {
  // The 'method' object would contain details like card brand, last4, etc.
  const { brand, last4 } = method;

  return (
    <div 
      className={`payment-method ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(method.id)}
    >
      <div className="card-brand-icon">{brand}</div>
      <div className="card-details">
        <span>**** **** **** {last4}</span>
      </div>
    </div>
  );
};

export default PaymentMethod;
