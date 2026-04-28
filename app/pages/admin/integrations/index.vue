<template>
  <div>
    <Head>
      <title>Email Delivery - VoyageHub Admin</title>
      <meta
        name="description"
        content="Monitor SMTP delivery health and send test emails from VoyageHub."
      />
    </Head>

    <div class="admin-page">
      <div class="page-header">
        <div>
          <p class="page-eyebrow">Infrastructure</p>
          <h1 class="page-title">Email Delivery & Integrations</h1>
          <p class="page-desc">SMTP lives in the backend environment. This screen lets you verify the connection and test delivery.</p>
        </div>
        <button class="btn-primary" :disabled="loading" @click="loadData">
          <span class="material-symbols-outlined">refresh</span>
          Refresh status
        </button>
      </div>

      <div v-if="banner" class="alert-success">
        <span class="material-symbols-outlined">check_circle</span>
        {{ banner }}
      </div>

      <div v-if="error" class="alert-error">
        <span class="material-symbols-outlined">error</span>
        {{ error }}
      </div>

      <div class="status-grid" v-if="config">
        <article class="status-card">
          <span class="status-label">Provider</span>
          <strong>{{ config.provider }}</strong>
          <p>{{ config.connected ? 'SMTP verification passed.' : config.errorMessage || 'SMTP verification is currently failing.' }}</p>
        </article>
        <article class="status-card">
          <span class="status-label">Sender</span>
          <strong>{{ config.fromEmail }}</strong>
          <p>Reply-to: {{ config.replyTo || config.fromEmail }}</p>
        </article>
        <article class="status-card">
          <span class="status-label">Public app URL</span>
          <strong>{{ config.appWebUrl }}</strong>
          <p>Reset-password and booking links point here.</p>
        </article>
      </div>

      <div class="content-grid">
        <section class="section-card">
          <div class="section-card__header">
            <div>
              <h2>Connection details</h2>
              <p>Operational values surfaced from the backend mail module.</p>
            </div>
            <span class="status-pill" :class="config?.connected ? 'pill--active' : 'pill--warning'">
              {{ config?.connected ? 'Connected' : 'Needs attention' }}
            </span>
          </div>

          <dl v-if="config" class="detail-list">
            <div>
              <dt>Host</dt>
              <dd>{{ config.host }}:{{ config.port }}</dd>
            </div>
            <div>
              <dt>Security</dt>
              <dd>{{ config.secure ? 'TLS / SSL enabled' : 'Plain / opportunistic TLS' }}</dd>
            </div>
            <div>
              <dt>SMTP user</dt>
              <dd>{{ config.user || 'Not configured' }}</dd>
            </div>
            <div>
              <dt>Support inbox</dt>
              <dd>{{ config.supportEmail }}</dd>
            </div>
          </dl>

          <div class="env-note">
            <span class="material-symbols-outlined">shield_lock</span>
            <div>
              <strong>Secrets stay in backend env variables</strong>
              <p>SMTP credentials are intentionally not editable from the admin UI. Use `.env` for Gmail or another provider.</p>
            </div>
          </div>
        </section>

        <section class="section-card">
          <div class="section-card__header">
            <div>
              <h2>Send test email</h2>
              <p>Use a real template and confirm the email arrives correctly.</p>
            </div>
          </div>

          <form class="test-form" @submit.prevent="sendTest">
            <label>
              <span>Recipient</span>
              <input v-model="testTo" type="email" placeholder="recipient@example.com" />
            </label>

            <label>
              <span>Template</span>
              <select v-model="selectedTemplate">
                <option v-for="template in emailTemplates" :key="template.id" :value="template.slug">
                  {{ template.name }}
                </option>
              </select>
            </label>

            <button class="btn-primary" type="submit" :disabled="sendingTest">
              <span class="material-symbols-outlined">{{ sendingTest ? 'progress_activity' : 'send' }}</span>
              {{ sendingTest ? 'Sending...' : 'Send test email' }}
            </button>
          </form>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { MailConfigStatus, MailTemplate } from '~/types/models'
import { MailAdminService } from '~/services/MailAdminService'

definePageMeta({ layout: 'admin' })

const service = new MailAdminService()

const loading = ref(false)
const sendingTest = ref(false)
const error = ref<string | null>(null)
const banner = ref('')
const config = ref<MailConfigStatus | null>(null)
const templates = ref<MailTemplate[]>([])
const testTo = ref('')
const selectedTemplate = ref('auth.welcome')

const emailTemplates = computed(() => templates.value.filter((template) => template.channel === 'EMAIL'))

