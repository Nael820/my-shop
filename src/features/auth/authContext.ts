import { createContext } from 'react'
import type { Session } from '@supabase/supabase-js'

export type AuthValue = {
  session: Session | null
  booted: boolean
  error: Error | null
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthValue | undefined>(undefined)
