<template>
  <div>
    <Head>
      <title>System Settings — VoyageHub Admin</title>
      <meta name="description" content="Configure system settings and policies for VoyageHub." />
    </Head>

    <div class="admin-page">
      <div class="page-header">
        <div>
          <p class="page-eyebrow">Configuration</p>
          <h1 class="page-title">System Configuration & Policies</h1>
          <p class="page-desc">Manage global settings, policies and feature toggles</p>
        </div>
        <button id="settings-save-btn" class="btn-save" @click="saveAll">
          <span class="material-symbols-outlined">save</span> Save All Changes
        </button>
      </div>

      <div v-if="saved" class="alert-success">
        <span class="material-symbols-outlined">check_circle</span>
        Configuration saved successfully.
      </div>

      <div class="settings-grid">
        <!-- General -->
        <div class="settings-section">
          <div class="section-header">
            <span class="material-symbols-outlined section-icon">tune</span>
            <div>
              <h2 class="section-title">General Settings</h2>
              <p class="section-desc">Core application configuration</p>
            </div>
          </div>
          <div class="config-list">
            <div v-for="config in general" :key="config.key" class="config-item">
              <div class="config-info">
                <p class="config-key">{{ formatKey(config.key) }}</p>
                <p class="config-desc">{{ config.description }}</p>
              </div>
              <input
                :id="`config-${config.key}`"
                v-model="config.value"
                class="config-input"
                type="text"
              />
            </div>
          </div>
        </div>

        <!-- Booking Policies -->
        <div class="settings-section">
          <div class="section-header">
            <span class="material-symbols-outlined section-icon">policy</span>
            <div>
              <h2 class="section-title">Booking Policies</h2>
              <p class="section-desc">Rules governing reservations and cancellations</p>
            </div>
          </div>
          <div class="config-list">
            <div v-for="config in policies" :key="config.key" class="config-item">
              <div class="config-info">
                <p class="config-key">{{ formatKey(config.key) }}</p>
                <p class="config-desc">{{ config.description }}</p>
              </div>
              <input
                :id="`config-${config.key}`"
                v-model="config.value"
                class="config-input"
                type="text"
              />
            </div>
          </div>
        </div>

        <!-- Feature Toggles -->
        <div class="settings-section settings-section--full">
          <div class="section-header">
            <span class="material-symbols-outlined section-icon">toggle_on</span>
            <div>
              <h2 class="section-title">Feature Toggles</h2>
              <p class="section-desc">Enable or disable platform features</p>
            </div>
          </div>
          <div class="toggle-grid">
            <label v-for="toggle in toggles" :key="toggle.key" class="toggle-row" :for="`toggle-${toggle.key}`">
              <div class="toggle-info">
                <p class="toggle-name">{{ formatKey(toggle.key) }}</p>
                <p class="toggle-desc">{{ toggle.description }}</p>
              </div>
              <div class="toggle-switch" :class="{ 'toggle-switch--on': toggle.value === 'true' }" @click="toggle.value = toggle.value === 'true' ? 'false' : 'true'">
                <div class="toggle-thumb"></div>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { SystemConfig } from '~/types/models'
import { MockSystemConfigRepository } from '~/repositories/mock'

definePageMeta({ layout: 'admin' })

const repo = new MockSystemConfigRepository()
const configs = ref<SystemConfig[]>([])
const saved = ref(false)

const general = computed(() => configs.value.filter(c => c.key.startsWith('app_') || c.key.startsWith('site_') || c.key.startsWith('agency_')))
const policies = computed(() => configs.value.filter(c => c.key.startsWith('booking_') || c.key.startsWith('cancellation_') || c.key.startsWith('max_') || c.key.startsWith('min_')))
const toggles = computed(() => configs.value.filter(c => c.value === 'true' || c.value === 'false'))

