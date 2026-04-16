import type { Account } from '~/types/models'

export const mockAccounts: Account[] = [
  { id: 1, email: 'jean.dupont@email.com', password: 'hashed_password_1', registrationDate: '2025-03-15', active: true, role: 'client' },
  { id: 2, email: 'marie.lefevre@email.com', password: 'hashed_password_2', registrationDate: '2025-05-22', active: true, role: 'client' },
  { id: 3, email: 'pierre.martin@email.com', password: 'hashed_password_3', registrationDate: '2025-07-10', active: true, role: 'client' },
  { id: 4, email: 'sophie.bernard@email.com', password: 'hashed_password_4', registrationDate: '2025-09-01', active: true, role: 'client' },
  { id: 5, email: 'lucas.moreau@email.com', password: 'hashed_password_5', registrationDate: '2025-11-18', active: false, role: 'client' },
  { id: 100, email: 'admin@voyagehub.com', password: 'admin_hashed', registrationDate: '2024-01-01', active: true, role: 'admin' },
]
