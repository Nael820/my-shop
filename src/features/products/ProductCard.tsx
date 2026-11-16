import type { Product } from '@/types/ecommerce'
import { Link } from 'react-router-dom'

type ProductCardProps = {
  product: Product
  onAddToCart: (productId: string) => void
  priority?: boolean // true uniquement pour la 1ère carte visible (LCP)
}

const IMG_WIDTH = 600
const IMG_HEIGHT = 400 // ratio 3:2, doit correspondre au ratio affiché en CSS

// Construit une URL Unsplash optimisée (WebP, qualité 70, recadrée en 3:2)
function unsplash(src: string, w: number) {
  const url = new URL(src)
  url.searchParams.set('auto', 'format')
  url.searchParams.set('fit', 'crop')
  url.searchParams.set('w', String(w))
  url.searchParams.set('h', String(Math.round((w * IMG_HEIGHT) / IMG_WIDTH)))
  url.searchParams.set('q', '70')
  url.searchParams.set('fm', 'webp')
  return url.toString()
}

function isUnsplash(src: string) {
  try {
    return new URL(src).hostname === 'images.unsplash.com'
  } catch {
    return false
  }
}

function ProductCard({ product, priority = false }: ProductCardProps) {
  const optimized = product.image && isUnsplash(product.image)

  return (
    <article className="product-card">
      <Link className="product-image-link" to={`/products/${product.id}`} aria-label={`Voir ${product.name}`}>
        <div className="product-image-wrap">
          {product.image && (
            <img
              className="product-image"
              src={optimized ? unsplash(product.image, IMG_WIDTH) : product.image}
              srcSet={
                optimized
                  ? [400, 600, 900].map((w) => `${unsplash(product.image!, w)} ${w}w`).join(', ')
                  : undefined
              }
              sizes="(max-width: 640px) 100vw, 321px"
              width={IMG_WIDTH}
              height={IMG_HEIGHT}
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
      {/* ... reste inchangé ... */}
    </article>
  )
}

export default ProductCard