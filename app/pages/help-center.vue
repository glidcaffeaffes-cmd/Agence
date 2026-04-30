<template>
  <div class="help-page">
    <div class="help-shell">
      <header class="help-header">
        <h1>{{ t("helpCenterPage.title") }}</h1>
        <p>{{ t("helpCenterPage.intro") }}</p>
      </header>

      <section class="stats-grid">
        <article class="stat-card">
          <span>{{ t("helpCenterPage.reservations") }}</span>
          <strong>{{ stats.totalReservations }}</strong>
        </article>
        <article class="stat-card">
          <span>{{ t("helpCenterPage.pending") }}</span>
          <strong>{{ stats.pendingReservations }}</strong>
        </article>
        <article class="stat-card">
          <span>{{ t("helpCenterPage.openTickets") }}</span>
          <strong>{{ stats.openTickets }}</strong>
        </article>
        <article class="stat-card">
          <span>{{ t("helpCenterPage.resolved") }}</span>
          <strong>{{ stats.resolvedTickets }}</strong>
        </article>
      </section>

      <section class="faq-card">
        <div v-if="loading" class="state-box">
          <span class="material-symbols-outlined spin">progress_activity</span>
          <p>{{ t("helpCenterPage.loading") }}</p>
        </div>

        <div v-else-if="errorMessage" class="state-box state-box--error">
          <span class="material-symbols-outlined">error</span>
          <p>{{ errorMessage }}</p>
        </div>

        <div v-else-if="faqs.length === 0" class="state-box">
          <span class="material-symbols-outlined">contact_support</span>
          <p>{{ t("helpCenterPage.empty") }}</p>
        </div>

        <details
          v-for="item in faqs"
          v-else
          :key="item.id"
          class="faq-item"
        >
          <summary>
            <span>{{ item.question }}</span>
            <small>{{ item.category }}</small>
          </summary>
          <p>{{ item.answer }}</p>
        </details>
      </section>

      <section class="help-cta">
        <p>{{ t("helpCenterPage.personalizedSupport") }}</p>
        <NuxtLink to="/contact">{{ t("helpCenterPage.contactSupport") }}</NuxtLink>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

type HelpFaq = {
  id: string
  question: string
  answer: string
  category: string
}

type HelpStats = {
  totalReservations: number
  pendingReservations: number
  openTickets: number
  resolvedTickets: number
}

const { t } = useAppI18n()
const loading = ref(true)
const errorMessage = ref('')
const faqs = ref<HelpFaq[]>([])
const stats = ref<HelpStats>({
  totalReservations: 0,
  pendingReservations: 0,
  openTickets: 0,
  resolvedTickets: 0,
})

async function loadFaqs() {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await $fetch<{
      faqs: HelpFaq[]
      stats: HelpStats
    }>('/help-center/faqs')

    faqs.value = response.faqs || []
    stats.value = response.stats || stats.value
  } catch (error: any) {
    errorMessage.value = error?.message || t('helpCenterPage.unableToLoad')
  } finally {
    loading.value = false
  }
}

onMounted(loadFaqs)

useHead(() => ({
  title: t('helpCenterPage.metaTitle'),
  meta: [
    {
      name: 'description',
      content: t('helpCenterPage.metaDescription'),
    },
  ],
}))
</script>

<style scoped>
.help-page {
  min-height: calc(100vh - 140px);
  background:
    radial-gradient(
      circle at top,
      color-mix(in srgb, var(--color-primary-50) 70%, transparent) 0%,
      transparent 50%
    ),
    linear-gradient(180deg, var(--color-bg-soft) 0%, var(--color-surface) 100%);
}

.help-shell {
  width: min(1120px, calc(100% - 2rem));
  margin: 0 auto;
  padding: 40px 0 56px;
}

.help-header h1 {
  margin: 0;
  color: var(--color-text-primary);
  font-size: clamp(2rem, 3vw, 2.45rem);
  font-weight: 800;
  letter-spacing: -0.02em;
}

.help-header p {
  margin: 8px 0 0;
  color: var(--color-text-secondary);
  font-weight: 600;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-top: 18px;
}

.stat-card,
.faq-card {
  border: 1px solid var(--color-border-soft);
  background: var(--color-surface);
}

.stat-card {
  padding: 14px 16px;
  border-radius: 14px;
}

.stat-card span {
  display: block;
  color: var(--color-text-secondary);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.stat-card strong {
  display: block;
  margin-top: 6px;
  color: var(--color-text-primary);
  font-size: 1.46rem;
  font-weight: 800;
}

.faq-card {
  overflow: hidden;
  margin-top: 16px;
  border-radius: 20px;
  box-shadow: var(--shadow-md);
}

.faq-item {
  border-bottom: 1px solid var(--color-border-soft);
}

.faq-item:last-child {
  border-bottom: 0;
}

.faq-item summary {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 18px;
  list-style: none;
  color: var(--color-text-primary);
  font-weight: 700;
  cursor: pointer;
}

.faq-item summary::-webkit-details-marker {
  display: none;
}

.faq-item summary small {
  flex-shrink: 0;
  color: var(--color-text-secondary);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.faq-item p {
  margin: 0;
  padding: 0 18px 16px;
  color: var(--color-text-secondary);
  line-height: 1.7;
}

.state-box {
  min-height: 180px;
  display: grid;
  place-content: center;
  gap: 8px;
  text-align: center;
  color: var(--color-text-secondary);
}

.state-box .material-symbols-outlined {
  font-size: 30px;
}

.state-box--error {
  color: var(--color-danger-600);
}

.help-cta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 16px;
  padding: 16px 18px;
  border: 1px solid color-mix(in srgb, var(--color-primary-300) 26%, transparent);
  border-radius: 14px;
  background: color-mix(in srgb, var(--color-primary-50) 50%, var(--color-surface));
}

.help-cta p {
  margin: 0;
  color: var(--color-text-primary);
  font-weight: 700;
}

.help-cta a {
  padding: 9px 14px;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--color-primary-600), var(--color-primary-500));
  color: var(--color-white);
  font-size: 0.9rem;
  font-weight: 700;
  white-space: nowrap;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 950px) {
  .stats-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .help-shell {
    width: min(100% - 1.5rem, 1120px);
    padding: 28px 0 40px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .faq-card {
    border-radius: 16px;
  }

  .help-cta {
    flex-direction: column;
    align-items: stretch;
  }

  .help-cta a {
    text-align: center;
  }
}
</style>
