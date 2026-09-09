import React from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice.js';

const AddToCartButton = ({ productId, quantity, options }) => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart({ productId, quantity, options }));
  };

  return (
    <button onClick={handleAddToCart} className="add-to-cart-btn">
      Add to Cart
    </button>
  );
};

export default AddToCartButton;
