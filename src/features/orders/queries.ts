import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/features/auth/useAuth'
import { getSupabaseClient } from '@/lib/supabase'
import type { OrderStatus } from '@/types/orders'

export type OrderListItem = {
  id: string
  status: OrderStatus
  createdAt: string
  items: { name: string; quantity: number }[]
  total: number
}

export const orderQueryKeys = {
  all: ['orders'] as const,
  byUser: (userId: string) => ['orders', userId] as const,
}

function parseOrderStatus(status: string): OrderStatus {
  if (status === 'pending' || status === 'paid' || status === 'shipped' || status === 'cancelled') {
    return status
  }

  throw new Error(`Statut de commande inconnu : ${status}`)
}

export async function fetchOrders(): Promise<OrderListItem[]> {
  const { data, error } = await getSupabaseClient()
    .from('orders')
    .select('id, status, created_at, order_items(quantity, products(name, price))')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return data.map((order) => {
    const orderItems = Array.isArray(order.order_items) ? order.order_items : [order.order_items]
    const items = orderItems.map((item) => ({
      name: item.products?.name ?? 'Produit indisponible',
      quantity: item.quantity,
    }))

    return {
      id: order.id,
      status: parseOrderStatus(order.status),
      createdAt: order.created_at,
      items,
      total: orderItems.reduce(
        (total, item) => total + item.quantity * Number(item.products?.price ?? 0),
        0,
      ),
    }
  })
}

export function useOrdersQuery() {
  const { session } = useAuth()

  return useQuery({
    queryKey: session ? orderQueryKeys.byUser(session.user.id) : orderQueryKeys.all,
    queryFn: fetchOrders,
    enabled: Boolean(session),
  })
}
