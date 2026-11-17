import type { Product } from '@/types/ecommerce'

export type PricedCartLine = {
  product: Pick<Product, 'price'>
  quantity: number
}

export function computeCartTotal(lines: PricedCartLine[]): number {
  if (!Array.isArray(lines)) {
    throw new TypeError('Les articles du panier doivent être un tableau.')
  }

  const totalInCents = lines.reduce((total, line) => {
    if (!line || !line.product || !Number.isFinite(line.product.price) || line.product.price < 0) {
      throw new TypeError('Chaque article doit avoir un prix valide.')
    }
    if (!Number.isInteger(line.quantity) || line.quantity < 0) {
      throw new RangeError('La quantité doit être un entier positif ou nul.')
    }
    return total + Math.round(line.product.price * 100) * line.quantity
  }, 0)

  return totalInCents / 100
}
