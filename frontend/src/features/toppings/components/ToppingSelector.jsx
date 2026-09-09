import React, { useState } from 'react';
import { useToppings } from '../hooks/useToppings.js';
import ToppingOption from './ToppingOption.jsx';
import './ToppingSelector.css';

const ToppingSelector = ({ onSelectionChange }) => {
  const { toppings, loading, error } = useToppings();
  const [selectedToppings, setSelectedToppings] = useState([]);

  const handleSelect = (toppingId) => {
    const newSelection = selectedToppings.includes(toppingId)
      ? selectedToppings.filter(id => id !== toppingId)
      : [...selectedToppings, toppingId];
    
    setSelectedToppings(newSelection);
    onSelectionChange(newSelection);
  };

  if (loading) return <p>Loading toppings...</p>;
  if (error) return <p className="error-message">Could not load toppings.</p>;

  return (
    <div className="topping-selector">
      <h4>Add Toppings</h4>
      {toppings.map(topping => (
        <ToppingOption 
          key={topping.id}
          topping={topping}
          isSelected={selectedToppings.includes(topping.id)}
          onSelect={handleSelect}
        />
      ))}
    </div>
  );
};

export default ToppingSelector;
