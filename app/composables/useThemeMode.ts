import { computed } from "vue";

export type ThemeMode = "light" | "dark" | "system";
export type ResolvedThemeMode = "light" | "dark";

const THEME_COOKIE = "voyagehub_theme";
const THEME_STORAGE_KEY = "voyagehub-theme";

let mediaQuery: MediaQueryList | null = null;
let mediaQueryAttached = false;

function isThemeMode(value: unknown): value is ThemeMode {
  return value === "light" || value === "dark" || value === "system";
}

export function useThemeMode() {
  const mode = useState<ThemeMode>("app-theme-mode", () => "system");
  const initialized = useState<boolean>("app-theme-initialized", () => false);
  const systemPrefersDark = useState<boolean>(
    "app-theme-system-prefers-dark",
    () => false,
  );
  const themeCookie = useCookie<ThemeMode>(THEME_COOKIE, {
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
    default: () => "system",
  });

  const resolvedTheme = computed<ResolvedThemeMode>(() => {
    if (mode.value === "system") {
      return systemPrefersDark.value ? "dark" : "light";
    }
    return mode.value;
  });

  function syncDocumentState() {
    if (!import.meta.client) {
      return;
    }

    const root = document.documentElement;
    root.dataset.themePreference = mode.value;
    root.dataset.themeResolved = resolvedTheme.value;
    root.style.colorScheme = resolvedTheme.value;
  }

  function persistTheme() {
    themeCookie.value = mode.value;

    if (!import.meta.client) {
      return;
    }

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, mode.value);
    } catch {
      // Ignore storage failures and keep the selected theme in memory.
    }
  }

  function refreshSystemPreference() {
    if (!import.meta.client) {
      systemPrefersDark.value = false;
      return;
    }

    mediaQuery ??= window.matchMedia("(prefers-color-scheme: dark)");
    systemPrefersDark.value = mediaQuery.matches;
  }

  function attachSystemListener() {
    if (!import.meta.client || mediaQueryAttached) {
      return;
    }

    mediaQuery ??= window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", () => {
      refreshSystemPreference();
      syncDocumentState();
    });
    mediaQueryAttached = true;
  }

  function initTheme() {
    const fallbackMode = isThemeMode(themeCookie.value)
      ? themeCookie.value
      : "system";

    if (!initialized.value) {
      mode.value = fallbackMode;
      refreshSystemPreference();

      if (import.meta.client) {
        try {
          const storedMode = window.localStorage.getItem(THEME_STORAGE_KEY);
          if (isThemeMode(storedMode)) {
            mode.value = storedMode;
          }
        } catch {
          // Ignore storage-read failures and keep the cookie/default mode.
        }

        refreshSystemPreference();
        attachSystemListener();
      }

      initialized.value = true;
    }

    persistTheme();
    syncDocumentState();
  }

  function setTheme(nextMode: ThemeMode) {
    mode.value = isThemeMode(nextMode) ? nextMode : "system";
    persistTheme();
    syncDocumentState();
  }

  initTheme();

  return {
    mode,
    resolvedTheme,
    setTheme,
    initTheme,
  };
}
