import OrderList from '@/features/orders/OrderList'

function OrdersPage() {
  return (
    <main className="orders-page">
      <section className="orders-intro">
        <p className="eyebrow"><span className="eyebrow-dot" /> Votre espace</p>
        <h1>Les <em>commandes.</em></h1>
        <p>Retrouvez le détail et le statut de vos commandes.</p>
      </section>
      <OrderList />
    </main>
  )
}

export default OrdersPage
