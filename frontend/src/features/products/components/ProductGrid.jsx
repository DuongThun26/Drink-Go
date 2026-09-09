import React from 'react';
import ProductCard from './ProductCard.jsx';
import './ProductGrid.css';

const ProductGrid = ({ products, loading, error }) => {
  if (loading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  if (!products || products.length === 0) {
    return <div>No products found.</div>;
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
