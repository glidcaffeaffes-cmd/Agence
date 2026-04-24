import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary-container": "#008283",
        "on-tertiary-fixed-variant": "#584400",
        "secondary-container": "#8fc6fe",
        "surface": "#f5faff",
        "on-secondary-container": "#065283",
        "secondary-fixed": "#cfe5ff",
        "on-primary-fixed-variant": "#004f50",
        "surface-container": "#e7eff6",
        "on-surface": "#151d22",
        "surface-variant": "#dce3eb",
        "on-primary": "#ffffff",
        "on-secondary": "#ffffff",
        "surface-container-lowest": "#ffffff",
        "primary": "#006768",
        "inverse-surface": "#2a3137",
        "secondary-fixed-dim": "#99cbff",
        "on-tertiary": "#ffffff",
        "on-secondary-fixed-variant": "#004a78",
        "error-container": "#ffdad6",
        "on-surface-variant": "#3d4949",
        "surface-tint": "#00696a",
        "on-background": "#151d22",
        "error": "#ba1a1a",
        "tertiary": "#735c10",
        "tertiary-fixed": "#ffe08e",
        "inverse-primary": "#6cd7d7",
        "on-error-container": "#93000a",
        "on-tertiary-fixed": "#241a00",
        "secondary": "#236294",
        "outline": "#6d7979",
        "surface-dim": "#d3dbe2",
        "surface-container-highest": "#dce3eb",
        "primary-fixed": "#8af3f4",
        "on-secondary-fixed": "#001d34",
        "inverse-on-surface": "#eaf2f9",
        "on-primary-container": "#f3fffe",
        "on-primary-fixed": "#002020",
        "on-tertiary-container": "#4f3d00",
        "outline-variant": "#bcc9c8",
        "tertiary-fixed-dim": "#e3c36f",
        "tertiary-container": "#c6a857",
        "surface-container-low": "#edf5fc",
        "background": "#f5faff",
        "surface-container-high": "#e1e9f0",
        "on-error": "#ffffff",
        "primary-fixed-dim": "#6cd7d7",
        "surface-bright": "#f5faff"
      },
      fontFamily: {
        "sans": ["var(--font-family-base)"],
        "headline": ["var(--font-family-heading)"],
        "body": ["var(--font-family-base)"],
        "label": ["var(--font-family-base)"],
        "mono": ["var(--font-family-mono)"]
      }
    }
  }
}
