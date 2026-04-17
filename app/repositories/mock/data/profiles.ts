import type { Profile } from '~/types/models'

export const mockProfiles: Profile[] = [
  { id: 1, accountId: 1, firstName: 'Jean', lastName: 'Dupont', address: '15 Rue de Rivoli, Paris', phone: '+33 6 12 34 56 78', photo: 'https://i.pravatar.cc/150?u=jean' },
  { id: 2, accountId: 2, firstName: 'Marie', lastName: 'Lefevre', address: '8 Avenue Foch, Lyon', phone: '+33 6 23 45 67 89', photo: 'https://i.pravatar.cc/150?u=marie' },
  { id: 3, accountId: 3, firstName: 'Pierre', lastName: 'Martin', address: '42 Boulevard Haussmann, Paris', phone: '+33 6 34 56 78 90', photo: 'https://i.pravatar.cc/150?u=pierre' },
  { id: 4, accountId: 4, firstName: 'Sophie', lastName: 'Bernard', address: '3 Place Bellecour, Lyon', phone: '+33 6 45 67 89 01', photo: 'https://i.pravatar.cc/150?u=sophie' },
  { id: 5, accountId: 5, firstName: 'Lucas', lastName: 'Moreau', address: '27 Rue de la République, Marseille', phone: '+33 6 56 78 90 12', photo: 'https://i.pravatar.cc/150?u=lucas' },
  { id: 6, accountId: 100, firstName: 'Admin', lastName: 'VoyageHub', address: 'HQ', phone: '+33 1 00 00 00 00', photo: 'https://i.pravatar.cc/150?u=admin' },
]
