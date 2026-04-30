<template>
  <div>
    <Head>
      <title>{{ copy.metaTitle }}</title>
      <meta
        name="description"
        :content="copy.metaDescription"
      />
    </Head>

    <div class="admin-page">
      <div class="page-header">
        <div>
          <p class="page-eyebrow">{{ copy.eyebrow }}</p>
          <h1 class="page-title">{{ copy.title }}</h1>
          <p class="page-desc">{{ copy.subtitle }}</p>
        </div>
        <div class="header-actions">
          <button class="btn-outline" @click="loadTemplates">
            <span class="material-symbols-outlined">refresh</span>
            {{ copy.refresh }}
          </button>
        </div>
      </div>

      <div v-if="banner" class="alert-success">
        <span class="material-symbols-outlined">check_circle</span>
        {{ banner }}
      </div>

      <div v-if="error" class="alert-error">
        <span class="material-symbols-outlined">error</span>
        {{ error }}
      </div>

      <div class="summary-grid">
        <article class="summary-card">
          <span>{{ copy.totalTemplates }}</span>
          <strong>{{ templates.length }}</strong>
        </article>
        <article class="summary-card">
          <span>{{ copy.activeTemplates }}</span>
          <strong>{{ templates.filter(t => t.isActive).length }}</strong>
        </article>
        <article class="summary-card">
          <span>{{ copy.emailTemplates }}</span>
          <strong>{{ emailTemplates.length }}</strong>
        </article>
        <article class="summary-card">
          <span>{{ copy.smsTemplates }}</span>
          <strong>{{ smsTemplates.length }}</strong>
        </article>
      </div>

      <div class="toolbar">
        <label class="search-field">
          <span class="material-symbols-outlined">search</span>
          <input v-model="search" type="text" :placeholder="copy.searchPlaceholder" />
        </label>
        <select v-model="channelFilter">
          <option value="">{{ copy.allChannels }}</option>
          <option value="EMAIL">{{ copy.email }}</option>
          <option value="SMS">{{ copy.sms }}</option>
        </select>
        <select v-model="statusFilter">
          <option value="">{{ copy.allStatuses }}</option>
          <option value="active">{{ copy.active }}</option>
          <option value="inactive">{{ copy.inactive }}</option>
        </select>
      </div>

      <div class="layout">
        <aside class="template-list">
          <div class="template-group">
            <h3>{{ copy.email }}</h3>
            <button
              v-for="template in emailTemplates"
              :key="template.id"
              class="template-item"
              :class="{ 'template-item--active': selectedId === template.id }"
              @click="selectTemplate(template)"
            >
              <strong>{{ template.name }}</strong>
              <span>{{ template.trigger }}</span>
            </button>
          </div>

          <div class="template-group">
            <h3>{{ copy.sms }}</h3>
            <button
              v-for="template in smsTemplates"
              :key="template.id"
              class="template-item"
              :class="{ 'template-item--active': selectedId === template.id }"
              @click="selectTemplate(template)"
            >
              <strong>{{ template.name }}</strong>
              <span>{{ template.trigger }}</span>
            </button>
          </div>
        </aside>

        <section class="editor-card">
          <div v-if="draft" class="editor-grid">
            <div class="editor-panel">
              <div class="editor-header">
                <div>
                  <h2>{{ draft.name }}</h2>
                  <p>{{ draft.slug }}</p>
                </div>
                <label class="toggle-row">
                  <input v-model="draft.isActive" type="checkbox" />
                  <span>{{ copy.active }}</span>
                </label>
              </div>

              <div class="form-grid">
                <label>
                  <span>{{ copy.name }}</span>
                  <input v-model="draft.name" type="text" />
                </label>
                <label>
                  <span>{{ copy.trigger }}</span>
                  <input v-model="draft.trigger" type="text" />
                </label>
                <label>
                  <span>{{ copy.channel }}</span>
                  <select v-model="draft.channel">
                    <option value="EMAIL">{{ copy.email }}</option>
                    <option value="SMS">{{ copy.sms }}</option>
                  </select>
                </label>
                <label>
                  <span>{{ copy.recipients }}</span>
                  <select v-model="draft.recipients">
                    <option value="client">{{ copy.clientOnly }}</option>
                    <option value="admin">{{ copy.adminOnly }}</option>
                    <option value="both">{{ copy.clientAndAdmin }}</option>
                  </select>
                </label>
              </div>

              <label class="field-block">
                <span>{{ copy.description }}</span>
                <input v-model="draft.description" type="text" />
              </label>

              <label v-if="draft.channel === 'EMAIL'" class="field-block">
                <span>{{ copy.subject }}</span>
                <input v-model="draft.subject" type="text" />
              </label>

              <div class="field-block">
                <div class="field-row">
                  <span>{{ copy.body }}</span>
                  <div class="token-list">
                    <button
                      v-for="token in tokens"
                      :key="token"
                      type="button"
                      class="token-btn"
                      @click="insertToken(token)"
                    >
                      {{ token }}
                    </button>
                  </div>
                </div>
                <textarea v-model="draft.body" rows="12"></textarea>
              </div>

              <div class="editor-actions">
                <button class="btn-ghost" @click="resetDraft">{{ copy.reset }}</button>
                <button class="btn-primary" :disabled="saving" @click="saveTemplate">
                  <span class="material-symbols-outlined">save</span>
                  {{ saving ? copy.saving : copy.saveTemplate }}
                </button>
              </div>
            </div>

            <div class="preview-panel">
              <h3>{{ copy.preview }}</h3>
              <div class="preview-card">
                <p v-if="draft.channel === 'EMAIL'" class="preview-subject">{{ previewSubject }}</p>
                <pre class="preview-body">{{ previewBody }}</pre>
              </div>
            </div>
          </div>

          <div v-else class="empty-state">
            <span class="material-symbols-outlined">mail_outline</span>
            <p>{{ copy.selectTemplate }}</p>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { MailTemplate } from '~/types/models'
