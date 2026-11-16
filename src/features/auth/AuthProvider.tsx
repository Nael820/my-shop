import { useEffect, useState, type PropsWithChildren } from 'react'
import type { Session } from '@supabase/supabase-js'
import { getSupabaseClient } from '@/lib/supabase'
import { AuthContext } from '@/features/auth/authContext'

function toError(error: unknown) {
  return error instanceof Error ? error : new Error('Une erreur inattendue est survenue.')
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null)
  const [booted, setBooted] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let active = true
    let unsubscribe: (() => void) | undefined

    void Promise.resolve()
      .then(() => {
        if (!active) {
          return null
        }

        const supabase = getSupabaseClient()
        const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
          if (active) {
            setSession(nextSession)
          }
        })
        unsubscribe = () => data.subscription.unsubscribe()
        return supabase.auth.getSession()
      })
      .then((result) => {
        if (!result) {
          return
        }
        if (result.error) {
          throw result.error
        }
        if (active) {
          setSession(result.data.session)
          setBooted(true)
        }
      })
      .catch((sessionError: unknown) => {
        if (active) {
          setError(toError(sessionError))
          setBooted(true)
        }
      })

    return () => {
      active = false
      unsubscribe?.()
    }
  }, [])

  async function signOut() {
    const { error: signOutError } = await getSupabaseClient().auth.signOut()
    if (signOutError) {
      throw signOutError
    }
  }

  return (
    <AuthContext.Provider value={{ session, booted, error, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
