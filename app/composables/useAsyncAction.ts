import { ref } from 'vue'

function toErrorMessage(error: unknown, fallback = 'Something went wrong') {
  if (error instanceof Error && error.message) {
    return error.message
  }

  return fallback
}

export function useAsyncAction() {
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function execute<T>(action: () => Promise<T>, fallback?: T) {
    loading.value = true
    error.value = null

    try {
      return await action()
    } catch (cause) {
      error.value = toErrorMessage(cause)

      if (arguments.length > 1) {
        return fallback as T
      }

      throw cause
    } finally {
      loading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    loading,
    error,
    execute,
    clearError,
  }
}
