import type { MailConfigStatus, MailTemplate } from '~/types/models'
import { apiRequest, invalidateApiCache } from '~/repositories/api/client'

export class MailAdminService {
  async getConfig(): Promise<MailConfigStatus> {
    return apiRequest<MailConfigStatus>('/mail/config', { method: 'GET' })
  }

  async sendTestEmail(payload: { to?: string; templateSlug?: string }) {
    return apiRequest<{ success: boolean; to: string }>('/mail/test', {
      method: 'POST',
      body: payload,
    })
  }

  async getTemplates(): Promise<MailTemplate[]> {
    return apiRequest<MailTemplate[]>('/mail/templates', { method: 'GET' })
  }

  async updateTemplate(
    id: number,
    payload: Partial<Pick<MailTemplate, 'name' | 'description' | 'trigger' | 'subject' | 'body' | 'recipients' | 'type' | 'isActive' | 'channel'>>,
  ): Promise<MailTemplate> {
    const updated = await apiRequest<MailTemplate>(`/mail/templates/${id}`, {
      method: 'PATCH',
      body: payload,
    })
    invalidateApiCache('/mail/templates')
    return updated
  }
}
