import type { ReactNode } from 'react'
import type { UseQueryResult } from '@tanstack/react-query'
import type { Product } from '@/types/ecommerce'
import ProductCard from '@/features/products/ProductCard'

type ProductListProps = {
  result: UseQueryResult<Product[], Error>
  onAddToCart: (productId: string) => void
  maxItems?: number
  prioritizeFirst?: boolean // true si la 1ère carte est l'image du LCP de la page
}

function ProductList({ result, onAddToCart, maxItems, prioritizeFirst = true }: ProductListProps) {
  let content: ReactNode

  switch (result.status) {
    case 'pending':
      content = <p className="fetch-message" role="status">Chargement des produits…</p>
      break
    case 'error':
      content = <p className="fetch-message error-message" role="alert">{result.error.message}</p>
      break
    case 'success': {
      const products = maxItems === undefined ? result.data : result.data.slice(0, maxItems)
      content = products.length > 0
        ? products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              priority={prioritizeFirst && index === 0}
            />
          ))
        : <p className="fetch-message">Aucun produit à afficher pour le moment.</p>
      break
    }
    default: {
      const _exhaustive: never = result
      content = _exhaustive
    }
  }

  return <div className="product-grid" aria-live="polite">{content}</div>
}

export default ProductList