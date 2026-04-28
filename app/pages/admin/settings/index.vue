<template>
  <div>
    <Head>
      <title>System Settings - VoyageHub Admin</title>
      <meta
        name="description"
        content="Manage platform defaults, support addresses, and operational settings for VoyageHub."
      />
    </Head>

    <div class="admin-page">
      <div class="page-header">
        <div>
          <p class="page-eyebrow">Configuration</p>
          <h1 class="page-title">System Settings</h1>
          <p class="page-desc">Branding, support routing, booking defaults, and operational toggles all in one place.</p>
        </div>
        <button class="btn-save" :disabled="saving || loading" @click="saveAll">
          <span class="material-symbols-outlined">save</span>
          {{ saving ? 'Saving...' : 'Save changes' }}
        </button>
      </div>

      <div v-if="saved" class="alert-success">
        <span class="material-symbols-outlined">check_circle</span>
        Settings updated successfully.
      </div>

      <div v-if="error" class="alert-error">
        <span class="material-symbols-outlined">error</span>
        {{ error }}
      </div>

      <div class="settings-grid">
        <section class="settings-card">
          <div class="section-header">
            <span class="material-symbols-outlined">support_agent</span>
            <div>
              <h2>Support & brand email</h2>
              <p>These values are used by transactional emails and internal alerts.</p>
            </div>
          </div>
          <div class="field-list">
            <label v-for="config in mailConfigs" :key="config.key" class="field-row">
              <div>
                <strong>{{ formatKey(config.key) }}</strong>
                <p>{{ config.description }}</p>
              </div>
              <input v-model="config.value" type="text" />
            </label>
          </div>
          <div class="section-note">
            SMTP credentials remain backend-only in `.env`. This page is for sender identity, support routing, and public URLs.
          </div>
        </section>

        <section class="settings-card">
          <div class="section-header">
            <span class="material-symbols-outlined">policy</span>
            <div>
              <h2>Booking policies</h2>
              <p>Keep cancellations, lead time, guest limits, and commission defaults aligned.</p>
            </div>
          </div>
          <div class="field-list">
            <label v-for="config in policyConfigs" :key="config.key" class="field-row">
              <div>
                <strong>{{ formatKey(config.key) }}</strong>
                <p>{{ config.description }}</p>
              </div>
              <input v-model="config.value" type="text" />
            </label>
          </div>
        </section>

        <section class="settings-card">
          <div class="section-header">
            <span class="material-symbols-outlined">settings</span>
            <div>
              <h2>Operational defaults</h2>
              <p>General platform values shown across the client and admin surfaces.</p>
            </div>
          </div>
          <div class="field-list">
            <label v-for="config in generalConfigs" :key="config.key" class="field-row">
              <div>
                <strong>{{ formatKey(config.key) }}</strong>
                <p>{{ config.description }}</p>
              </div>
              <input v-model="config.value" type="text" />
            </label>
          </div>
        </section>

        <section class="settings-card">
          <div class="section-header">
            <span class="material-symbols-outlined">toggle_on</span>
            <div>
              <h2>Feature toggles</h2>
              <p>Use simple switches for operational flags such as maintenance mode.</p>
            </div>
          </div>
          <div class="toggle-list">
            <label v-for="config in toggles" :key="config.key" class="toggle-item">
              <div>
                <strong>{{ formatKey(config.key) }}</strong>
                <p>{{ config.description }}</p>
              </div>
              <button
                type="button"
                class="toggle-btn"
                :class="{ 'toggle-btn--on': config.value === 'true' }"
                @click="config.value = config.value === 'true' ? 'false' : 'true'"
              >
                <span></span>
              </button>
            </label>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { SystemConfig } from '~/types/models'
import { SystemConfigService } from '~/services/SystemConfigService'

definePageMeta({ layout: 'admin' })

const service = new SystemConfigService()

const configs = ref<SystemConfig[]>([])
const saved = ref(false)
const loading = ref(false)
const saving = ref(false)
const error = ref<string | null>(null)

const mailKeys = new Set(['support_email', 'mail_sender_name', 'mail_reply_to', 'app_web_url'])
const policyKeys = new Set([
  'max_booking_advance_days',
  'cancellation_deadline_hours',
  'commission_rate',
  'max_guests_per_room',
])

