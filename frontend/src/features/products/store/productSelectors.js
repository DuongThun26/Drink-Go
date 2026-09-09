/**
 * Products Selectors
 */

export const selectProducts = (state) => state.products.items;
export const selectSelectedProduct = (state) => state.products.selectedProduct;
export const selectFeaturedProducts = (state) => state.products.featuredProducts;
export const selectSearchResults = (state) => state.products.searchResults;
export const selectProductsLoading = (state) => state.products.loading;
export const selectSearchLoading = (state) => state.products.searchLoading;
export const selectProductsError = (state) => state.products.error;
export const selectFilters = (state) => state.products.filters;
export const selectPagination = (state) => state.products.pagination;

export const selectProductsByCategory = (state, categoryId) =>
  state.products.items.filter(
    (product) => product.categoryId === categoryId
  );

export const selectFilteredProducts = (state) => {
  let filtered = state.products.items;
  const { search, sortBy, priceRange, category } = state.products.filters;

  if (category) {
    filtered = filtered.filter((p) => p.categoryId === category);
  }

  if (search) {
    const lowerSearch = search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerSearch) ||
        p.description?.toLowerCase().includes(lowerSearch)
    );
  }

  if (priceRange) {
    filtered = filtered.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );
  }

  if (sortBy === 'price-low') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'newest') {
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  return filtered;
};

