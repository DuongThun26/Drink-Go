import { useSelector } from 'react-redux'

export function useCart() {
  const cart = useSelector((state) => state.cart)
  const itemCount = cart.items.reduce((sum, item) => sum + (item.quantity || 0), 0)

  return { ...cart, itemCount }
}
