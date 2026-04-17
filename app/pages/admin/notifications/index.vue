<template>
  <div>
    <Head>
      <title>Notifications — VoyageHub Admin</title>
      <meta name="description" content="Manage notification templates and communication settings for VoyageHub." />
    </Head>

    <div class="admin-page">
      <div class="page-header">
        <div>
          <p class="page-eyebrow">Communications</p>
          <h1 class="page-title">Notification Templates</h1>
          <p class="page-desc">Configure automated email and SMS notifications sent to users</p>
        </div>
        <button id="notif-preview-btn" class="btn-preview" @click="previewTemplate">
          <span class="material-symbols-outlined">preview</span> Preview
        </button>
      </div>

      <div class="notif-layout">
        <!-- Template list -->
        <div class="templates-list">
          <h3 class="subsection-title">Email Templates</h3>
          <div
            v-for="t in templates"
            :key="t.id"
            :id="`template-${t.id}`"
            :class="['template-item', { 'template-item--selected': selected?.id === t.id }]"
            @click="selected = { ...t }"
          >
            <span class="material-symbols-outlined template-icon" :class="`icon--${t.type}`">{{ t.icon }}</span>
            <div>
              <p class="template-name">{{ t.name }}</p>
              <p class="template-trigger">Trigger: {{ t.trigger }}</p>
            </div>
            <span class="material-symbols-outlined" style="color:#bcc9c8;margin-left:auto">chevron_right</span>
          </div>

          <h3 class="subsection-title" style="margin-top:1.5rem">SMS Templates</h3>
          <div
            v-for="t in smsTemplates"
            :key="t.id"
            :id="`template-sms-${t.id}`"
            :class="['template-item', { 'template-item--selected': selected?.id === t.id }]"
            @click="selected = { ...t }"
          >
            <span class="material-symbols-outlined template-icon icon--sms">{{ t.icon }}</span>
            <div>
              <p class="template-name">{{ t.name }}</p>
              <p class="template-trigger">Trigger: {{ t.trigger }}</p>
            </div>
            <span class="material-symbols-outlined" style="color:#bcc9c8;margin-left:auto">chevron_right</span>
          </div>
        </div>

        <!-- Editor panel -->
        <div class="editor-panel">
          <template v-if="selected">
            <div class="editor-header">
              <span class="material-symbols-outlined editor-icon" :class="`icon--${selected.type}`">{{ selected.icon }}</span>
              <div>
                <h3 class="editor-title">{{ selected.name }}</h3>
                <p class="editor-trigger">Trigger: <strong>{{ selected.trigger }}</strong></p>
              </div>
            </div>

            <div class="field-group">
              <label class="field-label" for="notif-subject">Subject line</label>
              <input id="notif-subject" v-model="selected.subject" class="field-input" type="text" placeholder="Email subject…" />
            </div>

            <div class="field-group">
              <label class="field-label" for="notif-body">Message body</label>
              <div class="tokens-bar">
                <span class="token-label">Available tokens:</span>
                <span class="token" v-for="tok in tokens" :key="tok" @click="insertToken(tok)">{{ tok }}</span>
              </div>
              <textarea id="notif-body" v-model="selected.body" class="field-input field-textarea" rows="10"></textarea>
            </div>

            <div class="field-group">
              <label class="field-label" for="notif-recipients">Recipients</label>
              <select id="notif-recipients" v-model="selected.recipients" class="field-input">
                <option value="client">Client only</option>
                <option value="admin">Admin only</option>
                <option value="both">Client & Admin</option>
              </select>
            </div>

            <div class="editor-footer">
              <button class="btn-ghost" @click="selected = null">Cancel</button>
              <button id="notif-save-btn" class="btn-save" @click="saveTemplate">
                <span class="material-symbols-outlined">save</span> Save Template
              </button>
            </div>
          </template>

          <div v-else class="editor-empty">
            <span class="material-symbols-outlined">mail_outline</span>
            <p>Select a template on the left to edit it</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

definePageMeta({ layout: 'admin' })

interface Template {
  id: number; name: string; trigger: string; icon: string; type: string;
  subject: string; body: string; recipients: string;
}

const selected = ref<Template | null>(null)
const tokens = ['{{user_name}}', '{{hotel_name}}', '{{check_in}}', '{{check_out}}', '{{amount}}', '{{conf_code}}']

