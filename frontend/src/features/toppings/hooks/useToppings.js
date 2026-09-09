import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchToppings } from '../store/toppingSlice.js';
import { selectToppings, selectToppingsLoading, selectToppingsError } from '../store/toppingSelectors.js';

export function useToppings() {
  const dispatch = useDispatch();
  const toppings = useSelector(selectToppings);
  const loading = useSelector(selectToppingsLoading);
  const error = useSelector(selectToppingsError);

  useEffect(() => {
    // Fetch toppings if they haven't been loaded yet
    if (toppings.length === 0) {
      dispatch(fetchToppings());
    }
  }, [dispatch, toppings.length]);

  return { toppings, loading, error };
}
