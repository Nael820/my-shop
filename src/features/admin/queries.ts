import { useQuery } from '@tanstack/react-query'
import { getSupabaseClient } from '@/lib/supabase'

export const adminQueryKeys = {
  role: (userId: string) => ['profile', userId, 'role'] as const,
}

export async function fetchIsAdmin(userId: string): Promise<boolean> {
  const { data, error } = await getSupabaseClient()
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }
  if (!data) {
    throw new Error('Profil introuvable. Vérifie que la migration des rôles admin a été appliquée.')
  }
  if (data.role !== 'admin' && data.role !== 'customer') {
    throw new Error(`Rôle utilisateur inconnu : ${data.role}`)
  }

  return data.role === 'admin'
}

export function useIsAdminQuery(userId: string | undefined) {
  return useQuery({
    queryKey: adminQueryKeys.role(userId ?? ''),
    queryFn: () => {
      if (!userId) {
        throw new Error('Une session est requise pour vérifier les droits.')
      }
      return fetchIsAdmin(userId)
    },
    enabled: Boolean(userId),
  })
}
