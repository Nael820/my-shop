import { expect, test } from '@playwright/test'

test('a visitor adds a catalog product to the cart', async ({ page }) => {
  const productsResponse = page.waitForResponse((response) =>
    response.url().includes('/rest/v1/products'),
  )

  await page.goto('/')

  const response = await productsResponse
  if (response.status() === 404) {
    const body: unknown = await response.json()
    if (
      typeof body === 'object'
      && body !== null
      && 'code' in body
      && body.code === 'PGRST205'
    ) {
      test.skip(true, 'Apply the Supabase migrations and seed before running the live catalog journey.')
    }
  }
  expect(response.ok(), 'The Supabase products request should succeed.').toBe(true)

  const products: unknown = await response.json()
  test.skip(
    Array.isArray(products) && products.length === 0,
    'Run supabase/seed.sql before testing the catalog journey.',
  )

  await page.getByRole('link', { name: 'Boutique' }).click()
  await expect(page.getByRole('heading', { name: 'Tous les produits' })).toBeVisible()
  await page.getByRole('button', { name: /Ajouter au panier/ }).first().click()
  await expect(page.getByText('Quantité : 1')).toBeVisible()
})