const templates = ref<Template[]>([
  { id: 1, name: 'Booking Confirmation', trigger: 'reservation.created', icon: 'check_circle', type: 'success', subject: 'Your booking at {{hotel_name}} is confirmed!', body: 'Dear {{user_name}},\n\nYour reservation at {{hotel_name}} is confirmed.\n\nCheck-in: {{check_in}}\nCheck-out: {{check_out}}\nTotal: {{amount}}\n\nConfirmation Code: {{conf_code}}\n\nThank you for choosing VoyageHub!', recipients: 'client' },
  { id: 2, name: 'Booking Cancellation', trigger: 'reservation.cancelled', icon: 'cancel', type: 'danger', subject: 'Your booking has been cancelled', body: 'Dear {{user_name}},\n\nYour reservation ({{conf_code}}) at {{hotel_name}} has been cancelled.\n\nIf you did not request this cancellation, please contact us immediately.\n\nVoyageHub Support', recipients: 'both' },
  { id: 3, name: 'Check-in Reminder', trigger: 'reservation.checkin_reminder', icon: 'notifications', type: 'info', subject: 'Reminder: Your check-in at {{hotel_name}} is tomorrow', body: 'Dear {{user_name}},\n\nThis is a reminder that your stay at {{hotel_name}} begins tomorrow.\n\nCheck-in: {{check_in}}\n\nWe look forward to welcoming you!', recipients: 'client' },
  { id: 4, name: 'Complaint Received', trigger: 'complaint.created', icon: 'forum', type: 'warning', subject: 'We received your complaint — Reference: {{conf_code}}', body: 'Dear {{user_name}},\n\nThank you for reaching out. We have received your complaint and our team will review it within 48 hours.\n\nReference: {{conf_code}}\n\nVoyageHub Support Team', recipients: 'client' },
  { id: 5, name: 'Welcome Email', trigger: 'user.registered', icon: 'waving_hand', type: 'success', subject: 'Welcome to VoyageHub, {{user_name}}!', body: 'Dear {{user_name}},\n\nWelcome to VoyageHub! We\'re thrilled to have you on board.\n\nStart exploring hundreds of curated hotels and exclusive offers.\n\nHappy travels!', recipients: 'client' },
])

const smsTemplates = ref<Template[]>([
  { id: 10, name: 'SMS Booking Confirmation', trigger: 'reservation.created', icon: 'sms', type: 'sms', subject: '', body: 'VoyageHub: Your booking at {{hotel_name}} is confirmed. Code: {{conf_code}}. Check-in: {{check_in}}.', recipients: 'client' },
  { id: 11, name: 'SMS Check-in Reminder', trigger: 'reservation.checkin_reminder', icon: 'sms', type: 'sms', subject: '', body: 'VoyageHub Reminder: Your stay at {{hotel_name}} starts tomorrow. Check-in: {{check_in}}.', recipients: 'client' },
])

function insertToken(token: string) {
  if (!selected.value) return
  selected.value.body += token
}

function saveTemplate() {
  const idx = templates.value.findIndex(t => t.id === selected.value?.id)
  if (idx !== -1 && selected.value) templates.value[idx] = { ...selected.value }
  else {
    const smsIdx = smsTemplates.value.findIndex(t => t.id === selected.value?.id)
    if (smsIdx !== -1 && selected.value) smsTemplates.value[smsIdx] = { ...selected.value }
  }
  selected.value = null
}

function previewTemplate() {
  if (!selected.value) return
  alert(`Preview:\n\nSubject: ${selected.value.subject}\n\n${selected.value.body}`)
}
</script>

