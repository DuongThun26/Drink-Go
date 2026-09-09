import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart } from '../store/cartSlice.js';
import { 
  selectCartItems, 
  selectCartLoading, 
  selectCartError, 
  selectCartSessionId,
  selectCartFinalAmount,
  selectCartTotalPrice
} from '../store/cartSelectors.js';

export function useCart() {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const loading = useSelector(selectCartLoading);
  const error = useSelector(selectCartError);
  const sessionId = useSelector(selectCartSessionId);
  const totalPrice = useSelector(selectCartTotalPrice);
  const finalAmount = useSelector(selectCartFinalAmount);

  useEffect(() => {
    // Only fetch cart if we have a session ID and the cart hasn't been loaded yet.
    if (sessionId && items.length === 0) {
      dispatch(fetchCart(sessionId));
    }
  }, [dispatch, sessionId, items.length]);

  return { items, loading, error, sessionId, totalPrice, finalAmount };
}
