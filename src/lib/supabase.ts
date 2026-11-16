import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/database.types'

let client: SupabaseClient<Database> | undefined

export function getSupabaseClient() {
  if (client) {
    return client
  }

  const url = import.meta.env.VITE_SUPABASE_URL
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    throw new Error(
      'Configuration Supabase manquante. Copie .env.example vers .env.local et renseigne les variables.',
    )
  }

  client = createClient<Database>(url, anonKey)
  return client
}
