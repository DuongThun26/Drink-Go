import React from 'react';
import { useParams } from 'react-router-dom';
import { useOrderDetails } from '../hooks/useOrder.js';
import './OrderDetailPage.css';

const OrderDetailPage = () => {
  const { id } = useParams();
  const { order, loading, error } = useOrderDetails(id);

  if (loading) {
    return <div>Loading order details...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!order) {
    return <div>Order not found.</div>;
  }

  return (
    <div className="order-detail-page">
      <h1>Order #{order.id}</h1>
      <div className="order-detail-grid">
        <div className="order-items-section">
          <h4>Items</h4>
          {order.items.map(item => (
            <div key={item.id} className="order-detail-item">
              <img src={item.product.imageUrl} alt={item.product.name} />
              <div>
                <p>{item.product.name}</p>
                <p>Quantity: {item.quantity}</p>
              </div>
              <p>${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>
        <div className="order-summary-section">
          <h4>Summary</h4>
          <p>Status: {order.status}</p>
          <p>Total: <strong>${order.totalAmount.toFixed(2)}</strong></p>
          <h4>Shipping Address</h4>
          <p>{order.shippingAddress.street}</p>
          <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
