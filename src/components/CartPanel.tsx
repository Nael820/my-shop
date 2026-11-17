import type { Cart, Product } from '@/types/ecommerce'
import { computeCartTotal } from '@/features/cart/cart'
import { formatPrice } from '@/lib/formatPrice'

type CartPanelProps = {
  cart: Cart
  products: Product[]
  onRemove: (productId: string) => void
  onClear: () => void
  onCheckout: () => void
  checkoutPending: boolean
  checkoutError: string | null
  checkoutSucceeded: boolean
}

function CartPanel({
  cart,
  products,
  onRemove,
  onClear,
  onCheckout,
  checkoutPending,
  checkoutError,
  checkoutSucceeded,
}: CartPanelProps) {
  const lines = Object.values(cart)
  const itemCount = lines.reduce((total, line) => total + line.quantity, 0)
  const getProductName = (productId: string) =>
    products.find((product) => product.id === productId)?.name ?? productId
  const total = computeCartTotal(lines.flatMap((line) => {
    const product = products.find((item) => item.id === line.productId)
    return product ? [{ product, quantity: line.quantity }] : []
  }))

  return (
    <aside className="cart-panel" id="basket" aria-labelledby="cart-title">
      <div className="cart-panel-heading">
        <div>
          <p className="eyebrow">Votre sélection</p>
          <h2 id="cart-title">Le panier <span className="heading-count">{itemCount}</span></h2>
        </div>
        <span className="basket-icon" aria-hidden="true">↗</span>
      </div>
      {lines.length === 0 ? (
        <div className="empty-cart">
          <span className="empty-cart-mark" aria-hidden="true">＋</span>
          <p>Votre panier est encore vide.</p>
          <span>Les belles trouvailles sont juste à côté.</span>
        </div>
      ) : (
        <div className="cart-lines">
          {lines.map((line) => (
            <div key={line.productId} className="cart-line">
              <span className="cart-line-thumb" aria-hidden="true">m.</span>
              <div className="cart-line-info">
                <strong>{getProductName(line.productId)}</strong>
                <span>Quantité : {line.quantity}</span>
              </div>
              <button
                className="remove-button"
                type="button"
                disabled={checkoutPending}
                onClick={() => onRemove(line.productId)}
                aria-label={`Retirer ${getProductName(line.productId)} du panier`}
              >
                Retirer
              </button>
            </div>
          ))}
          <button className="clear-cart" type="button" onClick={onClear} disabled={checkoutPending}>
            Vider le panier
          </button>
          <p className="cart-total">Total <strong>{formatPrice(total)}</strong></p>
          <button className="add-button checkout-button" type="button" onClick={onCheckout} disabled={checkoutPending}>
            {checkoutPending ? 'Commande en cours…' : 'Passer commande'}
          </button>
          {checkoutError && <p className="auth-error" role="alert">{checkoutError}</p>}
        </div>
      )}
      {checkoutSucceeded && (
        <p className="auth-success" role="status">Commande enregistrée. Retrouvez-la dans votre compte.</p>
      )}
      <div className="cart-footnote"><span className="footnote-check">✓</span> Livraison offerte dès 80 €</div>
    </aside>
  )
}

export default CartPanel
