import React, { useState } from 'react';
import { usePromotions } from '../hooks/usePromotions.js';
import './PromoCodeInput.css';

const PromoCodeInput = () => {
  const [code, setCode] = useState('');
  const { applyCode, removeCode, appliedCode, loading, error } = usePromotions();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (code) {
      applyCode(code);
    }
  };

  if (appliedCode) {
    return (
      <div className="promo-applied">
        <span>Promo <strong>{appliedCode}</strong> applied!</span>
        <button onClick={removeCode}>Remove</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="promo-form">
      <input 
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter promo code"
        disabled={loading}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Applying...' : 'Apply'}
      </button>
      {error && <p className="error-message">{error}</p>}
    </form>
  );
};

export default PromoCodeInput;
