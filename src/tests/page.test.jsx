import { render, screen } from '@testing-library/react'
import UsersPage from '@/app/page'
import { vi, test, expect } from 'vitest'

vi.mock('@/hooks/use-users-api', () => ({
  useUsersApi: () => ({
    users: [{ id: 1 }, { id: 2 }],
    isLoading: false,
    error: null,
    refetch: vi.fn(),
  }),
}))

test('Renderizar el componente correctamente', () => {
  render(<UsersPage />)

  expect(
    screen.getByText(/2 usuarios cargados desde la api/i)
  ).toBeInTheDocument()
})
