import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getSupabaseClient } from '@/lib/supabase'
import { productQueryKeys } from '@/features/products/queries'
import type { CreateProductInput } from '@/types/ecommerce'

type UpdateProductVariables = {
  id: string
  product: CreateProductInput
}

function toProductRow(product: CreateProductInput) {
  return {
    slug: product.slug,
    name: product.name,
    category: product.category ?? null,
    description: product.description ?? null,
    image_url: product.image ?? null,
    price: product.price,
    in_stock: product.inStock,
    badge: product.badge ?? null,
  }
}

export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (product: CreateProductInput) => {
      const { error } = await getSupabaseClient()
        .from('products')
        .insert(toProductRow(product))
      if (error) {
        throw new Error(error.message)
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: productQueryKeys.all }),
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, product }: UpdateProductVariables) => {
      const { error } = await getSupabaseClient()
        .from('products')
        .update(toProductRow(product))
        .eq('id', id)
      if (error) {
        throw new Error(error.message)
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: productQueryKeys.all }),
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await getSupabaseClient()
        .from('products')
        .delete()
        .eq('id', id)
      if (error) {
        throw new Error(error.message)
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: productQueryKeys.all }),
  })
}
