import { useDispatch, useSelector } from 'react-redux';
import { createOrder, clearCurrentOrder } from '../store/orderSlice.js';
import { selectCurrentOrder, selectOrdersLoading, selectOrdersError } from '../store/orderSelectors.js';

export function useOrderCreate() {
  const dispatch = useDispatch();
  const newOrder = useSelector(selectCurrentOrder);
  const loading = useSelector(selectOrdersLoading);
  const error = useSelector(selectOrdersError);

  const placeOrder = (orderData) => {
    dispatch(createOrder(orderData));
  };

  const resetOrder = () => {
    dispatch(clearCurrentOrder());
  };

  return { placeOrder, newOrder, loading, error, resetOrder };
}
