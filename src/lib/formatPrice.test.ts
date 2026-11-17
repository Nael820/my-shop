import { describe, expect, it } from 'vitest'
import { formatPrice } from '@/lib/formatPrice'

describe('formatPrice', () => {
  it('formats an amount as a euro price in French', () => {
    expect(formatPrice(12)).toContain('12')
    expect(formatPrice(12)).toContain('€')
  })
})
