/**
 * Product Card Component
 * Display single product in grid
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button.jsx';
import { currencyFormatter } from '../../../utils/formatting/formatters.js';
import './ProductCard.css';

export default function ProductCard({ product, onAddToCart }) {
  const navigate = useNavigate();
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      if (onAddToCart) {
        await onAddToCart(product);
      }
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleProductClick = () => {
    navigate(`/products/${product.id}`);
  };

  return (
    <div className="product-card">
      <div className="product-image" onClick={handleProductClick} role="button" tabIndex={0}>
        <img
          src={product.image}
          alt={product.name}
          onError={(e) => {
            e.target.src = '/placeholder-product.png';
          }}
        />
        {product.discount && (
          <div className="product-discount">-{product.discount}%</div>
        )}
      </div>

      <div className="product-info">
        <h3 className="product-name" onClick={handleProductClick} role="button" tabIndex={0}>
          {product.name}
        </h3>

        {product.description && (
          <p className="product-description">{product.description.substring(0, 60)}...</p>
        )}

        <div className="product-rating">
          ⭐ {product.rating || 4.5} ({product.reviewCount || 0} reviews)
        </div>

        <div className="product-price">
          <span className="price">{currencyFormatter.format(product.price)}</span>
          {product.originalPrice && (
            <span className="original-price">
              {currencyFormatter.format(product.originalPrice)}
            </span>
          )}
        </div>

        <div className="product-actions">
          <Button
            variant="primary"
            size="sm"
            fullWidth
            loading={isAddingToCart}
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}

ProductCard.propTypes = {
  product: Object.isRequired,
  onAddToCart: Function,
};

