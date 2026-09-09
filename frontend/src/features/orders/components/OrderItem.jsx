import React from 'react';
import { Link } from 'react-router-dom';
import './OrderItem.css';

const OrderItem = ({ order }) => {
  const orderDate = new Date(order.createdAt).toLocaleDateString();

  return (
    <div className="order-item">
      <div className="order-header">
        <div className="order-info">
          <span>Order #{order.id}</span>
          <span className="order-date">Placed on {orderDate}</span>
        </div>
        <div className="order-status">
          <span className={`status-badge status-${order.status.toLowerCase()}`}>{order.status}</span>
        </div>
      </div>
      <div className="order-body">
        <p>Total: <strong>${order.totalAmount.toFixed(2)}</strong></p>
        {/* Could show a few item images here */}
      </div>
      <div className="order-footer">
        <Link to={`/orders/${order.id}`} className="details-link">View Details</Link>
      </div>
    </div>
  );
};

export default OrderItem;
