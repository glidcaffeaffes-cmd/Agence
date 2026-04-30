<template>
  <div class="info-page">
    <div class="info-shell">
      <header class="info-header">
        <h1>{{ t("privacyPage.title") }}</h1>
        <p>{{ t("privacyPage.updatedOn", { date: updatedOn }) }}</p>
      </header>

      <section class="info-card">
        <div v-for="section in sections" :key="section.title" class="info-section">
          <h2>{{ section.title }}</h2>
          <p>{{ section.body }}</p>
        </div>

        <div class="info-section">
          <h2>{{ t("privacyPage.contactTitle") }}</h2>
          <p>
            {{ t("privacyPage.contactBodyPrefix") }}
            <NuxtLink to="/contact">{{ t("privacyPage.contactLink") }}</NuxtLink>
            {{ t("privacyPage.contactBodySuffix") }}
          </p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const { t } = useAppI18n()

const updatedOn = 'April 26, 2026'
const sections = computed(() => [
  { title: t('privacyPage.collectTitle'), body: t('privacyPage.collectBody') },
  { title: t('privacyPage.useTitle'), body: t('privacyPage.useBody') },
  {
    title: t('privacyPage.sharingTitle'),
    body: t('privacyPage.sharingBody'),
  },
  {
    title: t('privacyPage.retentionTitle'),
    body: t('privacyPage.retentionBody'),
  },
  { title: t('privacyPage.rightsTitle'), body: t('privacyPage.rightsBody') },
])

useHead(() => ({
  title: t('privacyPage.metaTitle'),
  meta: [
    {
      name: 'description',
      content: t('privacyPage.metaDescription'),
    },
  ],
}))
</script>

<style scoped>
.info-page {
  min-height: calc(100vh - 140px);
  background:
    radial-gradient(
      circle at top,
      color-mix(in srgb, var(--color-primary-50) 68%, transparent) 0%,
      transparent 52%
    ),
    linear-gradient(180deg, var(--color-bg-soft) 0%, var(--color-surface) 100%);
}

.info-shell {
  width: min(1024px, calc(100% - 2rem));
  margin: 0 auto;
  padding: 40px 0 56px;
}

.info-header h1 {
  margin: 0;
  color: var(--color-text-primary);
  font-size: clamp(1.9rem, 3vw, 2.45rem);
  font-weight: 800;
  letter-spacing: -0.02em;
}

.info-header p {
  margin: 8px 0 0;
  color: var(--color-text-secondary);
  font-size: 0.95rem;
  font-weight: 600;
}

.info-card {
  margin-top: 20px;
  padding: 28px;
  border: 1px solid var(--color-border-soft);
  border-radius: 20px;
  background: var(--color-surface);
  box-shadow: var(--shadow-md);
}

.info-section + .info-section {
  margin-top: 1.25rem;
}

.info-card h2 {
  margin: 0 0 8px;
  color: var(--color-text-primary);
  font-size: 1.05rem;
  font-weight: 800;
}

.info-card p {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 0.96rem;
  line-height: 1.7;
}

.info-card :deep(a) {
  color: var(--color-primary-600);
  font-weight: 700;
}

.info-card :deep(a:hover) {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .info-shell {
    width: min(100% - 1.5rem, 1024px);
    padding: 28px 0 40px;
  }

  .info-card {
    padding: 20px;
    border-radius: 16px;
  }
}
</style>
