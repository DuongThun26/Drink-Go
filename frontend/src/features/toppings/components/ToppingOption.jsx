import React from 'react';
import './ToppingOption.css';

const ToppingOption = ({ topping, isSelected, onSelect }) => {
  return (
    <div 
      className={`topping-option ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(topping.id)}
    >
      <span className="topping-name">{topping.name}</span>
      <span className="topping-price">+${topping.price.toFixed(2)}</span>
    </div>
  );
};

export default ToppingOption;
