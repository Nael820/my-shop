import { Link, useNavigate, useParams } from 'react-router-dom'
import CartPanel from '@/components/CartPanel'
import type { Cart, Product } from '@/types/ecommerce'
import { getResponsiveProductImage } from '@/features/products/productImages'
import { useProductQuery } from '@/features/products/queries'

type ProductDetailPageProps = {
  cart: Cart
  products: Product[]
  onAddToCart: (productId: string) => void
  onRemoveFromCart: (productId: string) => void
  onClearCart: () => void
  onCheckout: () => void
  checkoutPending: boolean
  checkoutError: string | null
  checkoutSucceeded: boolean
}

function ProductDetailPage({
  cart,
  products,
  onAddToCart,
  onRemoveFromCart,
  onClearCart,
  onCheckout,
  checkoutPending,
  checkoutError,
  checkoutSucceeded,
}: ProductDetailPageProps) {
  const { id: slug } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const productResult = useProductQuery(slug ?? '')
  const product = productResult.data ?? undefined
  const image = product?.image
    ? getResponsiveProductImage(product.image, [400, 480, 600, 800, 900, 1200], 900)
    : null

  return (
    <main className="products-page">
      <section className="intro-band products-intro">
        <div className="intro-copy">
          <p className="eyebrow"><span className="eyebrow-dot" /> La sélection du studio</p>
          <h1>{product ? <>{product.name}<em>.</em></> : <>Fiche <em>produit.</em></>}</h1>
          <button
            className="add-button detail-back-button"
            type="button"
            onClick={() => navigate('/products')}
          >
            ← Retour à la boutique
          </button>
        </div>
      </section>
      <div className="shop-layout">
        <section className="catalog-section" aria-live="polite">
          {!slug ? (
            <div className="fetch-message">
              <p>Identifiant de produit manquant.</p>
              <Link className="add-button" to="/products">Retour aux produits</Link>
            </div>
          ) : productResult.isPending ? (
            <p className="fetch-message" role="status">Chargement du produit…</p>
          ) : productResult.error ? (
            <p className="fetch-message error-message" role="alert">{productResult.error.message}</p>
          ) : !product ? (
            <div className="fetch-message">
              <p>Aucun produit avec l’identifiant « {slug} ».</p>
              <Link className="add-button" to="/products">Retour aux produits</Link>
            </div>
          ) : (
            <article className="product-detail-card">
              <div className="product-image-wrap">
                {image && (
                  <img
                    className="product-image"
                    src={image.src}
                    srcSet={image.srcSet}
                    sizes="(max-width: 390px) calc(100vw - 26px), (max-width: 720px) calc(100vw - 36px), (max-width: 1000px) calc(100vw - 328px), (max-width: 1153px) calc(100vw - 433px), 720px"
                    width={900}
                    height={600}
                    alt={product.name}
                    decoding="async"
                    loading="eager"
                    fetchPriority="high"
                  />
                )}
                {product.badge && <span className="product-badge">{product.badge}</span>}
                {product.category && <span className="product-category">{product.category}</span>}
              </div>
              <div className="product-details">
                <div className="product-title-row">
                  <h2>{product.name}</h2>
                  <span className="product-price">{product.price} €</span>
                </div>
                {product.description && <p>{product.description}</p>}
                <div className="product-actions">
                  <span className={product.inStock ? 'stock-status' : 'stock-status is-out'}>
                    <span aria-hidden="true" />
                    {product.inStock ? 'En stock' : 'Épuisé'}
                  </span>
                  <button
                    className="add-button"
                    type="button"
                    disabled={!product.inStock || checkoutPending}
                    onClick={() => onAddToCart(product.id)}
                  >
                    Ajouter au panier <span aria-hidden="true">＋</span>
                  </button>
                </div>
              </div>
            </article>
          )}
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

export default ProductDetailPage
