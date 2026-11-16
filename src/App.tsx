import SiteFooter from '@/components/SiteFooter'
import SiteHeader from '@/components/SiteHeader'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { useCartStore } from '@/features/cart/store'
import { usePlaceOrder } from '@/features/orders/usePlaceOrder'
import { useProductsQuery } from '@/features/products/queries'
import { useAuth } from '@/features/auth/useAuth'
import { ProtectedRoute } from '@/features/auth/ProtectedRoute'
import { AdminRoute } from '@/features/admin/AdminRoute'
import HomePage from '@/pages/HomePage'
import NotFoundPage from '@/pages/NotFoundPage'
import OrdersPage from '@/pages/OrdersPage'
import ProductDetailPage from '@/pages/ProductDetailPage'
import ProductsPage from '@/pages/ProductsPage'
import LoginPage from '@/pages/LoginPage'
import SignupPage from '@/pages/SignupPage'
import AccountPage from '@/pages/AccountPage'
import AdminPage from '@/pages/AdminPage'
import '@/App.css'

function App() {
  const cart = useCartStore((state) => state.cart)
  const addToCart = useCartStore((state) => state.addToCart)
  const removeFromCart = useCartStore((state) => state.removeFromCart)
  const clearCart = useCartStore((state) => state.clearCart)
  const { session, signOut } = useAuth()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const placeOrder = usePlaceOrder()
  const itemCount = Object.values(cart).reduce((total, item) => total + item.quantity, 0)
  const productsResult = useProductsQuery()
  const products = productsResult.data ?? []

  function resetCheckout() {
    placeOrder.reset()
  }

  function handleCheckout() {
    if (!session) {
      navigate('/login', { state: { from: pathname } })
      return
    }
    placeOrder.mutate(Object.values(cart))
  }

  const pageProps = {
    cart,
    products,
    onAddToCart: (productId: string) => {
      resetCheckout()
      addToCart(productId)
    },
    onRemoveFromCart: (productId: string) => {
      resetCheckout()
      removeFromCart(productId)
    },
    onClearCart: () => {
      resetCheckout()
      clearCart()
    },
    onCheckout: handleCheckout,
    checkoutPending: placeOrder.isPending,
    checkoutError: placeOrder.error instanceof Error ? placeOrder.error.message : null,
    checkoutSucceeded: placeOrder.isSuccess,
  }
  const activePage = pathname === '/'
    ? 'home'
    : pathname.startsWith('/products')
      ? 'products'
      : pathname === '/orders'
        ? 'orders'
        : pathname === '/account'
          ? 'account'
          : pathname === '/admin'
            ? 'admin'
        : null

  return (
    <div className="app-shell">
      <SiteHeader
        activePage={activePage}
        cartCount={itemCount}
        session={session}
        onSignOut={signOut}
      />
      <Routes>
        <Route path="/" element={<HomePage {...pageProps} productsResult={productsResult} />} />
        <Route path="/products" element={<ProductsPage {...pageProps} productsResult={productsResult} />} />
        <Route path="/products/:id" element={<ProductDetailPage {...pageProps} />} />
        <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><AdminRoute><AdminPage /></AdminRoute></ProtectedRoute>} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <SiteFooter />
    </div>
  )
}

export default App
