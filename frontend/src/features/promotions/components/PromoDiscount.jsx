import React from 'react';
import { useSelector } from 'react-redux';
import { selectCartDiscountAmount } from '../../cart/store/cartSelectors.js';

const PromoDiscount = () => {
  const discountAmount = useSelector(selectCartDiscountAmount);

  if (discountAmount <= 0) {
    return null;
  }

  return (
    <div className="summary-row discount">
      <span>Discount</span>
      <span>-${discountAmount.toFixed(2)}</span>
    </div>
  );
};

export default PromoDiscount;
