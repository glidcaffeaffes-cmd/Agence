<template>
  <div class="policy-page">
    <div class="policy-shell">
      <header class="policy-header">
        <h1>{{ t("cancellationPage.title") }}</h1>
        <p>{{ t("cancellationPage.intro") }}</p>
      </header>

      <section class="policy-grid">
        <article v-for="item in topCards" :key="item.title" class="policy-card">
          <h2>{{ item.title }}</h2>
          <p>{{ item.body }}</p>
        </article>
      </section>

      <section class="policy-content">
        <div v-for="section in bodySections" :key="section.title" class="policy-section">
          <h2>{{ section.title }}</h2>
          <p>
            <template v-if="section.link === 'my-bookings'">
              {{ t("cancellationPage.whereToCancelPrefix") }}
              <NuxtLink to="/my-bookings">{{ t("cancellationPage.myBookingsLink") }}</NuxtLink>
              {{ t("cancellationPage.whereToCancelSuffix") }}
            </template>
            <template v-else-if="section.link === 'contact'">
              {{ t("cancellationPage.needHelpPrefix") }}
              <NuxtLink to="/contact">{{ t("cancellationPage.contactLink") }}</NuxtLink>
              {{ t("cancellationPage.needHelpSuffix") }}
            </template>
            <template v-else>
              {{ section.body }}
            </template>
          </p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const { t } = useAppI18n()

const topCards = computed(() => [
  {
    title: t('cancellationPage.freeWindowTitle'),
    body: t('cancellationPage.freeWindowBody'),
  },
  {
    title: t('cancellationPage.partialRefundTitle'),
    body: t('cancellationPage.partialRefundBody'),
  },
  {
    title: t('cancellationPage.nonRefundableTitle'),
    body: t('cancellationPage.nonRefundableBody'),
  },
])

const bodySections = computed(() => [
  {
    title: t('cancellationPage.refundProcessTitle'),
    body: t('cancellationPage.refundProcessBody'),
  },
  {
    title: t('cancellationPage.whereToCancelTitle'),
    body: '',
    link: 'my-bookings',
  },
  {
    title: t('cancellationPage.needHelpTitle'),
    body: '',
    link: 'contact',
  },
])

useHead(() => ({
  title: t('cancellationPage.metaTitle'),
  meta: [
    {
      name: 'description',
      content: t('cancellationPage.metaDescription'),
    },
  ],
}))
</script>

<style scoped>
.policy-page {
  min-height: calc(100vh - 140px);
  background:
    radial-gradient(
      circle at top,
      color-mix(in srgb, var(--color-primary-50) 70%, transparent) 0%,
      transparent 50%
    ),
    linear-gradient(180deg, var(--color-bg-soft) 0%, var(--color-surface) 100%);
}

.policy-shell {
  width: min(1120px, calc(100% - 2rem));
  margin: 0 auto;
  padding: 40px 0 56px;
}

.policy-header h1 {
  margin: 0;
  color: var(--color-text-primary);
  font-size: clamp(2rem, 3vw, 2.5rem);
  font-weight: 800;
  letter-spacing: -0.02em;
}

.policy-header p {
  margin: 8px 0 0;
  color: var(--color-text-secondary);
  font-weight: 600;
}

.policy-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-top: 20px;
}

.policy-card,
.policy-content {
  border: 1px solid var(--color-border-soft);
  background: var(--color-surface);
}

.policy-card {
  padding: 18px;
  border-radius: 16px;
  box-shadow: var(--shadow-sm);
}

.policy-card h2,
.policy-content h2 {
  margin: 0 0 8px;
  color: var(--color-text-primary);
  font-size: 1.05rem;
  font-weight: 800;
}

.policy-card p,
.policy-content p {
  margin: 0;
  color: var(--color-text-secondary);
  line-height: 1.7;
  font-size: 0.96rem;
}

.policy-content {
  margin-top: 18px;
  padding: 26px;
  border-radius: 20px;
  box-shadow: var(--shadow-md);
}

.policy-section + .policy-section {
  margin-top: 1rem;
}

.policy-content :deep(a) {
  color: var(--color-primary-600);
  font-weight: 700;
}

.policy-content :deep(a:hover) {
  text-decoration: underline;
}

@media (max-width: 900px) {
  .policy-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .policy-shell {
    width: min(100% - 1.5rem, 1120px);
    padding: 28px 0 40px;
  }

  .policy-content {
    padding: 20px;
    border-radius: 16px;
  }
}
</style>
