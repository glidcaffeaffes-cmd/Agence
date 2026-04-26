import { ref, computed } from 'vue'
import type { Account, PaymentMethod, Profile } from '~/types/models'
import { ProfileMapper } from '~/mappers'
import { useCookie } from '#app'
import { AccountService } from '~/services'

const service = new AccountService()

export function useAuth() {
  const currentAccount = useState<Account | null>('auth_account', () => null)
  const currentProfile = useState<Profile | null>('auth_profile', () => null)
  const authCookie = useCookie<{ account: Account, profile: Profile | null } | null>('voyagehub_auth', {
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })

  function persistAuthState(account: Account | null, profile: Profile | null) {
    authCookie.value = account ? { account, profile } : null
  }

  function isVirtualAdminAccount(account: Account | null) {
    return Boolean(account && account.role === 'admin' && account.id < 0)
  }

  async function hydrateProfile(account: Account | null) {
    if (!account) {
      currentProfile.value = null
      persistAuthState(null, null)
      return
    }

    if (isVirtualAdminAccount(account)) {
      currentProfile.value = null
      persistAuthState(account, null)
      return
    }

    try {
      const profile = await service.getProfile(account.id)
      if (profile) {
        currentProfile.value = ProfileMapper.merge(profile, account)
        persistAuthState(account, currentProfile.value)
      }
    } catch (e) {
      // Background refresh failed, keep existing state
      console.warn('Profile hydration failed:', e)
    }
  }

  async function refreshProfile() {
    if (!currentAccount.value) {
      currentProfile.value = null
      persistAuthState(null, null)
      return null
    }

    if (isVirtualAdminAccount(currentAccount.value)) {
      currentProfile.value = null
      persistAuthState(currentAccount.value, null)
      return null
    }

    try {
      const profile = await service.getProfile(currentAccount.value.id)
      if (profile) {
        const mergedProfile = ProfileMapper.merge(profile, currentAccount.value)
        currentProfile.value = mergedProfile
        persistAuthState(currentAccount.value, mergedProfile)
        return mergedProfile
      }
    } catch (e) {
      console.warn('Profile refresh failed:', e)
    }
    
    return currentProfile.value
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

      const profile = isVirtualAdminAccount(account)
        ? null
        : await service.getProfile(account.id)
      const mergedProfile = profile ? ProfileMapper.merge(profile, account) : null
      
      currentProfile.value = mergedProfile
      currentAccount.value = account
      persistAuthState(account, mergedProfile)

      return true
    } catch (e: any) {
      error.value = e.message
      return false
    } finally {
      loading.value = false
    }
  }

  async function loginGoogle(data: { email: string; firstName: string; lastName: string; uid: string; photo?: string }) {
    loading.value = true
    error.value = null
    try {
      const account = await service.loginGoogle({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        uid: data.uid
      })
      if (!account) {
        error.value = 'Failed to sign in with Google'
        return false
      }

      let profile = await service.getProfile(account.id)
      
      if (data.photo && (!profile || profile.photo !== data.photo)) {
        profile = await service.updateProfile(account.id, { photo: data.photo })
      }

      const mergedProfile = ProfileMapper.merge(profile, account)
      
      currentProfile.value = mergedProfile
      currentAccount.value = account
      persistAuthState(account, mergedProfile)

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
      persistAuthState(account, mergedProfile)

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
    persistAuthState(null, null)
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
      persistAuthState(currentAccount.value, currentProfile.value)
      return true
    } catch (e: any) {
      error.value = e.message
      return false
    } finally {
      loading.value = false
    }
  }

  async function createPaymentMethod(data: {
    cardholderName: string
    brand: PaymentMethod['brand']
    cardNumber: string
    expiryMonth: number
    expiryYear: number
    isDefault?: boolean
  }) {
    if (!currentAccount.value) {
      return false
    }

    loading.value = true
    error.value = null
    try {
      await service.createPaymentMethod(currentAccount.value.id, data)
      await refreshProfile()
      return true
    } catch (e: any) {
      error.value = e.message
      return false
    } finally {
      loading.value = false
    }
  }

  async function updatePaymentMethod(
    paymentMethodId: number,
    data: Partial<{
      cardholderName: string
      brand: PaymentMethod['brand']
      cardNumber: string
      expiryMonth: number
      expiryYear: number
      isDefault: boolean
    }>,
  ) {
    if (!currentAccount.value) {
      return false
    }

    loading.value = true
    error.value = null
    try {
      await service.updatePaymentMethod(currentAccount.value.id, paymentMethodId, data)
      await refreshProfile()
      return true
    } catch (e: any) {
      error.value = e.message
      return false
    } finally {
      loading.value = false
    }
  }

  async function removePaymentMethod(paymentMethodId: number) {
    if (!currentAccount.value) {
      return false
    }

    loading.value = true
    error.value = null
    try {
      await service.removePaymentMethod(currentAccount.value.id, paymentMethodId)
      await refreshProfile()
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
    createPaymentMethod,
    updatePaymentMethod,
    removePaymentMethod,
    changePassword,
    demoLoginClient,
    demoLoginAdmin,
    initAuth,
  }
}
