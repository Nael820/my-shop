import { useAuth } from '@/features/auth/useAuth'
import OrderList from '@/features/orders/OrderList'

function AccountPage() {
  const { session } = useAuth()

  return (
    <main className="orders-page">
      <section className="orders-intro">
        <p className="eyebrow"><span className="eyebrow-dot" /> Votre espace</p>
        <h1>Bonjour<em>.</em></h1>
        <p>{session?.user.email}</p>
      </section>
      <section aria-label="Vos commandes">
        <h2 className="account-orders-title">Vos commandes</h2>
        <OrderList />
      </section>
    </main>
  )
}

export default AccountPage
