<template>
  <label class="switcher switcher--language">
    <span class="switcher__prefix" aria-hidden="true">
      <span :class="['switcher__flag', getLocaleFlagClass(selectedLocale)]" />
    </span>
    <span class="visually-hidden">{{ t("language.select") }}</span>
    <Select
      v-model="selectedLocale"
      :options="localeOptions"
      optionLabel="nativeLabel"
      optionValue="code"
      class="switcher__select switcher__select--language"
      appendTo="self"
      :aria-label="t('language.select')"
    >
      <template #value="{ value }">
        <span class="switcher__value-label">
          {{ getLocaleNativeLabel(value) }}
        </span>
      </template>
      <template #option="{ option }">
        <span class="switcher__option-label">
          <span :class="['switcher__flag', option.flag]" aria-hidden="true" />
          {{ option.nativeLabel }}
        </span>
      </template>
    </Select>
    <span class="switcher__chevron material-symbols-outlined" aria-hidden="true">
      expand_more
    </span>
  </label>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { LocaleCode } from "~/i18n/messages";

const { locale, currentLocale, localeOptions, setLocale, t } = useAppI18n();

const selectedLocale = computed<LocaleCode>({
  get: () => locale.value,
  set: (value) => setLocale(value),
});

function getLocaleFlagClass(code: LocaleCode | null | undefined) {
  const target = localeOptions.find((item) => item.code === code);
  return target?.flag ?? currentLocale.value.flag;
}

function getLocaleNativeLabel(code: LocaleCode | null | undefined) {
  const target = localeOptions.find((item) => item.code === code);
  return target?.nativeLabel ?? currentLocale.value.nativeLabel;
}
</script>

<style scoped>
.switcher {
  position: relative;
  display: inline-flex;
  align-items: center;
  min-width: 0;
}

.switcher__prefix {
  position: absolute;
  inset-inline-start: 0.8rem;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  line-height: 1;
  pointer-events: none;
}

.switcher__select {
  min-height: 2.6rem;
  min-width: 7.4rem;
  padding-inline: 2.15rem 2.35rem;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: var(--color-surface);
  color: var(--color-text);
  font-size: 0.84rem;
  font-weight: 700;
  appearance: none;
  cursor: pointer;
  transition:
    border-color var(--duration-fast) var(--easing-standard),
    background-color var(--duration-fast) var(--easing-standard),
    color var(--duration-fast) var(--easing-standard),
    box-shadow var(--duration-fast) var(--easing-standard);
}

.switcher__value-label,
.switcher__option-label {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-family:
    "Segoe UI Emoji",
    "Noto Color Emoji",
    "Apple Color Emoji",
    "Segoe UI",
    sans-serif;
}

.switcher__flag {
  display: inline-block;
  width: 1.1rem;
  height: 0.82rem;
  border-radius: 0.15rem;
  box-shadow: 0 0 0 1px rgb(0 0 0 / 0.12);
  vertical-align: middle;
  flex-shrink: 0;
}

.switcher__chevron {
  position: absolute;
  inset-inline-end: 0.75rem;
  z-index: 1;
  font-size: 1rem;
  color: var(--color-text-soft);
  pointer-events: none;
}

.switcher__select:hover {
  border-color: color-mix(in srgb, var(--color-primary-400) 60%, transparent);
}

.switcher__select:focus-visible {
  box-shadow: var(--shadow-focus);
}

:deep(.switcher__select--language.p-select) {
  width: 100%;
  border-radius: 999px;
  min-height: 2.6rem;
  padding-inline-end: 1.7rem;
}

:deep(.switcher__select--language .p-select-label) {
  padding-inline: 2.05rem 0.5rem;
  font-size: 0.84rem;
  font-weight: 700;
}

:deep(.switcher__select--language .p-select-dropdown) {
  width: 0;
  opacity: 0;
}

:deep(.switcher__select--language .p-select-overlay) {
  border-radius: 0.9rem;
  border: 1px solid var(--color-border-soft);
  background: var(--color-surface);
  box-shadow: var(--shadow-dropdown);
}

:deep(.switcher__select--language .p-select-list) {
  padding: 0.35rem;
}

:deep(.switcher__select--language .p-select-option) {
  border-radius: 0.65rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-text);
}

:deep(.switcher__select--language .p-select-option[data-p-selected="true"]) {
  background: color-mix(in srgb, var(--color-primary-100) 65%, transparent);
  color: var(--color-primary-800);
}

:global(.client-navbar--transparent) .switcher__select {
  border-color: rgb(255 255 255 / 0.24);
  background: rgb(255 255 255 / 0.08);
  color: var(--color-white);
}

:global(.client-navbar--transparent) .switcher__chevron {
  color: rgb(255 255 255 / 0.88);
}

:global(.client-navbar--transparent) :deep(.switcher__select--language.p-select) {
  border-color: rgb(255 255 255 / 0.24);
  background: rgb(255 255 255 / 0.08);
}

:global(.client-navbar--transparent) :deep(.switcher__select--language .p-select-label),
:global(.client-navbar--transparent) :deep(.switcher__select--language .p-select-option) {
  color: var(--color-white);
}

@media (max-width: 640px) {
  .switcher__select {
    min-width: 100%;
  }
}
</style>
