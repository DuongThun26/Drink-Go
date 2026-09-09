import React from 'react';
import { useOrderHistory } from '../hooks/useOrder.js';
import OrderItem from '../components/OrderItem.jsx';
import './OrdersPage.css';

const OrdersPage = () => {
  const { orders, loading, error } = useOrderHistory();

  if (loading) {
    return <div className="status-message">Loading your order history...</div>;
  }

  if (error) {
    return <div className="status-message error">Error: {error}</div>;
  }

  return (
    <div className="orders-page">
      <h1>My Orders</h1>
      {orders && orders.length > 0 ? (
        <div className="orders-list">
          {orders.map(order => (
            <OrderItem key={order.id} order={order} />
          ))}
        </div>
      ) : (
        <p>You haven't placed any orders yet.</p>
      )}
    </div>
  );
};

export default OrdersPage;
