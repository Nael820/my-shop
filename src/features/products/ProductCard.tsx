import type { Product } from '@/types/ecommerce'
import { Link } from 'react-router-dom'
import { getResponsiveProductImage } from '@/features/products/productImages'
import { formatPrice } from '@/lib/formatPrice'

type ProductCardProps = {
  product: Product
  onAddToCart: (productId: string) => void
  priority?: boolean // true uniquement pour la 1ère carte visible (LCP)
}

function ProductCard({ product, onAddToCart, priority = false }: ProductCardProps) {
  const image = product.image
    ? getResponsiveProductImage(product.image, [240, 320, 400, 480, 600, 800, 900])
    : null

  return (
    <article className="product-card">
      <Link className="product-image-link" to={`/products/${product.slug}`} aria-label={`Voir ${product.name}`}>
        <div className="product-image-wrap">
          {product.image && (
            <img
              className="product-image"
              src={image?.src}
              srcSet={image?.srcSet}
              sizes="(max-width: 390px) calc(100vw - 26px), (max-width: 720px) calc((100vw - 49px) / 2), (max-width: 1000px) calc((100vw - 328px) / 2), (max-width: 1360px) calc((100vw - 433px) / 2), 464px"
              width={600}
              height={400}
              alt={product.name}
              decoding="async"
              loading={priority ? 'eager' : 'lazy'}
              fetchPriority={priority ? 'high' : 'auto'}
            />
          )}
          {product.badge && <span className="product-badge">{product.badge}</span>}
          {product.category && <span className="product-category">{product.category}</span>}
        </div>
      </Link>
      <div className="product-details">
        <div className="product-title-row">
          <h3>
            <Link className="product-title-link" to={`/products/${product.slug}`}>
              {product.name}
            </Link>
          </h3>
          <span className="product-price">{formatPrice(product.price)}</span>
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
            disabled={!product.inStock}
            onClick={() => onAddToCart(product.id)}
          >
            Ajouter au panier <span aria-hidden="true">＋</span>
          </button>
        </div>
      </div>
    </article>
  )
}

export default ProductCard