<style scoped>
.admin-page { padding: 2.5rem; font-family: 'Inter', sans-serif; }
.page-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 1.5rem; margin-bottom: 2rem; flex-wrap: wrap; }
.page-eyebrow { font-size: 0.6875rem; text-transform: uppercase; letter-spacing: 0.08em; color: #6d7979; font-weight: 600; margin: 0; }
.page-title { font-size: 1.625rem; font-weight: 700; color: #015081; margin: 0.25rem 0; letter-spacing: -0.02em; }
.page-desc { font-size: 0.875rem; color: #3d4949; margin: 0; }
.btn-preview { display: flex; align-items: center; gap: 0.375rem; padding: 0.625rem 1.25rem; border: 1.5px solid #006768; background: transparent; color: #006768; font-weight: 700; font-size: 0.875rem; border-radius: 0.5rem; cursor: pointer; font-family: 'Inter', sans-serif; }
.btn-preview:hover { background: #e0f2f1; }

.notif-layout { display: grid; grid-template-columns: 300px 1fr; gap: 1.5rem; align-items: start; }
@media (max-width: 800px) { .notif-layout { grid-template-columns: 1fr; } }

.subsection-title { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #6d7979; margin: 0 0 0.75rem; }
.templates-list { background: #fff; border-radius: 0.875rem; padding: 1.25rem; box-shadow: 0 1px 4px rgba(1,80,129,0.06); }
.template-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; border-radius: 0.625rem; cursor: pointer; transition: background 0.15s; margin-bottom: 0.375rem; }
.template-item:hover { background: #f5faff; }
.template-item--selected { background: #edf5fc; }
.template-icon { font-size: 1.25rem; width: 2rem; height: 2rem; display: flex; align-items: center; justify-content: center; border-radius: 0.375rem; font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
.icon--success { background: #e0f2f1; color: #006768; }
.icon--danger { background: #ffdad6; color: #ba1a1a; }
.icon--info { background: #e3f2fd; color: #236294; }
.icon--warning { background: #fff8e1; color: #735c10; }
.icon--sms { background: #e8eaf6; color: #3949ab; }
.template-name { font-size: 0.875rem; font-weight: 600; color: #151d22; margin: 0; }
.template-trigger { font-size: 0.6875rem; color: #6d7979; font-family: monospace; margin: 0.125rem 0 0; }

.editor-panel { background: #fff; border-radius: 0.875rem; padding: 1.75rem; box-shadow: 0 1px 4px rgba(1,80,129,0.06); }
.editor-header { display: flex; align-items: center; gap: 0.875rem; margin-bottom: 1.5rem; padding-bottom: 1.25rem; border-bottom: 1px solid #e1e9f0; }
.editor-icon { font-size: 1.25rem; width: 2.5rem; height: 2.5rem; display: flex; align-items: center; justify-content: center; border-radius: 0.5rem; flex-shrink: 0; }
.editor-title { font-size: 1.0625rem; font-weight: 700; color: #015081; margin: 0; }
.editor-trigger { font-size: 0.8125rem; color: #6d7979; margin: 0.125rem 0 0; }
.editor-trigger strong { color: #006768; font-family: monospace; }

.field-group { display: flex; flex-direction: column; gap: 0.375rem; margin-bottom: 1.25rem; }
.field-label { font-size: 0.8125rem; font-weight: 600; color: #151d22; }
.field-input { padding: 0.625rem 0.875rem; border: 1px solid #bcc9c8; border-radius: 0.5rem; font-size: 0.875rem; color: #151d22; outline: none; transition: border-color 0.15s; font-family: 'Inter', sans-serif; }
.field-input:focus { border-color: #008F90; box-shadow: 0 0 0 2px rgba(0,143,144,0.15); }
.field-textarea { resize: vertical; min-height: 220px; font-family: 'Inter', sans-serif; line-height: 1.6; }

.tokens-bar { display: flex; align-items: center; flex-wrap: wrap; gap: 0.375rem; margin-bottom: 0.5rem; }
.token-label { font-size: 0.6875rem; color: #6d7979; font-weight: 600; }
.token { background: #edf5fc; color: #006768; padding: 0.1rem 0.5rem; border-radius: 0.25rem; font-size: 0.6875rem; font-family: monospace; cursor: pointer; transition: background 0.15s; }
.token:hover { background: #006768; color: #fff; }

.editor-footer { display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid #e1e9f0; }
.btn-ghost { padding: 0.5rem 1rem; border: 1.5px solid #bcc9c8; border-radius: 0.5rem; background: transparent; color: #3d4949; font-size: 0.875rem; font-weight: 600; cursor: pointer; font-family: 'Inter', sans-serif; }
.btn-ghost:hover { background: #f5faff; }
.btn-save { display: flex; align-items: center; gap: 0.375rem; padding: 0.5rem 1.25rem; background: linear-gradient(135deg,#006768,#008283); border: none; border-radius: 0.5rem; color: #fff; font-size: 0.875rem; font-weight: 700; cursor: pointer; font-family: 'Inter', sans-serif; }
.btn-save:hover { opacity: 0.9; }

.editor-empty { text-align: center; padding: 4rem 2rem; color: #6d7979; }
.editor-empty .material-symbols-outlined { font-size: 3rem; display: block; margin-bottom: 1rem; color: #bcc9c8; }
.editor-empty p { font-size: 0.9375rem; margin: 0; }
</style>
