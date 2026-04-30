<template>
  <label class="switcher switcher--theme">
    <span class="switcher__prefix material-symbols-outlined" aria-hidden="true">
      {{ themeIcon }}
    </span>
    <span class="visually-hidden">{{ t("theme.select") }}</span>
    <Select
      v-model="selectedTheme"
      :options="themeOptions"
      optionLabel="label"
      optionValue="value"
      class="switcher__select switcher__select--theme"
      appendTo="self"
      :aria-label="t('theme.select')"
    >
      <template #value="{ value }">
        <span class="switcher__value-label">
          {{ getThemeLabel(value) }}
        </span>
      </template>
      <template #option="{ option }">
        <span class="switcher__option-label">
          {{ option.label }}
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
import type { ThemeMode } from "~/composables/useThemeMode";

const { mode, resolvedTheme, setTheme } = useThemeMode();
const { t } = useAppI18n();
const selectedTheme = computed<ThemeMode>({
  get: () => mode.value,
  set: (value) => setTheme(value),
});

const themeOptions = computed(() => [
  { value: "light", label: t("theme.light") },
  { value: "dark", label: t("theme.dark") },
  { value: "system", label: t("theme.system") },
]);

const themeIcon = computed(() => {
  if (mode.value === "system") {
    return resolvedTheme.value === "dark" ? "dark_mode" : "light_mode";
  }

  return mode.value === "dark" ? "dark_mode" : "light_mode";
});

function getThemeLabel(value: ThemeMode | null | undefined) {
  const item = themeOptions.value.find((entry) => entry.value === value);
  return item?.label ?? t("theme.system");
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
  font-size: 1rem;
  color: var(--color-text-soft);
  pointer-events: none;
}

.switcher__select {
  min-height: 2.6rem;
  min-width: 7rem;
  padding-inline: 2.2rem 2.35rem;
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

:deep(.switcher__select--theme.p-select) {
  width: 100%;
  border-radius: 999px;
  min-height: 2.6rem;
  padding-inline-end: 1.7rem;
}

:deep(.switcher__select--theme .p-select-label) {
  padding-inline: 2.2rem 0.45rem;
  font-size: 0.84rem;
  font-weight: 700;
}

:deep(.switcher__select--theme .p-select-dropdown) {
  width: 0;
  opacity: 0;
}

:deep(.switcher__select--theme .p-select-overlay) {
  border-radius: 0.9rem;
  border: 1px solid var(--color-border-soft);
  background: var(--color-surface);
  box-shadow: var(--shadow-dropdown);
}

:deep(.switcher__select--theme .p-select-list) {
  padding: 0.35rem;
}

:deep(.switcher__select--theme .p-select-option) {
  border-radius: 0.65rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-text);
}

:deep(.switcher__select--theme .p-select-option[data-p-selected="true"]) {
  background: color-mix(in srgb, var(--color-primary-100) 65%, transparent);
  color: var(--color-primary-800);
}

:global(.client-navbar--transparent) .switcher__select {
  border-color: rgb(255 255 255 / 0.24);
  background: rgb(255 255 255 / 0.08);
  color: var(--color-white);
}

:global(.client-navbar--transparent) .switcher__prefix,
:global(.client-navbar--transparent) .switcher__chevron {
  color: rgb(255 255 255 / 0.88);
}

:global(.client-navbar--transparent) :deep(.switcher__select--theme.p-select) {
  border-color: rgb(255 255 255 / 0.24);
  background: rgb(255 255 255 / 0.08);
}

:global(.client-navbar--transparent) :deep(.switcher__select--theme .p-select-label),
:global(.client-navbar--transparent) :deep(.switcher__select--theme .p-select-option) {
  color: var(--color-white);
}

@media (max-width: 640px) {
  .switcher__select {
    min-width: 100%;
  }
}
</style>