import { MailAdminService } from '~/services/MailAdminService'

definePageMeta({ layout: 'admin' })

const service = new MailAdminService()
const { t } = useAppI18n()
const templates = ref<MailTemplate[]>([])
const draft = ref<MailTemplate | null>(null)
const selectedId = ref<number | null>(null)
const error = ref<string | null>(null)
const banner = ref('')
const saving = ref(false)
const search = ref('')
const channelFilter = ref('')
const statusFilter = ref('')

const copy = computed(() => {
  return {
    metaTitle: t("adminNotifications.metaTitle"),
    metaDescription: t("adminNotifications.metaDescription"),
    eyebrow: t("adminNotifications.eyebrow"),
    title: t("adminNotifications.title"),
    subtitle: t("adminNotifications.subtitle"),
    refresh: t("adminNotifications.refresh"),
    totalTemplates: t("adminNotifications.totalTemplates"),
    activeTemplates: t("adminNotifications.activeTemplates"),
    emailTemplates: t("adminNotifications.emailTemplates"),
    smsTemplates: t("adminNotifications.smsTemplates"),
    searchPlaceholder: t("adminNotifications.searchPlaceholder"),
    allChannels: t("adminNotifications.allChannels"),
    email: t("adminNotifications.email"),
    sms: t("adminNotifications.sms"),
    allStatuses: t("adminNotifications.allStatuses"),
    active: t("adminNotifications.active"),
    inactive: t("adminNotifications.inactive"),
    name: t("adminNotifications.name"),
    trigger: t("adminNotifications.trigger"),
    channel: t("adminNotifications.channel"),
    recipients: t("adminNotifications.recipients"),
    clientOnly: t("adminNotifications.clientOnly"),
    adminOnly: t("adminNotifications.adminOnly"),
    clientAndAdmin: t("adminNotifications.clientAndAdmin"),
    description: t("adminNotifications.description"),
    subject: t("adminNotifications.subject"),
    body: t("adminNotifications.body"),
    reset: t("adminNotifications.reset"),
    saving: t("adminNotifications.saving"),
    saveTemplate: t("adminNotifications.saveTemplate"),
    preview: t("adminNotifications.preview"),
    selectTemplate: t("adminNotifications.selectTemplate"),
    saved: t("adminNotifications.saved"),
    saveError: t("adminNotifications.saveError"),
    loadError: t("adminNotifications.loadError"),
  }
})

const tokens = [
  '{{user_name}}',
  '{{reset_url}}',
  '{{hotel_name}}',
  '{{check_in}}',
  '{{check_out}}',
  '{{amount}}',
  '{{conf_code}}',
  '{{support_email}}',
]

const sampleValues: Record<string, string> = {
  '{{user_name}}': 'Amina',
  '{{reset_url}}': 'http://agence-bay.vercel.app//reset-password?token=demo',
  '{{hotel_name}}': 'Azure Palais',
  '{{check_in}}': '2026-06-21',
  '{{check_out}}': '2026-06-25',
  '{{amount}}': '980.00 EUR',
  '{{conf_code}}': 'VH-2026-DEMO',
  '{{support_email}}': 'support@voyagehub.com',
}

