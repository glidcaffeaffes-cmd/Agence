const variableColor = (token: string) => `rgb(var(${token}) / <alpha-value>)`

export const tailwindThemeExtend = {
  colors: {
    'primary-container': variableColor('--tw-primary-container'),
    'on-tertiary-fixed-variant': variableColor('--tw-on-tertiary-fixed-variant'),
    'secondary-container': variableColor('--tw-secondary-container'),
    surface: variableColor('--tw-surface'),
    'on-secondary-container': variableColor('--tw-on-secondary-container'),
    'secondary-fixed': variableColor('--tw-secondary-fixed'),
    'on-primary-fixed-variant': variableColor('--tw-on-primary-fixed-variant'),
    'surface-container': variableColor('--tw-surface-container'),
    'on-surface': variableColor('--tw-on-surface'),
    'surface-variant': variableColor('--tw-surface-variant'),
    'on-primary': variableColor('--tw-on-primary'),
    'on-secondary': variableColor('--tw-on-secondary'),
    'surface-container-lowest': variableColor('--tw-surface-container-lowest'),
    primary: variableColor('--tw-primary'),
    'inverse-surface': variableColor('--tw-inverse-surface'),
    'secondary-fixed-dim': variableColor('--tw-secondary-fixed-dim'),
    'on-tertiary': variableColor('--tw-on-tertiary'),
    'on-secondary-fixed-variant': variableColor('--tw-on-secondary-fixed-variant'),
    'error-container': variableColor('--tw-error-container'),
    'on-surface-variant': variableColor('--tw-on-surface-variant'),
    'surface-tint': variableColor('--tw-surface-tint'),
    'on-background': variableColor('--tw-on-background'),
    error: variableColor('--tw-error'),
    tertiary: variableColor('--tw-tertiary'),
    'tertiary-fixed': variableColor('--tw-tertiary-fixed'),
    'inverse-primary': variableColor('--tw-inverse-primary'),
    'on-error-container': variableColor('--tw-on-error-container'),
    'on-tertiary-fixed': variableColor('--tw-on-tertiary-fixed'),
    secondary: variableColor('--tw-secondary'),
    outline: variableColor('--tw-outline'),
    'surface-dim': variableColor('--tw-surface-dim'),
    'surface-container-highest': variableColor('--tw-surface-container-highest'),
    'primary-fixed': variableColor('--tw-primary-fixed'),
    'on-secondary-fixed': variableColor('--tw-on-secondary-fixed'),
    'inverse-on-surface': variableColor('--tw-inverse-on-surface'),
    'on-primary-container': variableColor('--tw-on-primary-container'),
    'on-primary-fixed': variableColor('--tw-on-primary-fixed'),
    'on-tertiary-container': variableColor('--tw-on-tertiary-container'),
    'outline-variant': variableColor('--tw-outline-variant'),
    'tertiary-fixed-dim': variableColor('--tw-tertiary-fixed-dim'),
    'tertiary-container': variableColor('--tw-tertiary-container'),
    'surface-container-low': variableColor('--tw-surface-container-low'),
    background: variableColor('--tw-background'),
    'surface-container-high': variableColor('--tw-surface-container-high'),
    'on-error': variableColor('--tw-on-error'),
    'primary-fixed-dim': variableColor('--tw-primary-fixed-dim'),
    'surface-bright': variableColor('--tw-surface-bright')
  },
  borderRadius: {
    DEFAULT: '0.25rem',
    lg: '0.5rem',
    xl: '0.75rem',
    full: '9999px'
  },
  fontFamily: {
    sans: ['var(--font-family-base)'],
    headline: ['var(--font-family-heading)'],
    body: ['var(--font-family-base)'],
    label: ['var(--font-family-base)'],
    mono: ['var(--font-family-mono)']
  }
} as const

export const tailwindRuntimeConfig = {
  darkMode: 'class',
  theme: {
    extend: tailwindThemeExtend
  }
} as const

export const tailwindRuntimeConfigScript = `tailwind.config = ${JSON.stringify(tailwindRuntimeConfig)}`
