<template>
  <div>
    <Head>
      <title>API & Integrations — VoyageHub Admin</title>
      <meta name="description" content="Manage API keys and third-party system integrations for VoyageHub." />
    </Head>

    <div class="admin-page">
      <div class="page-header">
        <div>
          <p class="page-eyebrow">Developer</p>
          <h1 class="page-title">API & System Integrations</h1>
          <p class="page-desc">Manage API keys, webhooks and third-party connections</p>
        </div>
        <button id="integration-new-key-btn" class="btn-primary" @click="generateKey">
          <span class="material-symbols-outlined">add</span> Generate API Key
        </button>
      </div>

      <div v-if="generated" class="new-key-banner">
        <span class="material-symbols-outlined">key</span>
        <div>
          <p class="key-banner-label">New API Key Generated — Copy it now, it won't be shown again</p>
          <code class="key-value">{{ generated }}</code>
        </div>
        <button class="copy-btn" @click="copyKey" :title="copied ? 'Copied!' : 'Copy'">
          <span class="material-symbols-outlined">{{ copied ? 'check' : 'content_copy' }}</span>
        </button>
      </div>

      <div class="integrations-layout">
        <!-- API Keys -->
        <div class="section-card">
          <h3 class="section-title">
            <span class="material-symbols-outlined">vpn_key</span> API Keys
          </h3>
          <table class="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Key (masked)</th>
                <th>Created</th>
                <th>Last Used</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="key in apiKeys" :key="key.id" :id="`api-key-${key.id}`">
                <td class="td-name">{{ key.name }}</td>
                <td><code class="key-masked">{{ key.masked }}</code></td>
                <td class="td-date">{{ key.created }}</td>
                <td class="td-date">{{ key.lastUsed }}</td>
                <td>
                  <span class="status-pill" :class="key.active ? 'pill--active' : 'pill--revoked'">
                    {{ key.active ? 'Active' : 'Revoked' }}
                  </span>
                </td>
                <td>
                  <div class="row-actions">
                    <button class="row-btn" title="Revoke" @click="revokeKey(key)" v-if="key.active">
                      <span class="material-symbols-outlined">block</span>
                    </button>
                    <button class="row-btn row-btn--danger" title="Delete" @click="deleteKey(key)">
                      <span class="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Webhooks -->
        <div class="section-card">
          <div class="section-card-header">
            <h3 class="section-title">
              <span class="material-symbols-outlined">webhook</span> Webhooks
            </h3>
            <button class="btn-ghost-sm" @click="showAddWebhook = true">
              <span class="material-symbols-outlined">add</span> Add Webhook
            </button>
          </div>
          <div class="webhook-list">
            <div v-for="wh in webhooks" :key="wh.id" :id="`webhook-${wh.id}`" class="webhook-row">
              <div class="webhook-status-dot" :class="wh.active ? 'dot--active' : 'dot--inactive'"></div>
              <div class="webhook-info">
                <p class="webhook-url">{{ wh.url }}</p>
                <div class="webhook-events">
                  <span v-for="e in wh.events" :key="e" class="event-tag">{{ e }}</span>
                </div>
              </div>
              <div class="row-actions">
                <button class="row-btn" :title="wh.active ? 'Disable' : 'Enable'" @click="wh.active = !wh.active">
                  <span class="material-symbols-outlined">{{ wh.active ? 'pause' : 'play_arrow' }}</span>
                </button>
                <button class="row-btn row-btn--danger" title="Delete">
                  <span class="material-symbols-outlined">delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Third-party integrations -->
        <div class="section-card section-card--full">
          <h3 class="section-title">
            <span class="material-symbols-outlined">extension</span> Third-Party Integrations
          </h3>
          <div class="integrations-grid">
            <div v-for="integ in integrations" :key="integ.id" :id="`integration-${integ.id}`" class="integ-card">
              <div class="integ-logo">
                <span class="material-symbols-outlined">{{ integ.icon }}</span>
              </div>
              <div class="integ-info">
                <p class="integ-name">{{ integ.name }}</p>
                <p class="integ-desc">{{ integ.description }}</p>
              </div>
              <div class="integ-actions">
                <span class="status-pill" :class="integ.connected ? 'pill--active' : 'pill--disconnected'">
                  {{ integ.connected ? 'Connected' : 'Disconnected' }}
                </span>
                <button class="btn-integ" @click="integ.connected = !integ.connected">
                  {{ integ.connected ? 'Disconnect' : 'Connect' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

definePageMeta({ layout: 'admin' })

const generated = ref('')
const copied = ref(false)
const showAddWebhook = ref(false)

const apiKeys = ref([
  { id: 1, name: 'Production API', masked: 'vh_live_••••••••••••••3a7f', created: '2026-01-10', lastUsed: '2026-04-17', active: true },
  { id: 2, name: 'Development API', masked: 'vh_test_••••••••••••••9c2b', created: '2026-02-05', lastUsed: '2026-04-15', active: true },
  { id: 3, name: 'Legacy Mobile Key', masked: 'vh_live_••••••••••••••1d4e', created: '2025-06-01', lastUsed: '2025-12-30', active: false },
])

const webhooks = ref([
  { id: 1, url: 'https://partner.example.com/hooks/reservation', events: ['reservation.created', 'reservation.cancelled'], active: true },
  { id: 2, url: 'https://analytics.example.com/events', events: ['user.registered', 'hotel.updated'], active: true },
  { id: 3, url: 'https://crm.example.com/webhook', events: ['complaint.created'], active: false },
])

const integrations = ref([
  { id: 1, name: 'Stripe', description: 'Payment processing and invoicing', icon: 'credit_card', connected: true },
  { id: 2, name: 'SendGrid', description: 'Transactional email and notifications', icon: 'mail', connected: true },
  { id: 3, name: 'Google Analytics', description: 'Website traffic and behaviour analytics', icon: 'bar_chart', connected: true },
  { id: 4, name: 'Twilio', description: 'SMS notifications and 2FA', icon: 'sms', connected: false },
  { id: 5, name: 'Mapbox', description: 'Interactive hotel location maps', icon: 'map', connected: false },
  { id: 6, name: 'Cloudinary', description: 'Image storage and optimisation', icon: 'image', connected: true },
])

function generateKey() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  const rand = Array.from({ length: 32 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  generated.value = `vh_live_${rand}`
}

async function copyKey() {
  await navigator.clipboard.writeText(generated.value)
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}

function revokeKey(key: any) { key.active = false }
function deleteKey(key: any) { apiKeys.value = apiKeys.value.filter(k => k.id !== key.id) }
</script>

<style scoped>
.admin-page { padding: 2.5rem; font-family: 'Inter', sans-serif; }
.page-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 1.5rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
.page-eyebrow { font-size: 0.6875rem; text-transform: uppercase; letter-spacing: 0.08em; color: #6d7979; font-weight: 600; margin: 0; }
.page-title { font-size: 1.625rem; font-weight: 700; color: #015081; margin: 0.25rem 0; letter-spacing: -0.02em; }
.page-desc { font-size: 0.875rem; color: #3d4949; margin: 0; }
.btn-primary { display: flex; align-items: center; gap: 0.375rem; padding: 0.625rem 1.25rem; background: linear-gradient(135deg,#006768,#008283); color: #fff; border: none; border-radius: 0.5rem; font-weight: 700; font-size: 0.875rem; cursor: pointer; font-family: 'Inter', sans-serif; }

.new-key-banner { display: flex; align-items: center; gap: 1rem; background: #fff8e1; border: 1.5px solid #CDAF5D; border-radius: 0.75rem; padding: 1rem 1.25rem; margin-bottom: 1.5rem; }
.new-key-banner .material-symbols-outlined { font-size: 1.5rem; color: #735c10; flex-shrink: 0; }
.key-banner-label { font-size: 0.8125rem; font-weight: 600; color: #735c10; margin: 0 0 0.25rem; }
.key-value { font-family: monospace; font-size: 0.9375rem; color: #015081; background: transparent; border: none; font-weight: 700; }
.copy-btn { margin-left: auto; background: none; border: 1px solid #bcc9c8; border-radius: 0.375rem; padding: 0.375rem; cursor: pointer; color: #3d4949; display: flex; flex-shrink: 0; }
.copy-btn:hover { background: #edf5fc; }

.integrations-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
@media (max-width: 900px) { .integrations-layout { grid-template-columns: 1fr; } }

.section-card { background: #fff; border-radius: 0.875rem; padding: 1.5rem; box-shadow: 0 1px 4px rgba(1,80,129,0.06); }
.section-card--full { grid-column: 1 / -1; }
.section-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; }
.section-title { display: flex; align-items: center; gap: 0.5rem; font-size: 0.9375rem; font-weight: 700; color: #015081; margin: 0 0 1.25rem; }
.section-title .material-symbols-outlined { font-size: 1.125rem; color: #006768; }

.data-table { width: 100%; border-collapse: collapse; }
.data-table th { text-align: left; padding: 0.75rem 1rem; font-size: 0.6875rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #6d7979; background: #f5faff; border-bottom: 1px solid #e1e9f0; }
.data-table td { padding: 0.75rem 1rem; border-bottom: 1px solid #e1e9f0; font-size: 0.875rem; }
.data-table tr:last-child td { border-bottom: none; }
.td-name { font-weight: 600; color: #151d22; }
.td-date { color: #6d7979; font-size: 0.8125rem; }
.key-masked { font-family: monospace; font-size: 0.8125rem; background: #f5faff; padding: 0.2rem 0.5rem; border-radius: 0.25rem; color: #3d4949; }

.status-pill { display: inline-block; padding: 0.2rem 0.625rem; border-radius: 999px; font-size: 0.6875rem; font-weight: 700; text-transform: uppercase; }
.pill--active { background: #e0f2f1; color: #006768; }
.pill--revoked { background: #ffdad6; color: #ba1a1a; }
.pill--disconnected { background: #e7eff6; color: #6d7979; }

.row-actions { display: flex; gap: 0.375rem; }
.row-btn { width: 2rem; height: 2rem; border-radius: 0.375rem; border: 1px solid #e1e9f0; background: transparent; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #3d4949; transition: all 0.15s; }
.row-btn .material-symbols-outlined { font-size: 1rem; }
.row-btn:hover { background: #edf5fc; border-color: #006768; color: #006768; }
.row-btn--danger:hover { background: #ffdad6; border-color: #ba1a1a; color: #ba1a1a; }

.webhook-list { display: flex; flex-direction: column; gap: 0.75rem; }
.webhook-row { display: flex; align-items: flex-start; gap: 0.875rem; padding: 0.875rem; border: 1px solid #e1e9f0; border-radius: 0.625rem; }
.webhook-status-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; margin-top: 0.375rem; }
.dot--active { background: #006768; }
.dot--inactive { background: #bcc9c8; }
.webhook-info { flex: 1; }
.webhook-url { font-size: 0.875rem; font-weight: 600; color: #015081; margin: 0 0 0.375rem; font-family: monospace; }
.webhook-events { display: flex; flex-wrap: wrap; gap: 0.375rem; }
.event-tag { background: #edf5fc; color: #236294; padding: 0.1rem 0.5rem; border-radius: 0.25rem; font-size: 0.6875rem; font-weight: 600; }

.integrations-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; }
.integ-card { display: flex; align-items: center; gap: 0.875rem; padding: 1rem; border: 1px solid #e1e9f0; border-radius: 0.75rem; transition: border-color 0.15s; }
.integ-card:hover { border-color: #bcc9c8; }
.integ-logo { width: 2.5rem; height: 2.5rem; background: #f5faff; border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.integ-logo .material-symbols-outlined { font-size: 1.25rem; color: #006768; }
.integ-info { flex: 1; }
.integ-name { font-size: 0.9375rem; font-weight: 700; color: #151d22; margin: 0; }
.integ-desc { font-size: 0.75rem; color: #6d7979; margin: 0.125rem 0 0; }
.integ-actions { display: flex; flex-direction: column; align-items: flex-end; gap: 0.375rem; }
.btn-integ { padding: 0.25rem 0.625rem; border: 1px solid #bcc9c8; border-radius: 0.375rem; background: transparent; color: #006768; font-size: 0.75rem; font-weight: 600; cursor: pointer; white-space: nowrap; font-family: 'Inter', sans-serif; }
.btn-integ:hover { background: #edf5fc; }
.btn-ghost-sm { display: flex; align-items: center; gap: 0.25rem; padding: 0.375rem 0.75rem; border: 1px solid #bcc9c8; border-radius: 0.375rem; background: transparent; color: #006768; font-size: 0.8125rem; font-weight: 600; cursor: pointer; font-family: 'Inter', sans-serif; }
.btn-ghost-sm:hover { background: #edf5fc; }
</style>
