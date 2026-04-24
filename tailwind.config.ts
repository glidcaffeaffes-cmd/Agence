import type { Config } from 'tailwindcss'
import { tailwindThemeExtend } from './config/tailwind-theme'

export default <Partial<Config>>{
  darkMode: "class",
  theme: {
    extend: tailwindThemeExtend
  }
}
