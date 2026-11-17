import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import ProductsPage from '@/pages/ProductsPage'
import { renderWithProviders } from '@/test/renderWithProviders'
import type { Cart, Product } from '@/types/ecommerce'

const products: Product[] = [{
  id: 'product-1',
  slug: 'lampe-aria',
  name: 'Lampe Aria',
  price: 42,
  inStock: true,
}]

function ProductsPageHarness() {
  const productsResult = useQuery({
    queryKey: ['test-products'],
    queryFn: async () => products,
    initialData: products,
  })
  const [cart, setCart] = useState<Cart>({})

  return (
    <ProductsPage
      cart={cart}
      products={products}
      productsResult={productsResult}
      onAddToCart={(productId) => setCart((current) => ({
        ...current,
        [productId]: {
          productId,
          quantity: (current[productId]?.quantity ?? 0) + 1,
        },
      }))}
      onRemoveFromCart={(productId) => setCart((current) => {
        const next = { ...current }
        delete next[productId]
        return next
      })}
      onClearCart={() => setCart({})}
      onCheckout={() => undefined}
      checkoutPending={false}
      checkoutError={null}
      checkoutSucceeded={false}
    />
  )
}

describe('ProductsPage', () => {
  it('shows products and updates the cart when one is added', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ProductsPageHarness />)

    expect(screen.getByRole('heading', { name: 'Tous les produits' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /Ajouter au panier/ }))

    expect(screen.getByText('Quantité : 1')).toBeInTheDocument()
    expect(screen.getByText('Total')).toBeInTheDocument()
  })
})
