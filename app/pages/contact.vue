<template>
  <div class="contact-page">
    <div class="contact-shell">
      <header class="contact-header">
        <h1>{{ t("contactPage.title") }}</h1>
        <p>{{ t("contactPage.intro") }}</p>
      </header>

      <section class="contact-grid">
        <article class="contact-info">
          <h2>{{ t("contactPage.channelsTitle") }}</h2>
          <ul>
            <li>
              <span class="material-symbols-outlined">mail</span>
              support@voyagehub.com
            </li>
            <li>
              <span class="material-symbols-outlined">call</span>
              +33 1 84 00 00 00
            </li>
            <li>
              <span class="material-symbols-outlined">schedule</span>
              {{ t("contactPage.hours") }}
            </li>
          </ul>
          <p class="contact-note">{{ t("contactPage.note") }}</p>
        </article>

        <article class="contact-form-card">
          <form class="contact-form" @submit.prevent="submitTicket">
            <label>
              <span>{{ t("contactPage.booking") }}</span>
              <select v-model.number="reservationId" required>
                <option :value="0" disabled>{{ t("contactPage.selectBooking") }}</option>
                <option
                  v-for="reservation in reservations"
                  :key="reservation.id"
                  :value="reservation.id"
                >
                  {{ formatReservationLabel(reservation) }}
                </option>
              </select>
            </label>

            <label>
              <span>{{ t("contactPage.subject") }}</span>
              <input
                v-model.trim="subject"
                type="text"
                :placeholder="t('contactPage.subjectPlaceholder')"
                maxlength="120"
                required
              />
            </label>

            <label>
              <span>{{ t("contactPage.message") }}</span>
              <textarea
                v-model.trim="message"
                rows="6"
                :placeholder="t('contactPage.messagePlaceholder')"
                minlength="20"
                required
              />
            </label>

            <button type="submit" :disabled="submitting || loading">
              {{ submitting ? t("contactPage.submitting") : t("contactPage.sendRequest") }}
            </button>
          </form>

          <p v-if="successMessage" class="status-text status-text--success">
            {{ successMessage }}
          </p>
          <p v-if="errorMessage" class="status-text status-text--error">
            {{ errorMessage }}
          </p>
          <div
            v-if="!loading && reservations.length === 0"
            class="status-text status-text--info status-text--cta"
          >
            <p>{{ t("contactPage.noBookings", { link: t("contactPage.hotelsLink") }) }}</p>
            <NuxtLink to="/hotels">{{ t("contactPage.hotelsLink") }}</NuxtLink>
          </div>
        </article>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

import { computed, onMounted, ref } from 'vue'
import type { Reservation } from '~/types/models'
import { useAuth } from '~/composables/useAuth'
import { useReservations } from '~/composables/useReservations'

const { accountId } = useAuth()
const { fetchPaginated } = useReservations()
const { t, formatDate, formatCurrency } = useAppI18n()

const loading = ref(true)
const submitting = ref(false)
const reservations = ref<Reservation[]>([])
const reservationId = ref(0)
const subject = ref('')
const message = ref('')
const successMessage = ref('')
const errorMessage = ref('')

const statusMap = computed(() => ({
  confirmed: t('contactPage.statusConfirmed'),
  confirmee: t('contactPage.statusConfirmed'),
  pending: t('contactPage.statusPending'),
  en_attente: t('contactPage.statusPending'),
  cancelled: t('contactPage.statusCancelled'),
  annulee: t('contactPage.statusCancelled'),
  completed: t('contactPage.statusCompleted'),
  terminee: t('contactPage.statusCompleted'),
  refused: t('contactPage.statusRefused'),
  refusee: t('contactPage.statusRefused'),
  blocked: t('contactPage.statusBlocked'),
  bloquee: t('contactPage.statusBlocked'),
}))

function formatStatus(value: string) {
  const normalized = value.toLowerCase()
  return statusMap.value[normalized as keyof typeof statusMap.value] ?? t('contactPage.statusBooked')
}

