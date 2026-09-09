/**
 * Products Hooks
 */

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProducts,
  fetchProductById,
  searchProducts,
  fetchFeaturedProducts,
} from '../store/productSlice.js';
import {
  selectProducts,
  selectSelectedProduct,
  selectFeaturedProducts,
  selectProductsLoading,
  selectProductsError,
  selectFilters,
  selectPagination,
} from '../store/productSelectors.js';

/**
 * useProducts Hook
 * Fetch all products with filters
 */
export function useProducts(params = {}) {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const loading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);
  const pagination = useSelector(selectPagination);
  const filters = useSelector(selectFilters);

  useEffect(() => {
    dispatch(fetchProducts({ ...filters, ...params }));
  }, [dispatch, filters]);

  return { products, loading, error, pagination, filters };
}

/**
 * useProduct Hook
 * Fetch single product
 */
export function useProduct(id) {
  const dispatch = useDispatch();
  const product = useSelector(selectSelectedProduct);
  const loading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [id, dispatch]);

  return { product, loading, error };
}

/**
 * useFeaturedProducts Hook
 * Fetch featured products
 */
export function useFeaturedProducts(limit = 10) {
  const dispatch = useDispatch();
  const featuredProducts = useSelector(selectFeaturedProducts);
  const loading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);

  useEffect(() => {
    dispatch(fetchFeaturedProducts(limit));
  }, [dispatch, limit]);

  return { featuredProducts, loading, error };
}

/**
 * useProductSearch Hook
 * Search products
 */
export function useProductSearch(query) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (query && query.trim().length > 0) {
      dispatch(searchProducts(query));
    }
  }, [query, dispatch]);
}

