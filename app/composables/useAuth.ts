import { ref, computed } from 'vue'
import type { Account, Profile } from '~/types/models'
import { ProfileMapper } from '~/mappers'
import { useCookie } from '#app'
import { AccountService } from '~/services'

const service = new AccountService()

export function useAuth() {
  const currentAccount = useState<Account | null>('auth_account', () => null)
  const currentProfile = useState<Profile | null>('auth_profile', () => null)

  async function hydrateProfile(account: Account | null) {
    if (!account) {
      currentProfile.value = null
      return
    }

    const profile = await service.getProfile(account.id)
    currentProfile.value = ProfileMapper.merge(profile, account)
  }

  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => currentAccount.value !== null)
  const isAdmin = computed(() => currentAccount.value?.role === 'admin')
  const accountId = computed(() => currentAccount.value?.id ?? 0)

  async function login(email: string, password: string) {
    loading.value = true
    error.value = null
    try {
      const normalizedEmail = email.trim().toLowerCase()
      const account = await service.login(normalizedEmail, password)
      if (!account) {
        error.value = 'Invalid email or password'
        return false
      }

      const profile = await service.getProfile(account.id)
      const mergedProfile = ProfileMapper.merge(profile, account)
      
      currentProfile.value = mergedProfile
      currentAccount.value = account
      
      const authCookie = useCookie<{ account: Account, profile: Profile | null } | null>('voyagehub_auth', {
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      })
      authCookie.value = { account, profile: mergedProfile }

      return true
    } catch (e: any) {
      error.value = e.message
      return false
    } finally {
      loading.value = false
    }
  }

  async function loginGoogle(data: { email: string; firstName: string; lastName: string; uid: string }) {
    loading.value = true
    error.value = null
    try {
      const account = await service.loginGoogle(data)
      if (!account) {
        error.value = 'Failed to sign in with Google'
        return false
      }

      const profile = await service.getProfile(account.id)
      const mergedProfile = ProfileMapper.merge(profile, account)
      
      currentProfile.value = mergedProfile
      currentAccount.value = account
      
      const authCookie = useCookie<{ account: Account, profile: Profile | null } | null>('voyagehub_auth', {
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      })
      authCookie.value = { account, profile: mergedProfile }

      return true
    } catch (e: any) {
      error.value = e.message
      return false
    } finally {
      loading.value = false
    }
  }

  async function register(email: string, password: string, firstName: string, lastName: string) {
    loading.value = true
    error.value = null
    try {
      const normalizedEmail = email.trim().toLowerCase()
      const account = await service.register(normalizedEmail, password)

      const profile = await service.createProfile(account.id, {
        firstName,
        lastName,
        notificationsReservation: true,
        notificationsPromotion: false,
        email: account.email,
        role: account.role,
      })
      const mergedProfile = ProfileMapper.merge(profile, account)
      currentProfile.value = mergedProfile
      currentAccount.value = account
      
      const authCookie = useCookie<{ account: Account, profile: Profile | null } | null>('voyagehub_auth', {
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      })
      authCookie.value = { account, profile: mergedProfile }

      return true
    } catch (e: any) {
      error.value = e.message
      return false
    } finally {
      loading.value = false
    }
  }

  function logout() {
    currentAccount.value = null
    currentProfile.value = null
    const authCookie = useCookie('voyagehub_auth')
    authCookie.value = null
  }

  async function updateProfile(data: Partial<Profile>) {
    if (!currentAccount.value) {
      return false
    }

    loading.value = true
    error.value = null
    try {
      const updatedProfile = await service.updateProfile(currentAccount.value.id, data)
      currentProfile.value = ProfileMapper.merge(updatedProfile, currentAccount.value)
      return true
    } catch (e: any) {
      error.value = e.message
      return false
    } finally {
      loading.value = false
    }
  }

  async function changePassword(oldPassword: string, newPassword: string) {
    if (!currentAccount.value) {
      return false
    }

    loading.value = true
    error.value = null
    try {
      await service.changePassword(currentAccount.value.id, oldPassword, newPassword)
      return true
    } catch (e: any) {
      error.value = e.message
      return false
    } finally {
      loading.value = false
    }
  }

  async function demoLoginClient() {
    error.value = 'Demo credentials are disabled. Sign in with a backend account or register a new one.'
    return false
  }

  async function demoLoginAdmin() {
    error.value = 'Demo credentials are disabled. Sign in with a backend admin account.'
    return false
  }

  async function initAuth() {
    const authCookie = useCookie<{ account: Account, profile: Profile | null } | null>('voyagehub_auth', {
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    if (authCookie.value && !currentAccount.value) {
      const data = authCookie.value as any
      const account = data.account || data
      const profile = data.profile || null
      
      currentAccount.value = account
      currentProfile.value = profile
      
      // Refresh in background
      hydrateProfile(account).catch(() => {})
    }
  }

  return {
    currentAccount,
    currentProfile,
    isAuthenticated,
    isAdmin,
    accountId,
    loading,
    error,
    login,
    loginGoogle,
    register,
    logout,
    updateProfile,
    changePassword,
    demoLoginClient,
    demoLoginAdmin,
    initAuth,
  }
}
