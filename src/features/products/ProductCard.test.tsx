import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import ProductCard from '@/features/products/ProductCard'
import type { Product } from '@/types/ecommerce'
import { renderWithProviders } from '@/test/renderWithProviders'

const product: Product = {
  id: 'product-1',
  slug: 'lampe-aria',
  name: 'Lampe Aria',
  price: 42,
  inStock: true,
  category: 'Éclairage',
  description: 'Une lampe pour la maison.',
}

describe('ProductCard', () => {
  it('displays the product details and links to its page', () => {
    renderWithProviders(<ProductCard product={product} onAddToCart={vi.fn()} />)

    expect(screen.getByRole('heading', { name: 'Lampe Aria' })).toBeInTheDocument()
    expect(screen.getByText(/42,00/)).toBeInTheDocument()
    expect(screen.getByText('Éclairage')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Lampe Aria' })).toHaveAttribute('href', '/products/lampe-aria')
  })

  it('adds an in-stock product to the cart when clicked', async () => {
    const user = userEvent.setup()
    const onAddToCart = vi.fn()
    renderWithProviders(<ProductCard product={product} onAddToCart={onAddToCart} />)

    await user.click(screen.getByRole('button', { name: /Ajouter au panier/ }))

    expect(onAddToCart).toHaveBeenCalledWith('product-1')
  })

  it('disables adding a product that is out of stock', () => {
    renderWithProviders(
      <ProductCard product={{ ...product, inStock: false }} onAddToCart={vi.fn()} />,
    )

    expect(screen.getByRole('button', { name: /Ajouter au panier/ })).toBeDisabled()
  })
})
