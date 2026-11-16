import type { ReactNode } from 'react'
import { useOrdersQuery, type OrderListItem } from '@/features/orders/queries'
import type { OrdersByStatus, OrderStatus } from '@/types/orders'
import { labelStatus } from '@/types/orders'

const orderStatuses: OrderStatus[] = ['pending', 'paid', 'shipped', 'cancelled']

function OrderList() {
  const result = useOrdersQuery()
  let content: ReactNode

  switch (result.status) {
    case 'pending':
      content = <p className="fetch-message" role="status">Chargement des commandes…</p>
      break
    case 'error':
      content = <p className="fetch-message error-message" role="alert">{result.error.message}</p>
      break
    case 'success': {
      const ordersByStatus: OrdersByStatus<OrderListItem> = {
        pending: [],
        paid: [],
        shipped: [],
        cancelled: [],
      }

      for (const order of result.data) {
        ordersByStatus[order.status].push(order)
      }

      content = (
        <>
          <div className="order-summary-strip" aria-label="Résumé des commandes">
            {orderStatuses.map((status) => (
              <div className="summary-cell" key={status}>
                <span>{labelStatus(status)}</span>
                <strong>{ordersByStatus[status].length}</strong>
              </div>
            ))}
          </div>
          <p className="orders-total">
            Nombre de commandes : <strong>{result.data.length}</strong>
          </p>
          {result.data.length === 0 ? (
            <p className="fetch-message">Aucune commande pour le moment.</p>
          ) : (
            <div className="order-list">
              {result.data.map((order) => (
                <article className="order-row" key={order.id}>
                  <div><span>Commande</span><strong>{order.id}</strong></div>
                  <div>
                    <span>Date</span>
                    <strong>{new Date(order.createdAt).toLocaleDateString('fr-FR')}</strong>
                  </div>
                  <span className={`order-status status-${order.status}`}>{labelStatus(order.status)}</span>
                </article>
              ))}
            </div>
          )}
        </>
      )
      break
    }
    default: {
      const _exhaustive: never = result
      content = _exhaustive
    }
  }

  return <div className="orders-content">{content}</div>
}

export default OrderList
