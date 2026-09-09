import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById } from '../store/productSlice.js';
import { selectSelectedProduct, selectProductLoading, selectProductError } from '../store/productSelectors.js';
import AddToCartButton from '../../cart/components/AddToCartButton.jsx';
import ToppingSelector from '../../toppings/components/ToppingSelector.jsx';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const product = useSelector(selectSelectedProduct);
  const loading = useSelector(selectProductLoading);
  const error = useSelector(selectProductError);

  const [quantity, setQuantity] = useState(1);
  const [selectedToppings, setSelectedToppings] = useState([]);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [dispatch, id]);

  if (loading) {
    return <div className="status-message">Loading product...</div>;
  }

  if (error) {
    return <div className="status-message error">Error: {error}</div>;
  }

  if (!product) {
    return <div className="status-message">Product not found.</div>;
  }

  return (
    <div className="product-detail-page">
      <div className="product-detail-layout">
        <div className="product-image-gallery">
          <img src={product.imageUrl} alt={product.name} />
        </div>
        <div className="product-info-panel">
          <h1>{product.name}</h1>
          <p className="product-description">{product.description}</p>
          <p className="product-price">${product.price.toFixed(2)}</p>
          
          <div className="quantity-selector">
            <label>Quantity:</label>
            <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
            <input type="number" value={quantity} readOnly />
            <button onClick={() => setQuantity(q => q + 1)}>+</button>
          </div>

          <ToppingSelector onSelectionChange={setSelectedToppings} />

          <AddToCartButton 
            productId={product.id} 
            quantity={quantity} 
            options={{ toppings: selectedToppings }} 
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
