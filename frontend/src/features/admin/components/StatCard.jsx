import React from 'react';
import './StatCard.css';

const StatCard = ({ title, value, icon }) => {
  return (
    <div className="stat-card">
      <div className="stat-info">
        <h5 className="stat-title">{title}</h5>
        <p className="stat-value">{value}</p>
      </div>
      {icon && <div className="stat-icon">{icon}</div>}
    </div>
  );
};

export default StatCard;
