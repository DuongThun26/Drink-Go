import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../cart/hooks/useCart.js';
import { useOrderCreate } from '../hooks/useOrderCreate.js';
import OrderSummary from '../components/OrderSummary.jsx';
import OrderForm from '../components/OrderForm.jsx';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const cart = useCart();
  const { newOrder, resetOrder } = useOrderCreate();

  // Redirect to a success page once the order is created
  React.useEffect(() => {
    if (newOrder) {
      const orderId = newOrder.id;
      resetOrder(); // Clear the current order from state
      navigate(`/orders/${orderId}?success=true`);
    }
  }, [newOrder, navigate, resetOrder]);

  if (cart.loading) {
    return <div>Loading cart...</div>;
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="checkout-page">
        <h1>Checkout</h1>
        <p>Your cart is empty. Add items to your cart to proceed.</p>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>
      <div className="checkout-layout">
        <div className="order-form-container">
          <OrderForm cart={cart} />
        </div>
        <div className="order-summary-container">
          <OrderSummary cart={cart} />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
