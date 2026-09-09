import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../store/productSlice.js';
import { selectProducts, selectProductLoading, selectProductError } from '../store/productSelectors.js';
import ProductGrid from '../components/ProductGrid.jsx';
import './ProductsPage.css';

const ProductsPage = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const loading = useSelector(selectProductLoading);
  const error = useSelector(selectProductError);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // TODO: Add filtering, sorting, and pagination controls

  return (
    <div className="products-page">
      <header className="products-page-header">
        <h1>Our Products</h1>
        {/* Placeholder for filters */}
        <div className="filters-placeholder">Filters will go here</div>
      </header>
      <main>
        <ProductGrid products={products} loading={loading} error={error} />
      </main>
      {/* TODO: Add pagination component */}
    </div>
  );
};

export default ProductsPage;
