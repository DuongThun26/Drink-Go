import React from 'react';
import { useCategories } from '../hooks/useCategories.js';
import CategoryCard from './CategoryCard.jsx';
import './CategoryBrowser.css';

const CategoryBrowser = () => {
  const { categories, loading, error } = useCategories();

  if (loading) {
    return <div>Loading categories...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="category-browser">
      <h2>Browse by Category</h2>
      <div className="category-grid">
        {categories.map(category => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
};

export default CategoryBrowser;
