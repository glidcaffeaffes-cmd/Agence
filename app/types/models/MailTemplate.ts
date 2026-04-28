export interface MailTemplate {
  id: number
  slug: string
  name: string
  description?: string | null
  trigger: string
  channel: 'EMAIL' | 'SMS'
  subject?: string | null
  body: string
  recipients?: string | null
  type?: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}
