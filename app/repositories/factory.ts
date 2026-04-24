import { MockHotelRepository } from '~/repositories/mock/MockHotelRepository'
import { MockAccountRepository } from '~/repositories/mock/MockAccountRepository'
import { MockReservationRepository } from '~/repositories/mock/MockReservationRepository'
import { MockOfferRepository } from '~/repositories/mock/MockOfferRepository'
import { MockComplaintRepository } from '~/repositories/mock/MockComplaintRepository'
import { MockRoomRepository } from '~/repositories/mock/MockRoomRepository'
import { MockReviewRepository } from '~/repositories/mock/MockReviewRepository'
import { MockNotificationRepository } from '~/repositories/mock/MockNotificationRepository'
import { MockStatsRepository } from '~/repositories/mock/MockStatsRepository'
import { MockSystemConfigRepository } from '~/repositories/mock/MockSystemConfigRepository'
import {
  ApiHotelRepository,
  ApiAccountRepository,
  ApiReservationRepository,
  ApiOfferRepository,
  ApiComplaintRepository,
  ApiRoomRepository,
  ApiReviewRepository,
  ApiNotificationRepository,
  ApiStatsRepository,
  ApiSystemConfigRepository,
} from '~/repositories/api'
import type { IHotelRepository } from '~/types/interfaces/IHotelRepository'
import type { IAccountRepository } from '~/types/interfaces/IAccountRepository'
import type { IReservationRepository } from '~/types/interfaces/IReservationRepository'
import type { IOfferRepository } from '~/types/interfaces/IOfferRepository'
import type { IComplaintRepository } from '~/types/interfaces/IComplaintRepository'
import type { IRoomRepository } from '~/types/interfaces/IRoomRepository'
import type { IReviewRepository } from '~/types/interfaces/IReviewRepository'
import type { INotificationRepository } from '~/types/interfaces/INotificationRepository'
import type { IStatsRepository } from '~/types/interfaces/IStatsRepository'
import type { ISystemConfigRepository } from '~/types/interfaces/ISystemConfigRepository'

const apiMode = (import.meta.env.NUXT_PUBLIC_USE_API ?? 'true').toLowerCase()

function shouldUseApi() {
  return apiMode !== 'false'
}

export const AdminRepositoryFactory = {
  hotel(): IHotelRepository {
    return shouldUseApi() ? new ApiHotelRepository() : new MockHotelRepository()
  },

  account(): IAccountRepository {
    return shouldUseApi() ? new ApiAccountRepository() : new MockAccountRepository()
  },

  reservation(): IReservationRepository {
    return shouldUseApi() ? new ApiReservationRepository() : new MockReservationRepository()
  },

  offer(): IOfferRepository {
    return shouldUseApi() ? new ApiOfferRepository() : new MockOfferRepository()
  },

  complaint(): IComplaintRepository {
    return shouldUseApi() ? new ApiComplaintRepository() : new MockComplaintRepository()
  },

  room(): IRoomRepository {
    return shouldUseApi() ? new ApiRoomRepository() : new MockRoomRepository()
  },

  review(): IReviewRepository {
    return shouldUseApi() ? new ApiReviewRepository() : new MockReviewRepository()
  },

  notification(): INotificationRepository {
    return shouldUseApi() ? new ApiNotificationRepository() : new MockNotificationRepository()
  },

  stats(): IStatsRepository {
    return shouldUseApi() ? new ApiStatsRepository() : new MockStatsRepository()
  },

  systemConfig(): ISystemConfigRepository {
    return shouldUseApi() ? new ApiSystemConfigRepository() : new MockSystemConfigRepository()
  },
}