const filteredTemplates = computed(() => {
  return templates.value.filter((template) => {
    const matchesSearch = !search.value ||
      template.name.toLowerCase().includes(search.value.toLowerCase()) ||
      template.trigger.toLowerCase().includes(search.value.toLowerCase())
    const matchesChannel = !channelFilter.value || template.channel === channelFilter.value
    const matchesStatus = !statusFilter.value ||
      (statusFilter.value === 'active' && template.isActive) ||
      (statusFilter.value === 'inactive' && !template.isActive)
    return matchesSearch && matchesChannel && matchesStatus
  })
})

const emailTemplates = computed(() => filteredTemplates.value.filter((template) => template.channel === 'EMAIL'))
const smsTemplates = computed(() => filteredTemplates.value.filter((template) => template.channel === 'SMS'))

const previewSubject = computed(() => renderTokens(draft.value?.subject || ''))
const previewBody = computed(() => renderTokens(draft.value?.body || ''))

function renderTokens(value: string) {
  return Object.entries(sampleValues).reduce(
    (result, [token, sample]) => result.replaceAll(token, sample),
    value,
  )
}

function selectTemplate(template: MailTemplate) {
  selectedId.value = template.id
  draft.value = { ...template, description: template.description || '', recipients: template.recipients || 'client', subject: template.subject || '', type: template.type || 'info' }
}

function resetDraft() {
  const source = templates.value.find((template) => template.id === selectedId.value)
  if (source) {
    selectTemplate(source)
  }
}

function insertToken(token: string) {
  if (!draft.value) return
  draft.value.body = `${draft.value.body}${draft.value.body.endsWith(' ') || !draft.value.body ? '' : ' '}${token}`
}

async function loadTemplates() {
  error.value = null
  const nextTemplates = await service.getTemplates()
  templates.value = nextTemplates
  const first = nextTemplates.find((template) => template.id === selectedId.value) || nextTemplates[0]
  if (first) {
    selectTemplate(first)
  }
}

async function saveTemplate() {
  if (!draft.value) return

  saving.value = true
  error.value = null
  banner.value = ''

  try {
    const updated = await service.updateTemplate(draft.value.id, {
      name: draft.value.name,
      description: draft.value.description || '',
      trigger: draft.value.trigger,
      subject: draft.value.channel === 'EMAIL' ? draft.value.subject || '' : null,
      body: draft.value.body,
      recipients: draft.value.recipients || 'client',
      type: draft.value.type || 'info',
      isActive: draft.value.isActive,
      channel: draft.value.channel,
    })

    templates.value = templates.value.map((template) =>
      template.id === updated.id ? updated : template,
    )
    selectTemplate(updated)
    banner.value = copy.value.saved.replace("{name}", updated.name)
  } catch (cause: any) {
    error.value = cause.message || copy.value.saveError
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  try {
    await loadTemplates()
  } catch (cause: any) {
    error.value = cause.message || copy.value.loadError
  }
})
</script>

