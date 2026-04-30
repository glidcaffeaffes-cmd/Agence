type AuthPromptOptions = {
  redirectTo?: string
  title?: string
  message?: string
  titleKey?: string
  messageKey?: string
  eyebrowKey?: string
}

export function useAuthPrompt() {
  const { t } = useAppI18n()
  const isOpen = useState('auth_prompt_open', () => false)
  const redirectTo = useState('auth_prompt_redirect_to', () => '/wishlist')
  const title = useState('auth_prompt_title', () => t('authPrompt.defaultTitle'))
  const message = useState(
    'auth_prompt_message',
    () => t('authPrompt.defaultMessage'),
  )
  const icon = useState('auth_prompt_icon', () => 'favorite')
  const eyebrow = useState('auth_prompt_eyebrow', () => t('authPrompt.defaultEyebrow'))

  function open(options: AuthPromptOptions & { icon?: string; eyebrow?: string } = {}) {
    redirectTo.value = options.redirectTo || '/wishlist'
    title.value =
      options.title ||
      (options.titleKey ? t(options.titleKey) : t('authPrompt.defaultTitle'))
    message.value =
      options.message ||
      (options.messageKey
        ? t(options.messageKey)
        : t('authPrompt.defaultMessage'))
    icon.value = options.icon || 'favorite'
    eyebrow.value =
      options.eyebrow ||
      (options.eyebrowKey
        ? t(options.eyebrowKey)
        : t('authPrompt.defaultEyebrow'))
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
