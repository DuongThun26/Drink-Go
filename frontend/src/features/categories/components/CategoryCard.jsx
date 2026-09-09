import React from 'react';
import { Link } from 'react-router-dom';
import './CategoryCard.css';

const CategoryCard = ({ category }) => {
  return (
    <Link to={`/products?category=${category.slug}`} className="category-card">
      <img src={category.imageUrl} alt={category.name} className="category-image" />
      <div className="category-name-overlay">
        <span>{category.name}</span>
      </div>
    </Link>
  );
};

export default CategoryCard;
