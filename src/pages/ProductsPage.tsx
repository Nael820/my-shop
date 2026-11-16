import type { UseQueryResult } from '@tanstack/react-query'
import CartPanel from '@/components/CartPanel'
import ProductList from '@/features/products/ProductList'
import type { Cart, Product } from '@/types/ecommerce'

type ProductsPageProps = {
  cart: Cart
  products: Product[]
  productsResult: UseQueryResult<Product[], Error>
  onAddToCart: (productId: string) => void
  onRemoveFromCart: (productId: string) => void
  onClearCart: () => void
  onCheckout: () => void
  checkoutPending: boolean
  checkoutError: string | null
  checkoutSucceeded: boolean
}

function ProductsPage({
  cart,
  products,
  productsResult,
  onAddToCart,
  onRemoveFromCart,
  onClearCart,
  onCheckout,
  checkoutPending,
  checkoutError,
  checkoutSucceeded,
}: ProductsPageProps) {
  return (
    <main className="products-page">
      <section className="intro-band products-intro">
        <div className="intro-copy">
          <p className="eyebrow"><span className="eyebrow-dot" /> La sélection du studio</p>
          <h1>Nos <em>essentiels.</em></h1>
          <p className="intro-description">Des objets utiles, choisis pour durer et accompagner le quotidien.</p>
        </div>
      </section>
      <div className="shop-layout">
        <section className="catalog-section" aria-labelledby="products-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">La boutique</p>
              <h2 id="products-title">Tous les produits</h2>
            </div>
          </div>
          <ProductList result={productsResult} onAddToCart={onAddToCart} />
        </section>
        <CartPanel
          cart={cart}
          products={products}
          onRemove={onRemoveFromCart}
          onClear={onClearCart}
          onCheckout={onCheckout}
          checkoutPending={checkoutPending}
          checkoutError={checkoutError}
          checkoutSucceeded={checkoutSucceeded}
        />
      </div>
    </main>
  )
}

export default ProductsPage
