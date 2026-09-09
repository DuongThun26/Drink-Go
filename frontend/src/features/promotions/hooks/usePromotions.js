import { useDispatch, useSelector } from 'react-redux';
import { applyPromoCode, clearPromo } from '../store/promotionSlice.js';
import { 
  selectAppliedPromoCode, 
  selectPromoLoading, 
  selectPromoError 
} from '../store/promotionSelectors.js';
import { selectCartSessionId } from '../../cart/store/cartSelectors.js';

export function usePromotions() {
  const dispatch = useDispatch();
  const cartId = useSelector(selectCartSessionId);
  const appliedCode = useSelector(selectAppliedPromoCode);
  const loading = useSelector(selectPromoLoading);
  const error = useSelector(selectPromoError);

  const applyCode = (code) => {
    if (cartId && code) {
      dispatch(applyPromoCode({ code, cartId }));
    }
  };

  const removeCode = () => {
    // This would typically involve another API call to remove the promo from the cart
    // and then re-fetching the cart. For now, we just clear the local state.
    dispatch(clearPromo());
    // dispatch(fetchCart(cartId)); // Re-fetch cart to get original price
  };

  return { applyCode, removeCode, appliedCode, loading, error };
}
