/**
 * Services barrel export.
 *
 * Architecture layers:
 *   Pages / Composables / Stores
 *          ↓
 *      **Services**        ← business logic, validation, orchestration
 *          ↓
 *      Repositories        ← data access (Mock / API)
 *          ↓
 *       Mock data / API
 */

export { HotelService }          from './HotelService'
export { ReservationService }    from './ReservationService'
export { AccountService }        from './AccountService'
export { RoomService }           from './RoomService'
export { OfferService }          from './OfferService'
export { ComplaintService }      from './ComplaintService'
export { NotificationService }   from './NotificationService'
export { ReviewService }         from './ReviewService'
export { StatsService }          from './StatsService'
export { SystemConfigService }   from './SystemConfigService'
export { MailAdminService }      from './MailAdminService'