<style scoped>
.admin-page { padding: 2.5rem; }
.page-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 1.5rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
.header-actions { display: flex; gap: 0.5rem; }
.page-eyebrow { font-size: 0.6875rem; text-transform: uppercase; letter-spacing: 0.08em; color: #6d7979; font-weight: 600; margin: 0; }
.page-title { font-size: 1.625rem; font-weight: 700; color: #015081; margin: 0.25rem 0; }
.page-desc { font-size: 0.875rem; color: #3d4949; margin: 0; max-width: 65ch; }
.alert-success, .alert-error { display: flex; align-items: center; gap: 0.5rem; padding: 0.85rem 1rem; border-radius: 0.75rem; margin-bottom: 1rem; font-size: 0.875rem; font-weight: 600; }
.alert-success { background: #e0f2f1; color: #006768; }
.alert-error { background: #fdecea; color: #ba1a1a; }
.summary-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; margin-bottom: 1.5rem; }
.summary-card { background: #fff; border: 1px solid #e1e9f0; border-radius: 16px; padding: 14px 16px; }
.summary-card span { display: block; font-size: 0.8rem; color: #6d7979; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; }
.summary-card strong { display: block; margin-top: 6px; color: #015081; font-size: 1.5rem; }
.toolbar { background: #fff; padding: 20px; border-radius: 20px; border: 1px solid #e1e9f0; box-shadow: 0 4px 20px -4px rgba(0, 103, 104, 0.05); display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 16px; align-items: end; margin-bottom: 1.5rem; }
.search-field { position: relative; }
.search-field .material-symbols-outlined { position: absolute; left: 18px; top: 50%; transform: translateY(-50%); color: #6d7979; }
.search-field input { width: 100%; border: 1px solid #bcc9c8; border-radius: 16px; background: #f8fbff; padding: 15px 18px 15px 52px; font-size: 14px; outline: none; }
.search-field input:focus { background: #fff; border-color: #008F90; box-shadow: 0 0 0 4px rgba(0,143,144,0.1); }
select { border: 1px solid #bcc9c8; border-radius: 12px; background: #f8fbff; padding: 12px 16px; font-size: 14px; outline: none; }
select:focus { background: #fff; border-color: #008F90; box-shadow: 0 0 0 3px rgba(0,143,144,0.12); }
.layout { display: grid; grid-template-columns: 320px 1fr; gap: 1rem; }
.template-list, .editor-card { background: #fff; border: 1px solid #e1e9f0; border-radius: 0.875rem; box-shadow: 0 1px 4px rgba(1,80,129,0.06); }
.template-list { padding: 1rem; display: grid; gap: 1rem; align-content: start; }
.template-group h3 { margin: 0 0 0.7rem; color: #6d7979; font-size: 0.75rem; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; }
.template-item { width: 100%; text-align: left; border: 1px solid transparent; background: transparent; border-radius: 0.75rem; padding: 0.85rem; display: grid; gap: 0.25rem; cursor: pointer; }
.template-item strong { font-size: 0.88rem; color: #151d22; }
.template-item span { font-size: 0.75rem; color: #6d7979; font-family: var(--font-family-mono); }
.template-item:hover, .template-item--active { background: #f5faff; border-color: #d7e4ef; }
.editor-card { padding: 1rem; min-height: 640px; }
.editor-grid { display: grid; grid-template-columns: minmax(0, 1.25fr) minmax(280px, 0.75fr); gap: 1rem; }
.editor-panel, .preview-panel { border: 1px solid #e1e9f0; border-radius: 0.875rem; padding: 1rem; }
.editor-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; margin-bottom: 1rem; }
.editor-header h2 { margin: 0; color: #015081; font-size: 1.05rem; }
.editor-header p { margin: 0.25rem 0 0; color: #6d7979; font-size: 0.78rem; font-family: var(--font-family-mono); }
.toggle-row { display: inline-flex; align-items: center; gap: 0.45rem; font-size: 0.85rem; font-weight: 700; color: #3d4949; }
.form-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.85rem; }
.field-block, .form-grid label { display: grid; gap: 0.4rem; margin-bottom: 0.85rem; }
.field-block span, .form-grid span { color: #151d22; font-size: 0.8rem; font-weight: 700; }
.field-row { display: flex; justify-content: space-between; align-items: center; gap: 1rem; }
input, select, textarea { width: 100%; border: 1px solid #bcc9c8; border-radius: 0.65rem; padding: 0.72rem 0.85rem; font-size: 0.88rem; outline: none; }
input:focus, select:focus, textarea:focus { border-color: #008F90; box-shadow: 0 0 0 2px rgba(0,143,144,0.12); }
textarea { resize: vertical; min-height: 240px; line-height: 1.55; }
.token-list { display: flex; flex-wrap: wrap; gap: 0.35rem; justify-content: flex-end; }
.token-btn { border: none; background: #edf5fc; color: #006768; border-radius: 999px; padding: 0.28rem 0.55rem; font-size: 0.72rem; font-weight: 700; cursor: pointer; }
.editor-actions { display: flex; justify-content: flex-end; gap: 0.7rem; }
.btn-primary, .btn-ghost, .btn-outline { display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.7rem 1rem; border-radius: 0.65rem; font-size: 0.86rem; font-weight: 700; cursor: pointer; }
.btn-primary { border: none; background: linear-gradient(135deg,#006768,#008283); color: #fff; }
.btn-ghost { border: 1px solid #bcc9c8; background: transparent; color: #3d4949; }
.btn-outline { border: 1px solid #bcc9c8; background: transparent; color: #3d4949; }
.btn-outline:hover { background: #f5faff; border-color: #d7e4ef; }
.preview-panel h3 { margin: 0 0 0.8rem; color: #015081; font-size: 0.95rem; }
.preview-card { border-radius: 0.75rem; border: 1px solid #e1e9f0; background: #f8fbff; padding: 1rem; display: grid; gap: 0.75rem; min-height: 320px; }
.preview-subject { margin: 0; font-size: 0.9rem; font-weight: 800; color: #015081; }
.preview-body { margin: 0; white-space: pre-wrap; font-family: inherit; font-size: 0.84rem; line-height: 1.6; color: #3d4949; }
.empty-state { min-height: 560px; display: grid; place-content: center; gap: 0.7rem; text-align: center; color: #6d7979; }
.empty-state .material-symbols-outlined { font-size: 3rem; color: #bcc9c8; }
@media (max-width: 1100px) {
  .layout, .editor-grid { grid-template-columns: 1fr; }
  .form-grid { grid-template-columns: 1fr; }
  .toolbar { grid-template-columns: 1fr; }
  .summary-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 600px) {
  .summary-grid { grid-template-columns: 1fr; }
}
</style>
