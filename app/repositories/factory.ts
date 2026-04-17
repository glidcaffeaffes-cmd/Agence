/**
 * ─── Repository Factory (Admin) ──────────────────────────────────────────────
 *
 * Central factory that decides whether to use Mock or API repositories.
 *
 * Control via environment variable:
 *   NUXT_PUBLIC_USE_API=true   → uses ApiRepository (real backend)
 *   NUXT_PUBLIC_USE_API=false  → uses MockRepository (fake data) [default]
 *
 * Usage in services:
 *   const service = new HotelService(AdminRepositoryFactory.hotel())
 *
 * Usage in pages (convenience):
 *   import { AdminRepositoryFactory as RF } from '~/repositories/factory'
 *   const hotels = await RF.hotel().getAll()
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { MockHotelRepository }        from '~/repositories/mock/MockHotelRepository'
import { MockAccountRepository }      from '~/repositories/mock/MockAccountRepository'
import { MockReservationRepository }  from '~/repositories/mock/MockReservationRepository'
import { MockOfferRepository }        from '~/repositories/mock/MockOfferRepository'
import { MockComplaintRepository }    from '~/repositories/mock/MockComplaintRepository'

import {
  ApiHotelRepository,
  ApiAccountRepository,
  ApiReservationRepository,
  ApiOfferRepository,
  ApiComplaintRepository,
} from '~/repositories/api'

import type { IHotelRepository }       from '~/types/interfaces/IHotelRepository'
import type { IAccountRepository }     from '~/types/interfaces/IAccountRepository'
import type { IReservationRepository } from '~/types/interfaces/IReservationRepository'
import type { IOfferRepository }       from '~/types/interfaces/IOfferRepository'
import type { IComplaintRepository }   from '~/types/interfaces/IComplaintRepository'

// ---------------------------------------------------------------------------
// Detect mode: default to Mock unless NUXT_PUBLIC_USE_API=true
// ---------------------------------------------------------------------------
function useApi(): boolean {
  // Enforce API usage specifically for the admin panel as requested
  return true
}

// ============================================================================
// Factory
// ============================================================================
export const AdminRepositoryFactory = {
  hotel(): IHotelRepository {
    return useApi() ? new ApiHotelRepository() : new MockHotelRepository()
  },

  account(): IAccountRepository {
    return useApi() ? new ApiAccountRepository() : new MockAccountRepository()
  },

  reservation(): IReservationRepository {
    return useApi() ? new ApiReservationRepository() : new MockReservationRepository()
  },

  offer(): IOfferRepository {
    return useApi() ? new ApiOfferRepository() : new MockOfferRepository()
  },

  complaint(): IComplaintRepository {
    return useApi() ? new ApiComplaintRepository() : new MockComplaintRepository()
  },
}
