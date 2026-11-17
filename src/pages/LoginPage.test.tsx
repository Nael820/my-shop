import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import LoginPage from '@/pages/LoginPage'
import { renderWithProviders } from '@/test/renderWithProviders'

const { signInWithPassword } = vi.hoisted(() => ({
  signInWithPassword: vi.fn(),
}))

vi.mock('@/lib/supabase', () => ({
  getSupabaseClient: () => ({
    auth: { signInWithPassword },
  }),
}))

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows an error when credentials are rejected', async () => {
    const user = userEvent.setup()
    signInWithPassword.mockResolvedValue({ error: new Error('Identifiants invalides') })
    renderWithProviders(<LoginPage />, '/login')

    await user.type(screen.getByLabelText('Adresse e-mail'), 'nael@example.com')
    await user.type(screen.getByLabelText('Mot de passe'), 'incorrect')
    await user.click(screen.getByRole('button', { name: 'Se connecter' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Identifiants invalides')
  })
})
