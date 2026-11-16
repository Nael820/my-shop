import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCartStore } from '@/features/cart/store'
import { orderQueryKeys } from '@/features/orders/queries'
import { getSupabaseClient } from '@/lib/supabase'
import type { CartLine } from '@/types/ecommerce'

export function usePlaceOrder() {
  const queryClient = useQueryClient()
  const clearCart = useCartStore((state) => state.clearCart)

  return useMutation({
    mutationFn: async (items: CartLine[]) => {
      if (items.length === 0) {
        throw new Error('Votre panier est vide.')
      }

      const { data, error } = await getSupabaseClient().rpc('place_order', {
        p_items: items.map((item) => ({
          product_id: item.productId,
          quantity: item.quantity,
        })),
      })

      if (error) {
        throw new Error(error.message)
      }

      return data
    },
    onSuccess: async () => {
      clearCart()
      await queryClient.invalidateQueries({ queryKey: orderQueryKeys.all })
    },
  })
}
