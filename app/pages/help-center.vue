<template>
  <div class="help-page">
    <Head>
      <title>Help Center - VoyageHub</title>
      <meta
        name="description"
        content="Find answers to booking, cancellation, payment, and support questions."
      />
    </Head>

    <div class="help-shell">
      <header class="help-header">
        <h1>Help Center</h1>
        <p>Support answers powered by live booking and support activity.</p>
      </header>

      <section class="stats-grid">
        <article class="stat-card">
          <span>Reservations</span>
          <strong>{{ stats.totalReservations }}</strong>
        </article>
        <article class="stat-card">
          <span>Pending</span>
          <strong>{{ stats.pendingReservations }}</strong>
        </article>
        <article class="stat-card">
          <span>Open Tickets</span>
          <strong>{{ stats.openTickets }}</strong>
        </article>
        <article class="stat-card">
          <span>Resolved</span>
          <strong>{{ stats.resolvedTickets }}</strong>
        </article>
      </section>

      <section class="faq-card">
        <div v-if="loading" class="state-box">
          <span class="material-symbols-outlined spin">progress_activity</span>
          <p>Loading help topics...</p>
        </div>

        <div v-else-if="errorMessage" class="state-box state-box--error">
          <span class="material-symbols-outlined">error</span>
          <p>{{ errorMessage }}</p>
        </div>

        <div v-else-if="faqs.length === 0" class="state-box">
          <span class="material-symbols-outlined">contact_support</span>
          <p>No help topics are available right now.</p>
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
        <p>Need personalized support for your booking?</p>
        <NuxtLink to="/contact">Contact Support</NuxtLink>
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
    errorMessage.value = error?.message || 'Unable to load help center data.'
  } finally {
    loading.value = false
  }
}

onMounted(loadFaqs)
</script>

<style scoped>
.help-page {
  background:
    radial-gradient(circle at top, color-mix(in srgb, var(--color-primary-50) 70%, white 30%) 0%, transparent 50%),
    linear-gradient(180deg, var(--color-gray-50) 0%, white 100%);
  min-height: calc(100vh - 140px);
}

.help-shell {
  max-width: 1120px;
  margin: 0 auto;
  padding: 40px 24px 56px;
}

.help-header h1 {
  margin: 0;
  color: var(--color-navy-500);
  font-size: clamp(2rem, 3vw, 2.45rem);
  font-weight: 800;
  letter-spacing: -0.02em;
}

.help-header p {
  margin: 8px 0 0;
  color: var(--color-gray-500);
  font-weight: 600;
}

.stats-grid {
  margin-top: 18px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.stat-card {
  background: white;
  border: 1px solid color-mix(in srgb, var(--color-gray-200) 72%, white 28%);
  border-radius: 14px;
  padding: 14px 16px;
}

.stat-card span {
  display: block;
  color: var(--color-gray-500);
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-weight: 700;
}

.stat-card strong {
  display: block;
  margin-top: 6px;
  color: var(--color-navy-500);
  font-size: 1.46rem;
  font-weight: 800;
}

.faq-card {
  margin-top: 16px;
  background: white;
  border: 1px solid color-mix(in srgb, var(--color-gray-200) 74%, white 26%);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 16px 30px rgba(15, 23, 42, 0.06);
}

.faq-item {
  border-bottom: 1px solid var(--color-gray-100);
}

.faq-item:last-child {
  border-bottom: 0;
}

.faq-item summary {
  list-style: none;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 18px;
  color: var(--color-navy-500);
  font-weight: 700;
}

.faq-item summary::-webkit-details-marker {
  display: none;
}

.faq-item summary small {
  color: var(--color-gray-500);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-size: 0.72rem;
  font-weight: 700;
  white-space: nowrap;
}

.faq-item p {
  margin: 0;
  color: var(--color-gray-600);
  line-height: 1.7;
  padding: 0 18px 16px;
}

.state-box {
  min-height: 180px;
  display: grid;
  place-content: center;
  gap: 8px;
  text-align: center;
  color: var(--color-gray-500);
}

.state-box .material-symbols-outlined {
  font-size: 30px;
}

.state-box--error {
  color: #b42318;
}

.help-cta {
  margin-top: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 16px 18px;
  background: color-mix(in srgb, var(--color-primary-50) 62%, white 38%);
  border: 1px solid color-mix(in srgb, var(--color-primary-200) 65%, white 35%);
  border-radius: 14px;
}

.help-cta p {
  margin: 0;
  color: var(--color-navy-500);
  font-weight: 700;
}

.help-cta a {
  text-decoration: none;
  color: white;
  background: linear-gradient(135deg, var(--color-primary-600), var(--color-primary-500));
  border-radius: 10px;
  padding: 9px 14px;
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
    padding: 28px 16px 40px;
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
