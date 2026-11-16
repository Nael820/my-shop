import { useQuery } from '@tanstack/react-query'
import { getSupabaseClient } from '@/lib/supabase'
import type { OrderStatus } from '@/types/orders'

export type OrderListItem = {
  id: string
  status: OrderStatus
  createdAt: string
}

export const orderQueryKeys = {
  all: ['orders'] as const,
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
    .select('id, status, created_at')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return data.map((order) => ({
    id: order.id,
    status: parseOrderStatus(order.status),
    createdAt: order.created_at,
  }))
}

export function useOrdersQuery() {
  return useQuery({
    queryKey: orderQueryKeys.all,
    queryFn: fetchOrders,
  })
}
