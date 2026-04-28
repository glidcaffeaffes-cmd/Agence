export interface MailConfigStatus {
  provider: string
  host: string
  port: number
  secure: boolean
  user: string
  fromEmail: string
  replyTo: string
  supportEmail: string
  appWebUrl: string
  connected: boolean
  errorMessage?: string
}
