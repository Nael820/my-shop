import { useAuth } from '@/features/auth/useAuth'

function AccountPage() {
  const { session } = useAuth()

  return (
    <main className="orders-page">
      <section className="orders-intro">
        <p className="eyebrow"><span className="eyebrow-dot" /> Votre espace</p>
        <h1>Bonjour<em>.</em></h1>
        <p>{session?.user.email}</p>
      </section>
    </main>
  )
}

export default AccountPage
