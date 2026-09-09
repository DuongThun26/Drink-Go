import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders, fetchOrderById } from '../store/orderSlice.js';
import { 
  selectOrderHistory, 
  selectCurrentOrder, 
  selectOrdersLoading, 
  selectOrdersError 
} from '../store/orderSelectors.js';

export function useOrderHistory() {
  const dispatch = useDispatch();
  const orders = useSelector(selectOrderHistory);
  const loading = useSelector(selectOrdersLoading);
  const error = useSelector(selectOrdersError);

  useEffect(() => {
    // Fetch orders if the list is empty
    if (orders.length === 0) {
      dispatch(fetchOrders());
    }
  }, [dispatch, orders.length]);

  return { orders, loading, error };
}

export function useOrderDetails(orderId) {
  const dispatch = useDispatch();
  const order = useSelector(selectCurrentOrder);
  const loading = useSelector(selectOrdersLoading);
  const error = useSelector(selectOrdersError);

  useEffect(() => {
    if (orderId) {
      // Fetch if the current order is not the one we want
      if (!order || order.id !== orderId) {
        dispatch(fetchOrderById(orderId));
      }
    }
  }, [dispatch, orderId, order]);

  return { order, loading, error };
}