function formatKey(k: string) {
  return k.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

async function saveAll() {
  for (const c of configs.value) {
    await repo.update(c.key, c.value)
  }
  saved.value = true
  setTimeout(() => (saved.value = false), 3000)
}

onMounted(async () => { configs.value = await repo.getAll() })
</script>

<style scoped>
.admin-page { padding: 2.5rem; font-family: 'Inter', sans-serif; }
.page-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 1.5rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
.page-eyebrow { font-size: 0.6875rem; text-transform: uppercase; letter-spacing: 0.08em; color: #6d7979; font-weight: 600; margin: 0; }
.page-title { font-size: 1.625rem; font-weight: 700; color: #015081; margin: 0.25rem 0; letter-spacing: -0.02em; }
.page-desc { font-size: 0.875rem; color: #3d4949; margin: 0; }
.btn-save { display: flex; align-items: center; gap: 0.375rem; padding: 0.625rem 1.25rem; background: linear-gradient(135deg,#006768,#008283); color: #fff; border: none; border-radius: 0.5rem; font-weight: 700; font-size: 0.875rem; cursor: pointer; font-family: 'Inter', sans-serif; }
.btn-save:hover { opacity: 0.9; }

.alert-success { display: flex; align-items: center; gap: 0.5rem; background: #e0f2f1; border-left: 3px solid #006768; color: #006768; padding: 0.75rem 1rem; border-radius: 0.5rem; margin-bottom: 1.5rem; font-weight: 600; font-size: 0.875rem; }

.settings-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
@media (max-width: 900px) { .settings-grid { grid-template-columns: 1fr; } }
.settings-section { background: #fff; border-radius: 0.875rem; padding: 1.5rem; box-shadow: 0 1px 4px rgba(1,80,129,0.06); }
.settings-section--full { grid-column: 1 / -1; }

.section-header { display: flex; align-items: center; gap: 0.875rem; margin-bottom: 1.25rem; padding-bottom: 1.25rem; border-bottom: 1px solid #e1e9f0; }
.section-icon { font-size: 1.5rem; color: #006768; background: #e0f2f1; padding: 0.5rem; border-radius: 0.5rem; font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
.section-title { font-size: 1rem; font-weight: 700; color: #015081; margin: 0; }
.section-desc { font-size: 0.8125rem; color: #6d7979; margin: 0.125rem 0 0; }

.config-list { display: flex; flex-direction: column; gap: 1rem; }
.config-item { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
.config-info { flex: 1; }
.config-key { font-size: 0.875rem; font-weight: 600; color: #151d22; margin: 0; }
.config-desc { font-size: 0.75rem; color: #6d7979; margin: 0.125rem 0 0; }
.config-input { padding: 0.5rem 0.875rem; border: 1px solid #bcc9c8; border-radius: 0.5rem; font-size: 0.875rem; color: #151d22; width: 180px; outline: none; font-family: 'Inter', sans-serif; flex-shrink: 0; }
.config-input:focus { border-color: #008F90; box-shadow: 0 0 0 2px rgba(0,143,144,0.15); }

.toggle-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; }
.toggle-row { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 1rem; border: 1px solid #e1e9f0; border-radius: 0.75rem; cursor: pointer; transition: background 0.15s; }
.toggle-row:hover { background: #f5faff; }
.toggle-info { flex: 1; }
.toggle-name { font-size: 0.875rem; font-weight: 600; color: #151d22; margin: 0; }
.toggle-desc { font-size: 0.75rem; color: #6d7979; margin: 0.125rem 0 0; }
.toggle-switch { width: 40px; height: 22px; background: #bcc9c8; border-radius: 999px; position: relative; flex-shrink: 0; transition: background 0.2s; }
.toggle-switch--on { background: #006768; }
.toggle-thumb { width: 16px; height: 16px; background: #fff; border-radius: 50%; position: absolute; top: 3px; left: 3px; transition: transform 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.2); }
.toggle-switch--on .toggle-thumb { transform: translateX(18px); }
</style>
