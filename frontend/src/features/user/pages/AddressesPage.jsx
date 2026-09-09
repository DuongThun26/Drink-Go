import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query'; // Using react-query for address management for variety
import { userApi } from '../api/userApi.js';
import AddressForm from '../../orders/components/AddressForm.jsx';
import './AddressesPage.css';

const AddressesPage = () => {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);

  const { data: addresses, isLoading } = useQuery('addresses', userApi.getAddresses);

  const addAddressMutation = useMutation(userApi.addAddress, {
    onSuccess: () => {
      queryClient.invalidateQueries('addresses');
      setIsAdding(false);
    },
  });

  const handleAddAddress = (data) => {
    addAddressMutation.mutate(data);
  };

  if (isLoading) {
    return <div>Loading addresses...</div>;
  }

  return (
    <div className="addresses-page">
      <h1>My Addresses</h1>
      <div className="addresses-list">
        {addresses?.map(address => (
          <div key={address.id} className="address-card">
            <p>{address.street}</p>
            <p>{address.city}, {address.state} {address.zipCode}</p>
            {/* Add edit/delete buttons here */}
          </div>
        ))}
      </div>
      
      <div className="add-address-section">
        <button onClick={() => setIsAdding(!isAdding)}>
          {isAdding ? 'Cancel' : 'Add New Address'}
        </button>
        {isAdding && (
          <div className="add-address-form">
            <AddressForm onSubmit={handleAddAddress} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressesPage;
