import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import {
  AssistantService,
  type AssistantHistoryMessage,
  type AssistantActionType,
} from '~/services/AssistantService'

interface AssistantUiMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
}

const service = new AssistantService()

export function useAssistant() {
  const route = useRoute()
  const isOpen = ref(false)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const messages = ref<AssistantUiMessage[]>([
    {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: 'Hi! I can help you find hotels, offers, and booking guidance.',
    },
  ])
  const suggestions = ref<string[]>([
    'Find hotels in Paris',
    'Show active offers',
    'Help me with booking steps',
  ])
  const quickPrompts = ref<string[]>([])
  const actions = ref<
    Array<{
      type: AssistantActionType
      label: string
      payload?: Record<string, string | number>
    }>
  >([])
  const hintsLoaded = ref(false)

  async function loadHints() {
    if (hintsLoaded.value) return
    try {
      const hints = await service.getHints()
      quickPrompts.value = hints.quickPrompts.length ? hints.quickPrompts : quickPrompts.value
      hintsLoaded.value = true
    } catch {
      hintsLoaded.value = true
    }
  }

  watch(isOpen, (open) => {
    if (open) {
      void loadHints()
    }
  })

  async function sendMessage(content: string) {
    const trimmed = content.trim()
    if (!trimmed || loading.value) return

    error.value = null
    messages.value.push({ id: crypto.randomUUID(), role: 'user', content: trimmed })
    loading.value = true

    try {
      const history: AssistantHistoryMessage[] = messages.value.slice(-10).map((msg) => ({
        role: msg.role,
        content: msg.content,
      }))
      const response = await service.chat({
        message: trimmed,
        history,
        context: { page: route.path },
      })
      messages.value.push({
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response.reply,
      })
      suggestions.value =
        response.suggestions?.length > 0 ? response.suggestions : suggestions.value
      actions.value = response.actions ?? []
    } catch (err: any) {
      error.value = err?.message || 'Assistant is temporarily unavailable.'
      messages.value.push({
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'I am temporarily unavailable. Please try again in a moment.',
      })
      actions.value = [
        { type: 'open_help', label: 'Help center' },
        { type: 'open_contact', label: 'Contact support' },
      ]
    } finally {
      loading.value = false
    }
  }

  async function applyAction(action: { type: AssistantActionType; payload?: Record<string, string | number> }) {
    if (action.type === 'open_offers') {
      await navigateTo('/offers')
      return
    }
    if (action.type === 'open_help') {
      await navigateTo('/help-center')
      return
    }
    if (action.type === 'open_contact') {
      await navigateTo('/contact')
      return
    }
    if (action.type === 'open_hotels') {
      const city = typeof action.payload?.city === 'string' ? action.payload.city : undefined
      if (city) {
        await navigateTo(`/hotels?city=${encodeURIComponent(city)}`)
      } else {
        await navigateTo('/hotels')
      }
    }
  }

  function toggle() {
    isOpen.value = !isOpen.value
  }

  return {
    isOpen,
    loading,
    error,
    messages,
    suggestions,
    quickPrompts,
    actions,
    sendMessage,
    applyAction,
    toggle,
  }
}
