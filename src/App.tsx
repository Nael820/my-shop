import SiteFooter from '@/components/SiteFooter'
import SiteHeader from '@/components/SiteHeader'
import { Route, Routes, useLocation } from 'react-router-dom'
import { useCart } from '@/hooks/useCart'
import { useProductsQuery } from '@/features/products/queries'
import HomePage from '@/pages/HomePage'
import NotFoundPage from '@/pages/NotFoundPage'
import OrdersPage from '@/pages/OrdersPage'
import ProductDetailPage from '@/pages/ProductDetailPage'
import ProductsPage from '@/pages/ProductsPage'
import '@/App.css'

function App() {
  const { cart, itemCount, addToCart, removeFromCart, clearCart } = useCart()
  const { pathname } = useLocation()
  const productsResult = useProductsQuery()
  const products = productsResult.data ?? []
  const pageProps = {
    cart,
    products,
    onAddToCart: addToCart,
    onRemoveFromCart: removeFromCart,
    onClearCart: clearCart,
  }
  const activePage = pathname === '/'
    ? 'home'
    : pathname.startsWith('/products')
      ? 'products'
      : pathname === '/orders'
        ? 'orders'
        : null

  return (
    <div className="app-shell">
      <SiteHeader
        activePage={activePage}
        cartCount={itemCount}
      />
      <Routes>
        <Route path="/" element={<HomePage {...pageProps} productsResult={productsResult} />} />
        <Route path="/products" element={<ProductsPage {...pageProps} productsResult={productsResult} />} />
        <Route path="/products/:id" element={<ProductDetailPage {...pageProps} />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <SiteFooter />
    </div>
  )
}

export default App
