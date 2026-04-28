import type { ToastMessageOptions } from 'primevue/toast'
import { useToast } from 'primevue/usetoast'

export type ToastSeverity = 'success' | 'info' | 'warn' | 'error'

export interface ToastPayload {
  severity: ToastSeverity
  summary: string
  detail: string
  life?: number
  sticky?: boolean
}

function normalizeSummary(severity: ToastSeverity) {
  switch (severity) {
    case 'success':
      return 'Success'
    case 'info':
      return 'Info'
    case 'warn':
      return 'Warning'
    case 'error':
      return 'Error'
  }
}

export function useAppToast() {
  function resolveToastService() {
    if (!import.meta.client) {
      return null
    }

    try {
      return useToast()
    } catch {
      try {
        const nuxtApp = useNuxtApp()
        return nuxtApp.vueApp.config.globalProperties.$toast as
          | { add: (message: ToastMessageOptions) => void }
          | undefined
          | null
      } catch {
        return null
      }
    }
  }

  function show(payload: ToastPayload) {
    if (!import.meta.client) {
      return
    }

    const toast = resolveToastService()
    if (!toast) {
      return
    }

    try {
      const message: ToastMessageOptions = {
        severity: payload.severity,
        summary: payload.summary || normalizeSummary(payload.severity),
        detail: payload.detail,
        life: payload.sticky ? undefined : (payload.life ?? 4500),
        sticky: payload.sticky ?? false,
      }

      toast.add(message)
    } catch {
      // Do not break user flows if ToastService is temporarily unavailable.
    }
  }

  function success(detail: string, summary = 'Success', life?: number) {
    show({ severity: 'success', summary, detail, life })
  }

  function info(detail: string, summary = 'Info', life?: number) {
    show({ severity: 'info', summary, detail, life })
  }

  function warn(detail: string, summary = 'Warning', life?: number) {
    show({ severity: 'warn', summary, detail, life })
  }

  function error(detail: string, summary = 'Error', life?: number) {
    show({ severity: 'error', summary, detail, life })
  }

  return {
    show,
    success,
    info,
    warn,
    error,
  }
}
