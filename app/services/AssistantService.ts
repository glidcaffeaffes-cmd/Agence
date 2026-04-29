import { apiRequest } from '~/repositories/api/client'

export interface AssistantHistoryMessage {
  role: 'user' | 'assistant'
  content: string
}

export type AssistantActionType =
  | 'open_hotels'
  | 'open_offers'
  | 'open_help'
  | 'open_contact'

export interface AssistantChatResponse {
  reply: string
  suggestions: string[]
  actions: Array<{
    type: AssistantActionType
    label: string
    payload?: Record<string, string | number>
  }>
}

export interface AssistantHintsResponse {
  quickPrompts: string[]
  destinations: string[]
}

export interface AssistantChatRequest {
  message: string
  history?: AssistantHistoryMessage[]
  context?: { page?: string }
}

export class AssistantService {
  async getHints() {
    return apiRequest<AssistantHintsResponse>('/assistant/hints', {
      method: 'GET',
      toast: {
        silentSuccess: true,
        silentError: true,
      },
    })
  }

  async chat(payload: AssistantChatRequest) {
    return apiRequest<AssistantChatResponse>('/assistant/chat', {
      method: 'POST',
      body: payload,
      toast: {
        silentSuccess: true,
        silentError: true,
      },
    })
  }
}
