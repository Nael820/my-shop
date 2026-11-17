import { describe, expect, it } from 'vitest'
import { applyAction } from '@/types/ecommerce'
import { computeCartTotal } from '@/features/cart/cart'

describe('computeCartTotal', () => {
  it('sums product prices multiplied by their quantities', () => {
    const lines = [
      { product: { price: 10 }, quantity: 2 },
      { product: { price: 5 }, quantity: 1 },
    ]

    expect(computeCartTotal(lines)).toBe(25)
  })

  it('returns zero for an empty cart', () => {
    expect(computeCartTotal([])).toBe(0)
  })

  it('rejects invalid cart input', () => {
    // @ts-expect-error Deliberately test the runtime guard against a non-array value.
    expect(() => computeCartTotal(null)).toThrow()
  })
})

describe('applyAction', () => {
  it('adds an existing product quantity instead of duplicating its line', () => {
    const cart = { 'product-1': { productId: 'product-1', quantity: 1 } }

    expect(applyAction(cart, {
      type: 'addToCart',
      productId: 'product-1',
      quantity: 2,
    })).toEqual({ 'product-1': { productId: 'product-1', quantity: 3 } })
  })

  it('does not add a zero-quantity line', () => {
    expect(applyAction({}, {
      type: 'addToCart',
      productId: 'product-1',
      quantity: 0,
    })).toEqual({})
  })
})