const toggles = computed(() => configs.value.filter((config) => config.value === 'true' || config.value === 'false'))
const mailConfigs = computed(() => configs.value.filter((config) => mailKeys.has(config.key)))
const policyConfigs = computed(() =>
  configs.value.filter((config) => policyKeys.has(config.key) && !toggles.value.includes(config)),
)
const generalConfigs = computed(() =>
  configs.value.filter(
    (config) =>
      !mailKeys.has(config.key) &&
      !policyKeys.has(config.key) &&
      !toggles.value.includes(config),
  ),
)

function formatKey(key: string) {
  return key.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
}

async function saveAll() {
  saving.value = true
  error.value = null

  try {
    await Promise.all(configs.value.map((config) => service.update(config.key, config.value)))
    saved.value = true
    window.setTimeout(() => {
      saved.value = false
    }, 2500)
  } catch (cause: any) {
    error.value = cause.message || 'Unable to save settings.'
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  loading.value = true
  error.value = null

  try {
    configs.value = await service.getAll()
  } catch (cause: any) {
    error.value = cause.message || 'Unable to load settings.'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.admin-page { padding: 2.5rem; }
.page-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 1.5rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
.page-eyebrow { font-size: 0.6875rem; text-transform: uppercase; letter-spacing: 0.08em; color: #6d7979; font-weight: 600; margin: 0; }
.page-title { font-size: 1.625rem; font-weight: 700; color: #015081; margin: 0.25rem 0; }
.page-desc { font-size: 0.875rem; color: #3d4949; margin: 0; max-width: 62ch; }
.btn-save { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.7rem 1.15rem; background: linear-gradient(135deg,#006768,#008283); color: #fff; border: none; border-radius: 0.6rem; font-size: 0.875rem; font-weight: 700; cursor: pointer; }
.btn-save:disabled { opacity: 0.7; cursor: not-allowed; }
.alert-success, .alert-error { display: flex; align-items: center; gap: 0.5rem; padding: 0.85rem 1rem; border-radius: 0.75rem; margin-bottom: 1rem; font-size: 0.875rem; font-weight: 600; }
.alert-success { background: #e0f2f1; color: #006768; }
.alert-error { background: #fdecea; color: #ba1a1a; }
.settings-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
.settings-card { background: #fff; border: 1px solid #e1e9f0; border-radius: 0.875rem; padding: 1.3rem; box-shadow: 0 1px 4px rgba(1,80,129,0.06); }
.section-header { display: flex; gap: 0.8rem; align-items: flex-start; margin-bottom: 1rem; }
.section-header .material-symbols-outlined { color: #006768; background: #e0f2f1; border-radius: 0.6rem; padding: 0.55rem; }
.section-header h2 { margin: 0; color: #015081; font-size: 1rem; }
.section-header p { margin: 0.25rem 0 0; color: #6d7979; font-size: 0.82rem; line-height: 1.5; }
.field-list, .toggle-list { display: grid; gap: 0.85rem; }
.field-row, .toggle-item { display: flex; justify-content: space-between; gap: 1rem; align-items: center; padding: 0.85rem 0; border-top: 1px solid #edf2f7; }
.field-row:first-child, .toggle-item:first-child { border-top: none; padding-top: 0; }
.field-row strong, .toggle-item strong { display: block; font-size: 0.87rem; color: #151d22; }
.field-row p, .toggle-item p { margin: 0.2rem 0 0; font-size: 0.76rem; color: #6d7979; max-width: 30ch; line-height: 1.5; }
.field-row input { width: 220px; border: 1px solid #bcc9c8; border-radius: 0.65rem; padding: 0.7rem 0.8rem; font-size: 0.87rem; outline: none; }
.field-row input:focus { border-color: #008F90; box-shadow: 0 0 0 2px rgba(0,143,144,0.12); }
.section-note { margin-top: 1rem; border-radius: 0.75rem; background: #f5faff; color: #3d4949; padding: 0.9rem 1rem; font-size: 0.82rem; line-height: 1.5; }
.toggle-btn { width: 46px; height: 26px; border: none; border-radius: 999px; background: #bcc9c8; padding: 3px; cursor: pointer; transition: background 0.2s ease; }
.toggle-btn span { display: block; width: 20px; height: 20px; border-radius: 50%; background: #fff; transition: transform 0.2s ease; box-shadow: 0 1px 3px rgba(0,0,0,0.2); }
.toggle-btn--on { background: #006768; }
.toggle-btn--on span { transform: translateX(20px); }
@media (max-width: 980px) {
  .settings-grid { grid-template-columns: 1fr; }
  .field-row, .toggle-item { flex-direction: column; align-items: stretch; }
  .field-row input { width: 100%; }
}
</style>
