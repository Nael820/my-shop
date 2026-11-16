import { Link } from 'react-router-dom'
import { useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { useIsAdminQuery } from '@/features/admin/queries'

type SiteHeaderProps = {
  activePage: 'home' | 'products' | 'orders' | 'account' | 'admin' | null
  cartCount: number
  session: Session | null
  onSignOut: () => Promise<void>
}

function SiteHeader({ activePage, cartCount, session, onSignOut }: SiteHeaderProps) {
  const [signOutError, setSignOutError] = useState<string | null>(null)
  const isAdminQuery = useIsAdminQuery(session?.user.id)

  async function handleSignOut() {
    setSignOutError(null)
    try {
      await onSignOut()
    } catch (error) {
      setSignOutError(error instanceof Error ? error.message : 'La déconnexion a échoué.')
    }
  }

  return (
    <header className="topbar">
      <Link className="wordmark" to="/">
        <span className="wordmark-mark" aria-hidden="true">m.</span>
        maison moderne
      </Link>
      <nav className="main-nav" aria-label="Navigation principale">
        <Link className={`nav-link${activePage === 'home' ? ' is-active' : ''}`} to="/">
          Accueil
        </Link>
        <Link className={`nav-link${activePage === 'products' ? ' is-active' : ''}`} to="/products">
          Boutique
        </Link>
        <Link className={`nav-link${activePage === 'orders' ? ' is-active' : ''}`} to="/orders">
          Commandes
        </Link>
        {isAdminQuery.data && (
          <Link className={`nav-link${activePage === 'admin' ? ' is-active' : ''}`} to="/admin">
            Admin
          </Link>
        )}
      </nav>
      <div className="header-actions">
        {session ? (
          <>
            <Link className="auth-link" to="/account" aria-current={activePage === 'account' ? 'page' : undefined}>
              {session.user.email}
            </Link>
            <button className="auth-link auth-signout" type="button" onClick={() => void handleSignOut()}>
              Déconnexion
            </button>
          </>
        ) : (
          <Link className="auth-link" to="/login">Connexion</Link>
        )}
        <Link
          className="cart-button"
          to={activePage === 'home' || activePage === 'products' ? '#basket' : '/#basket'}
          aria-label={`Voir le panier, ${cartCount} article(s)`}
        >
          <span>Panier</span>
          <span className="cart-count">{cartCount}</span>
        </Link>
        {signOutError && <span className="header-error" role="alert">{signOutError}</span>}
        {session && isAdminQuery.error && (
          <span className="header-error" role="alert">{isAdminQuery.error.message}</span>
        )}
      </div>
    </header>
  )
}

export default SiteHeader