async function loadData() {
  loading.value = true
  error.value = null

  try {
    const [nextConfig, nextTemplates] = await Promise.all([
      service.getConfig(),
      service.getTemplates(),
    ])

    config.value = nextConfig
    templates.value = nextTemplates
    if (!emailTemplates.value.some((template) => template.slug === selectedTemplate.value)) {
      selectedTemplate.value = emailTemplates.value[0]?.slug || 'auth.welcome'
    }
  } catch (cause: any) {
    error.value = cause.message || 'Unable to load mail configuration.'
  } finally {
    loading.value = false
  }
}

async function sendTest() {
  sendingTest.value = true
  error.value = null
  banner.value = ''

  try {
    const response = await service.sendTestEmail({
      to: testTo.value.trim() || undefined,
      templateSlug: selectedTemplate.value,
    })
    banner.value = `Test email sent to ${response.to}.`
  } catch (cause: any) {
    error.value = cause.message || 'Test email failed.'
  } finally {
    sendingTest.value = false
  }
}

onMounted(loadData)
</script>

<style scoped>
.admin-page { padding: 2.5rem; }
.page-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 1.5rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
.page-eyebrow { font-size: 0.6875rem; text-transform: uppercase; letter-spacing: 0.08em; color: #6d7979; font-weight: 600; margin: 0; }
.page-title { font-size: 1.625rem; font-weight: 700; color: #015081; margin: 0.25rem 0; }
.page-desc { font-size: 0.875rem; color: #3d4949; margin: 0; max-width: 62ch; }
.btn-primary { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.7rem 1.15rem; background: linear-gradient(135deg,#006768,#008283); color: #fff; border: none; border-radius: 0.6rem; font-size: 0.875rem; font-weight: 700; cursor: pointer; }
.btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }
.alert-success, .alert-error { display: flex; align-items: center; gap: 0.5rem; padding: 0.85rem 1rem; border-radius: 0.75rem; margin-bottom: 1rem; font-size: 0.875rem; font-weight: 600; }
.alert-success { background: #e0f2f1; color: #006768; }
.alert-error { background: #fdecea; color: #ba1a1a; }
.status-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; margin-bottom: 1rem; }
.status-card { background: #fff; border: 1px solid #e1e9f0; border-radius: 0.875rem; padding: 1.25rem; box-shadow: 0 1px 4px rgba(1,80,129,0.06); }
.status-label { display: block; color: #6d7979; font-size: 0.7rem; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; }
.status-card strong { display: block; margin-top: 0.45rem; color: #015081; font-size: 1.05rem; }
.status-card p { margin: 0.45rem 0 0; color: #3d4949; font-size: 0.84rem; line-height: 1.5; }
.content-grid { display: grid; grid-template-columns: 1.2fr 0.9fr; gap: 1rem; }
.section-card { background: #fff; border: 1px solid #e1e9f0; border-radius: 0.875rem; padding: 1.35rem; box-shadow: 0 1px 4px rgba(1,80,129,0.06); }
.section-card__header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; margin-bottom: 1.1rem; }
.section-card__header h2 { margin: 0; font-size: 1rem; color: #015081; }
.section-card__header p { margin: 0.3rem 0 0; color: #6d7979; font-size: 0.82rem; }
.status-pill { display: inline-flex; align-items: center; justify-content: center; border-radius: 999px; padding: 0.3rem 0.7rem; font-size: 0.72rem; font-weight: 800; }
.pill--active { background: #e0f2f1; color: #006768; }
.pill--warning { background: #fff8e1; color: #8b5e00; }
.detail-list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.85rem 1rem; }
.detail-list dt { color: #6d7979; font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; }
.detail-list dd { margin: 0.28rem 0 0; color: #151d22; font-size: 0.88rem; font-weight: 600; }
.env-note { margin-top: 1rem; border-radius: 0.75rem; background: #f5faff; padding: 0.95rem; display: flex; gap: 0.75rem; }
.env-note .material-symbols-outlined { color: #015081; }
.env-note strong { display: block; color: #015081; font-size: 0.88rem; }
.env-note p { margin: 0.25rem 0 0; color: #3d4949; font-size: 0.82rem; line-height: 1.5; }
.test-form { display: grid; gap: 1rem; }
.test-form label { display: grid; gap: 0.4rem; }
.test-form span { color: #151d22; font-size: 0.82rem; font-weight: 700; }
.test-form input, .test-form select { border: 1px solid #bcc9c8; border-radius: 0.65rem; padding: 0.72rem 0.85rem; font-size: 0.88rem; outline: none; }
.test-form input:focus, .test-form select:focus { border-color: #008F90; box-shadow: 0 0 0 2px rgba(0,143,144,0.12); }
@media (max-width: 980px) {
  .status-grid, .content-grid { grid-template-columns: 1fr; }
  .detail-list { grid-template-columns: 1fr; }
}
</style>
