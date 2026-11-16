import { create } from 'zustand'
import { applyAction, type Cart } from '@/types/ecommerce'

type CartStore = {
  cart: Cart
  addToCart: (productId: string) => void
  removeFromCart: (productId: string) => void
  clearCart: () => void
}

export const useCartStore = create<CartStore>((set) => ({
  cart: {},
  addToCart: (productId) => set((state) => ({
    cart: applyAction(state.cart, { type: 'addToCart', productId, quantity: 1 }),
  })),
  removeFromCart: (productId) => set((state) => ({
    cart: applyAction(state.cart, { type: 'removeFromCart', productId }),
  })),
  clearCart: () => set((state) => ({
    cart: applyAction(state.cart, { type: 'clearCart' }),
  })),
}))
