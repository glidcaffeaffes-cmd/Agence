import { ref, computed } from 'vue'
import type { Account, Profile } from '~/types/models'
import { ApiAccountRepository } from '~/repositories/api'

const repo = new ApiAccountRepository()

/** Shared singleton auth state */
const currentAccount = ref<Account | null>(null)
const currentProfile = ref<Profile | null>(null)

export function useAuth() {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => currentAccount.value !== null)
  const isAdmin = computed(() => currentAccount.value?.role === 'admin')
  const accountId = computed(() => currentAccount.value?.id ?? 0)

  async function login(email: string, password: string) {
    loading.value = true
    error.value = null
    try {
      const account = await repo.authenticate(email, password)
      if (!account) { error.value = 'Invalid email or password'; return false }
      currentAccount.value = account
      currentProfile.value = await repo.getProfile(account.id)
      return true
    }
    catch (e: any) { error.value = e.message; return false }
    finally { loading.value = false }
  }

  async function register(email: string, password: string, firstName: string, lastName: string) {
    loading.value = true
    error.value = null
    try {
      const account = await repo.create({ email, password, active: true, role: 'client' })
      currentAccount.value = account
      return true
    }
    catch (e: any) { error.value = e.message; return false }
    finally { loading.value = false }
  }

  function logout() {
    currentAccount.value = null
    currentProfile.value = null
  }

  async function updateProfile(data: Partial<Profile>) {
    if (!currentAccount.value) return false
    loading.value = true
    error.value = null
    try {
      const updatedProfile = await repo.updateProfile(currentAccount.value.id, data)
      currentProfile.value = updatedProfile
      return true
    }
    catch (e: any) { error.value = e.message; return false }
    finally { loading.value = false }
  }

  /** Auto-login as client for demo */
  async function demoLoginClient() {
    return login('jean.dupont@email.com', 'demo')
  }

  /** Auto-login as admin for demo */
  async function demoLoginAdmin() {
    return login('admin@voyagehub.com', 'demo')
  }

  return {
    currentAccount, currentProfile,
    isAuthenticated, isAdmin, accountId,
    loading, error,
    login, register, logout, updateProfile, demoLoginClient, demoLoginAdmin,
  }
}
