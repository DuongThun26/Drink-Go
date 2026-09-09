import React from 'react';
import AddressForm from './AddressForm.jsx';
// import PaymentForm from './PaymentForm'; // Assuming PaymentForm will be created
import { useOrderCreate } from '../hooks/useOrderCreate.js';

const OrderForm = ({ cart }) => {
  const { placeOrder, loading, error } = useOrderCreate();

  const handleAddressSubmit = (addressData) => {
    // In a real app, you'd also collect payment info here
    const orderData = {
      shippingAddress: addressData,
      billingAddress: addressData, // Or a different one
      cartId: cart.sessionId, // Or cart ID if different
      payment: {
        method: 'Credit Card', // Placeholder
        transactionId: 'dummy-txn-123' // Placeholder
      }
    };
    placeOrder(orderData);
  };

  return (
    <div className="order-form">
      <section className="address-section">
        <h2>Shipping Address</h2>
        <AddressForm onSubmit={handleAddressSubmit} />
      </section>
      
      {/* 
      <section className="payment-section">
        <h2>Payment Details</h2>
        <PaymentForm />
      </section> 
      */}

      {loading && <p>Placing your order...</p>}
      {error && <p className="error">Error: {error}</p>}
    </div>
  );
};

export default OrderForm;
