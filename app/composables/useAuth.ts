import { ref, computed } from 'vue'
import { createUserWithEmailAndPassword, getIdToken, reload, sendEmailVerification, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import type { Account, Profile } from '~/types/models'
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
  const pendingVerificationEmail = useState<string | null>('auth_pending_verification_email', () => null)
  const pendingVerificationPassword = useState<string | null>('auth_pending_verification_password', () => null)

  const isAuthenticated = computed(() => currentAccount.value !== null)
  const isVerified = computed(() => Boolean(currentAccount.value && currentAccount.value.emailVerified))
  const isAdmin = computed(() => currentAccount.value?.role === 'admin')
  const accountId = computed(() => currentAccount.value?.id ?? 0)

  async function login(email: string, password: string) {
    loading.value = true
    error.value = null
    try {
      const normalizedEmail = email.trim().toLowerCase()
      const { $firebaseAuth } = useNuxtApp()
      if (!$firebaseAuth) {
        throw new Error('Firebase authentication is not available')
      }
      const firebaseCredential = await signInWithEmailAndPassword($firebaseAuth, normalizedEmail, password)
      await reload(firebaseCredential.user)
      if (!firebaseCredential.user.emailVerified) {
        pendingVerificationEmail.value = normalizedEmail
        pendingVerificationPassword.value = password
        error.value = 'Please verify your email before accessing your account.'
        return false
      }

      const account = await service.login(normalizedEmail, password)
      if (!account) {
        error.value = 'Invalid email or password'
        return false
      }
      if (!account.emailVerified) {
        try {
          const idToken = await getIdToken(firebaseCredential.user, true)
          await service.syncEmailVerification(account.id, idToken)
          account.emailVerified = true
        } catch {
          // backend sync can be retried later
        }
      }

      const profile = isVirtualAdminAccount(account)
        ? null
        : await service.getProfile(account.id)
      const mergedProfile = profile ? ProfileMapper.merge(profile, account) : null
      
      currentProfile.value = mergedProfile
      currentAccount.value = account
      persistAuthState(account, mergedProfile)
      pendingVerificationEmail.value = null
      pendingVerificationPassword.value = null

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
      const { $firebaseAuth } = useNuxtApp()
      if (!$firebaseAuth) {
        throw new Error('Firebase authentication is not available')
      }
      const firebaseCredential = await createUserWithEmailAndPassword($firebaseAuth, normalizedEmail, password)
      await sendEmailVerification(firebaseCredential.user)
      const account = await service.register(normalizedEmail, password)

      const profile = await service.createProfile(account.id, {
        firstName,
        lastName,
        notificationsReservation: true,
        notificationsPromotion: false,
        email: account.email,
        role: account.role,
      })
      pendingVerificationEmail.value = normalizedEmail
      pendingVerificationPassword.value = password
      currentProfile.value = null
      currentAccount.value = null
      persistAuthState(null, null)
      return true
    } catch (e: any) {
      error.value = e.message
      return false
    } finally {
      loading.value = false
    }
  }

  function logout() {
    const { $firebaseAuth } = useNuxtApp()
    if ($firebaseAuth) {
      signOut($firebaseAuth).catch(() => {})
    }
    currentAccount.value = null
    currentProfile.value = null
    persistAuthState(null, null)
  }

  async function requestPasswordReset(email: string) {
    loading.value = true
    error.value = null
    try {
      await service.requestPasswordReset(email)
      return true
    } catch (e: any) {
      error.value = e.message
      return false
    } finally {
      loading.value = false
    }
  }

  async function resetPassword(token: string, newPassword: string) {
    loading.value = true
    error.value = null
    try {
      await service.resetPassword(token, newPassword)
      return true
    } catch (e: any) {
      error.value = e.message
      return false
    } finally {
      loading.value = false
    }
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
    isDefault?: boolean
  }) {
    if (!currentAccount.value) {
      return null
    }

    loading.value = true
    error.value = null
    try {
      return await service.createPaymentMethod(currentAccount.value.id, data)
    } catch (e: any) {
      error.value = e.message
      return null
    } finally {
      loading.value = false
    }
  }

  async function confirmPaymentMethodSession(sessionId: string) {
    if (!currentAccount.value) {
      return false
    }

    loading.value = true
    error.value = null
    try {
      await service.confirmPaymentMethodSession(currentAccount.value.id, sessionId)
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

  async function resendVerificationEmail() {
    const { $firebaseAuth } = useNuxtApp()
    if (!$firebaseAuth?.currentUser) {
      throw new Error('No verification session found. Please sign in again.')
    }

    await sendEmailVerification($firebaseAuth.currentUser)
  }

  async function refreshVerificationStatus() {
    const { $firebaseAuth } = useNuxtApp()
    if (!$firebaseAuth?.currentUser) {
      return false
    }

    await reload($firebaseAuth.currentUser)
    if (!$firebaseAuth.currentUser.emailVerified) {
      return false
    }

    try {
      const idToken = await getIdToken($firebaseAuth.currentUser, true)
      await service.syncEmailVerification(currentAccount.value?.id ?? null, idToken)
    } catch {
      // Retry on next session.
    }
    if (currentAccount.value) {
      currentAccount.value.emailVerified = true
      persistAuthState(currentAccount.value, currentProfile.value)
    }
    return true
  }

  async function completeVerificationLogin() {
    const verified = await refreshVerificationStatus()
    if (!verified || !pendingVerificationEmail.value || !pendingVerificationPassword.value) {
      return false
    }
    return login(pendingVerificationEmail.value, pendingVerificationPassword.value)
  }

  return {
    currentAccount,
    currentProfile,
    isAuthenticated,
    isVerified,
    isAdmin,
    accountId,
    loading,
    error,
    login,
    loginGoogle,
    register,
    resendVerificationEmail,
    refreshVerificationStatus,
    completeVerificationLogin,
    pendingVerificationEmail,
    pendingVerificationPassword,
    requestPasswordReset,
    resetPassword,
    logout,
    updateProfile,
    createPaymentMethod,
    confirmPaymentMethodSession,
    updatePaymentMethod,
    removePaymentMethod,
    changePassword,
    demoLoginClient,
    demoLoginAdmin,
    initAuth,
  }
}