function formatReservationLabel(reservation: Reservation) {
  return t('contactPage.reservationLabel', {
    checkIn: formatDate(reservation.checkInDate, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    checkOut: formatDate(reservation.checkOutDate, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    status: formatStatus(String(reservation.status || '')),
    amount: formatCurrency(reservation.totalAmount || 0),
  })
}

async function loadReservations() {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await fetchPaginated({
      page: 1,
      limit: 100,
      accountId: accountId.value,
    })
    reservations.value = response.items
    if (reservations.value.length > 0) {
      reservationId.value = reservations.value[0].id
    }
  } catch (error: any) {
    errorMessage.value = error?.message || t('contactPage.unableToLoadBookings')
  } finally {
    loading.value = false
  }
}

async function submitTicket() {
  successMessage.value = ''
  errorMessage.value = ''

  if (!reservationId.value) {
    errorMessage.value = t('contactPage.selectBookingError')
    return
  }

  if (!subject.value) {
    errorMessage.value = t('contactPage.subjectRequired')
    return
  }

  if (message.value.length < 20) {
    errorMessage.value = t('contactPage.messageTooShort')
    return
  }

  submitting.value = true
  try {
    const response = await $fetch<{ ticketId: number }>('/api/support/contact', {
      method: 'POST',
      body: {
        accountId: accountId.value,
        reservationId: reservationId.value,
        subject: subject.value,
        message: message.value,
      },
    })

    successMessage.value = t('contactPage.successMessage', {
      ticketId: response.ticketId,
    })
    message.value = ''
    subject.value = ''
  } catch (error: any) {
    errorMessage.value =
      error?.data?.message ||
      error?.message ||
      t('contactPage.submitFailed')
  } finally {
    submitting.value = false
  }
}

onMounted(loadReservations)

useHead(() => ({
  title: t('contactPage.metaTitle'),
  meta: [
    {
      name: 'description',
      content: t('contactPage.metaDescription'),
    },
  ],
}))
</script>

<style scoped>
.contact-page {
  min-height: calc(100vh - 140px);
  background:
    radial-gradient(
      circle at top,
      color-mix(in srgb, var(--color-primary-50) 70%, transparent) 0%,
      transparent 50%
    ),
    linear-gradient(180deg, var(--color-bg-soft) 0%, var(--color-surface) 100%);
}

.contact-shell {
  width: min(1120px, calc(100% - 2rem));
  margin: 0 auto;
  padding: 40px 0 56px;
}

.contact-header h1 {
  margin: 0;
  color: var(--color-text-primary);
  font-size: clamp(2rem, 3vw, 2.45rem);
  font-weight: 800;
  letter-spacing: -0.02em;
}

.contact-header p {
  margin: 8px 0 0;
  color: var(--color-text-secondary);
  font-weight: 600;
}

.contact-grid {
  display: grid;
  grid-template-columns: 0.95fr 1.35fr;
  gap: 14px;
  margin-top: 18px;
}

.contact-info,
.contact-form-card {
  padding: 22px;
  border: 1px solid var(--color-border-soft);
  border-radius: 20px;
  background: var(--color-surface);
  box-shadow: var(--shadow-md);
}

.contact-info h2 {
  margin: 0;
  color: var(--color-text-primary);
  font-size: 1.15rem;
  font-weight: 800;
}

.contact-info ul {
  display: grid;
  gap: 10px;
  margin: 14px 0 0;
  padding: 0;
  list-style: none;
}

.contact-info li {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--color-text-secondary);
  font-weight: 600;
}

.contact-note {
  margin: 16px 0 0;
  color: var(--color-text-secondary);
  font-size: 0.92rem;
  line-height: 1.6;
}

.contact-form {
  display: grid;
  gap: 12px;
}

.contact-form label {
  display: grid;
  gap: 6px;
}

.contact-form label > span {
  color: var(--color-text-primary);
  font-size: 0.86rem;
  font-weight: 700;
}

.contact-form input,
.contact-form textarea,
.contact-form select {
  padding: 11px 12px;
  border: 1px solid var(--color-border-soft);
  border-radius: 12px;
  background: var(--color-surface-secondary);
  color: var(--color-text-primary);
  font: inherit;
  outline: none;
}

.contact-form input:focus,
.contact-form textarea:focus,
.contact-form select:focus {
  border-color: color-mix(in srgb, var(--color-primary-300) 72%, white 28%);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary-100) 62%, transparent 38%);
}

.contact-form button {
  padding: 11px 14px;
  border: 0;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--color-primary-600), var(--color-primary-500));
  color: var(--color-white);
  font-size: 0.92rem;
  font-weight: 800;
  cursor: pointer;
}

.contact-form button:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.status-text {
  margin: 12px 0 0;
  font-size: 0.9rem;
  font-weight: 600;
}

.status-text--success {
  color: var(--color-success-700);
}

.status-text--error {
  color: var(--color-danger-600);
}

.status-text--info {
  color: var(--color-text-secondary);
}

.status-text--cta {
  display: grid;
  gap: 0.4rem;
}

.status-text--cta p {
  margin: 0;
}

.status-text--cta :deep(a) {
  width: fit-content;
  color: var(--color-primary-600);
  font-weight: 700;
}

@media (max-width: 900px) {
  .contact-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .contact-shell {
    width: min(100% - 1.5rem, 1120px);
    padding: 28px 0 40px;
  }

  .contact-info,
  .contact-form-card {
    padding: 18px;
    border-radius: 16px;
  }
}
</style>
