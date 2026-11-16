import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getSupabaseClient } from '@/lib/supabase'

function SignupPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setMessage(null)
    setSubmitting(true)

    try {
      const { data, error: authError } = await getSupabaseClient().auth.signUp({ email, password })
      if (authError) {
        throw authError
      }

      if (data.session) {
        navigate('/account', { replace: true })
      } else {
        setMessage('Compte créé. Consultez votre e-mail pour confirmer votre inscription.')
      }
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : 'La création du compte a échoué.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <p className="eyebrow">Votre espace</p>
        <h1>Créer un compte</h1>
        <label className="auth-field">
          Adresse e-mail
          <input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <label className="auth-field">
          Mot de passe
          <input
            type="password"
            autoComplete="new-password"
            minLength={6}
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        {error && <p className="auth-error" role="alert">{error}</p>}
        {message && <p className="auth-success" role="status">{message}</p>}
        <button className="add-button" type="submit" disabled={submitting}>
          {submitting ? 'Création…' : 'Créer mon compte'}
        </button>
        <p className="auth-switch">
          Déjà inscrit ? <Link to="/login">Se connecter</Link>
        </p>
      </form>
    </main>
  )
}

export default SignupPage
