import { useQuery } from '@tanstack/react-query'
import type { Product } from '@/types/ecommerce'
import { getSupabaseClient } from '@/lib/supabase'

export const productQueryKeys = {
  all: ['products'] as const,
  detail: (slug: string) => ['products', { slug }] as const,
}

export function mapProduct(row: {
  id: string
  slug: string
  name: string
  category: string | null
  description: string | null
  image_url: string | null
  price: number
  in_stock: boolean
  badge: string | null
}): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category ?? undefined,
    description: row.description ?? undefined,
    image: row.image_url ?? undefined,
    price: row.price,
    inStock: row.in_stock,
    badge: row.badge ?? undefined,
  }
}

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await getSupabaseClient()
    .from('products')
    .select('*')
    .order('name')

  if (error) {
    throw new Error(error.message)
  }

  return data.map(mapProduct)
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await getSupabaseClient()
    .from('products')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  return data ? mapProduct(data) : null
}

export function useProductsQuery() {
  return useQuery({
    queryKey: productQueryKeys.all,
    queryFn: fetchProducts,
  })
}

export function useProductQuery(slug: string) {
  return useQuery({
    queryKey: productQueryKeys.detail(slug),
    queryFn: () => fetchProductBySlug(slug),
    enabled: slug.length > 0,
  })
}
