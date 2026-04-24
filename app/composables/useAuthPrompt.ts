type AuthPromptOptions = {
  redirectTo?: string
  title?: string
  message?: string
}

export function useAuthPrompt() {
  const isOpen = useState('auth_prompt_open', () => false)
  const redirectTo = useState('auth_prompt_redirect_to', () => '/wishlist')
  const title = useState('auth_prompt_title', () => 'Save your favorite hotels')
  const message = useState(
    'auth_prompt_message',
    () => 'Create an account or sign in to keep your wishlist available whenever you come back.',
  )
  const icon = useState('auth_prompt_icon', () => 'favorite')
  const eyebrow = useState('auth_prompt_eyebrow', () => 'Wishlist access')

  function open(options: AuthPromptOptions & { icon?: string; eyebrow?: string } = {}) {
    redirectTo.value = options.redirectTo || '/wishlist'
    title.value = options.title || 'Save your favorite hotels'
    message.value =
      options.message ||
      'Create an account or sign in to keep your wishlist available whenever you come back.'
    icon.value = options.icon || 'favorite'
    eyebrow.value = options.eyebrow || 'Wishlist access'
    isOpen.value = true
  }

  function close() {
    isOpen.value = false
  }

  return {
    isOpen,
    redirectTo,
    title,
    message,
    icon,
    eyebrow,
    open,
    close,
  }
}
