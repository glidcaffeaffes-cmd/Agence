import { computed } from "vue";
import {
  defaultLocale,
  localeDefinitions,
  messages,
  type LocaleCode,
  type LocaleDefinition,
  type MessageNode,
} from "~/i18n/messages";

const LOCALE_COOKIE = "voyagehub_locale";
const LOCALE_STORAGE_KEY = "voyagehub-locale";

function isLocaleCode(value: unknown): value is LocaleCode {
  return value === "en" || value === "fr" || value === "ar";
}

function interpolate(
  template: string,
  params: Record<string, string | number | null | undefined> = {},
) {
  return template.replace(/\{(\w+)\}/g, (_, key) => {
    const value = params[key];
    return value === null || value === undefined ? "" : String(value);
  });
}

function resolveNode(node: MessageNode, key: string): string | null {
  const segments = key.split(".");
  let current: string | MessageNode | undefined = node;

  for (const segment of segments) {
    if (!current || typeof current === "string") {
      return null;
    }
    current = current[segment];
  }

  return typeof current === "string" ? current : null;
}

function getLocaleDefinition(code: LocaleCode): LocaleDefinition {
  return (
    localeDefinitions.find((entry) => entry.code === code) ??
    localeDefinitions[0]
  );
}

export function useAppI18n() {
  const locale = useState<LocaleCode>("app-locale", () => defaultLocale);
  const initialized = useState<boolean>("app-locale-initialized", () => false);
  const localeCookie = useCookie<LocaleCode>(LOCALE_COOKIE, {
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
    default: () => defaultLocale,
  });

  const currentLocale = computed(() => getLocaleDefinition(locale.value));
  const dir = computed(() => currentLocale.value.dir);
  const isRtl = computed(() => dir.value === "rtl");

  function syncDocumentState() {
    if (!import.meta.client) {
      return;
    }

    const root = document.documentElement;
    root.lang = currentLocale.value.htmlLang;
    root.dir = currentLocale.value.dir;
    root.dataset.locale = locale.value;
  }

  function persistLocale() {
    localeCookie.value = locale.value;

    if (!import.meta.client) {
      return;
    }

    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, locale.value);
    } catch {
      // Ignore storage failures and keep the in-memory locale.
    }
  }

  function initLocale() {
    const fallbackLocale = isLocaleCode(localeCookie.value)
      ? localeCookie.value
      : defaultLocale;

    if (!initialized.value) {
      locale.value = fallbackLocale;

      if (import.meta.client) {
        try {
          const storedLocale = window.localStorage.getItem(LOCALE_STORAGE_KEY);
          if (isLocaleCode(storedLocale)) {
            locale.value = storedLocale;
          }
        } catch {
          // Ignore storage-read failures and keep the cookie/default locale.
        }
      }

      initialized.value = true;
    }

    persistLocale();
    syncDocumentState();
  }

  function setLocale(nextLocale: LocaleCode) {
    locale.value = isLocaleCode(nextLocale) ? nextLocale : defaultLocale;
    persistLocale();
    syncDocumentState();
  }

  function t(
    key: string,
    params?: Record<string, string | number | null | undefined>,
  ) {
    const activeMessage =
      resolveNode(messages[locale.value], key) ??
      resolveNode(messages[defaultLocale], key) ??
      key;
    return interpolate(activeMessage, params);
  }

  function formatDate(
    value: string | number | Date,
    options?: Intl.DateTimeFormatOptions,
  ) {
    const date = value instanceof Date ? value : new Date(value);

    if (Number.isNaN(date.getTime())) {
      return String(value ?? "");
    }

    return new Intl.DateTimeFormat(currentLocale.value.intlLocale, options).format(
      date,
    );
  }

  function formatNumber(
    value: number,
    options?: Intl.NumberFormatOptions,
  ) {
    return new Intl.NumberFormat(currentLocale.value.intlLocale, options).format(
      value,
    );
  }

  function formatCurrency(
    value: number,
    currency = "EUR",
    options?: Intl.NumberFormatOptions,
  ) {
    return new Intl.NumberFormat(currentLocale.value.intlLocale, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
      ...options,
    }).format(value);
  }

  initLocale();

  return {
    locale,
    currentLocale,
    localeOptions: localeDefinitions,
    dir,
    isRtl,
    t,
    setLocale,
    initLocale,
    formatDate,
    formatNumber,
    formatCurrency,
  };
}
