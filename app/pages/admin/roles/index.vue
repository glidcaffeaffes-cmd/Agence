<template>
  <div>
    <Head>
      <title>Access & Roles — VoyageHub Admin</title>
      <meta name="description" content="Manage access control and role permissions for VoyageHub." />
    </Head>

    <div class="admin-page">
      <div class="page-header">
        <div>
          <p class="page-eyebrow">Security</p>
          <h1 class="page-title">Access & Roles Control</h1>
          <p class="page-desc">Define roles, permissions and access policies</p>
        </div>
        <button id="roles-add-btn" class="btn-primary" @click="showNewRole = true">
          <span class="material-symbols-outlined">add</span> New Role
        </button>
      </div>

      <div class="roles-grid">
        <!-- Role cards -->
        <div class="roles-list">
          <h3 class="subsection-title">Defined Roles</h3>
          <div v-for="role in roles" :key="role.id" :id="`role-${role.id}`"
            :class="['role-card', { 'role-card--selected': selected?.id === role.id }]"
            @click="selected = role">
            <div class="role-icon" :class="`role-icon--${role.color}`">
              <span class="material-symbols-outlined">{{ role.icon }}</span>
            </div>
            <div class="role-info">
              <p class="role-name">{{ role.name }}</p>
              <p class="role-users">{{ role.userCount }} user{{ role.userCount !== 1 ? 's' : '' }}</p>
            </div>
            <span class="material-symbols-outlined role-arrow">chevron_right</span>
          </div>
        </div>

        <!-- Permissions panel -->
        <div class="permissions-panel">
          <template v-if="selected">
            <div class="perm-header">
              <div class="role-icon" :class="`role-icon--${selected.color}`">
                <span class="material-symbols-outlined">{{ selected.icon }}</span>
              </div>
              <div>
                <h3 class="perm-role-name">{{ selected.name }}</h3>
                <p class="perm-desc">{{ selected.description }}</p>
              </div>
            </div>

            <div v-for="group in permissionGroups" :key="group.name" class="perm-group">
              <p class="perm-group-label">{{ group.name }}</p>
              <div class="perm-table">
                <div v-for="perm in group.perms" :key="perm" class="perm-row">
                  <span class="perm-name">{{ perm }}</span>
                  <div class="perm-actions">
                    <label v-for="action in ['Read', 'Write', 'Delete']" :key="action" class="perm-check">
                      <input
                        type="checkbox"
                        :id="`perm-${selected.id}-${perm}-${action}`"
                        v-model="getPermission(selected.id, perm, action).checked"
                        :class="{ 'check--write': action === 'Write', 'check--delete': action === 'Delete' }"
                      />
                      <span>{{ action }}</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div class="perm-footer">
              <button class="btn-ghost" @click="selected = null">Close</button>
              <button id="roles-save-btn" class="btn-save-perm" @click="savePermissions">Save Permissions</button>
            </div>
          </template>

          <div v-else class="perm-empty">
            <span class="material-symbols-outlined">manage_accounts</span>
            <p>Select a role on the left to view and edit its permissions</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

definePageMeta({ layout: 'admin' })

interface Role { id: number; name: string; description: string; icon: string; color: string; userCount: number }

const roles = ref<Role[]>([
  { id: 1, name: 'Super Admin', description: 'Full access to all system features', icon: 'shield', color: 'navy', userCount: 1 },
  { id: 2, name: 'Hotel Manager', description: 'Manage hotels, rooms and offers', icon: 'apartment', color: 'teal', userCount: 3 },
  { id: 3, name: 'Booking Agent', description: 'Handle reservations and complaints', icon: 'support_agent', color: 'gold', userCount: 5 },
  { id: 4, name: 'Client', description: 'Standard customer access', icon: 'person', color: 'gray', userCount: 142 },
])

const selected = ref<Role | null>(null)
const showNewRole = ref(false)

const permissionGroups = [
  { name: 'Hotels', perms: ['View Hotels', 'Manage Hotels', 'Hotel Analytics'] },
  { name: 'Reservations', perms: ['View Reservations', 'Manage Reservations', 'Cancel Reservations'] },
  { name: 'Users', perms: ['View Users', 'Manage Users', 'Deactivate Users'] },
  { name: 'Reports', perms: ['View Reports', 'Export Reports', 'Financial Reports'] },
  { name: 'System', perms: ['System Settings', 'Audit Logs', 'API Integrations'] },
]

// In-memory permissions state: roleId -> perm -> action -> checked
const perms = reactive<Record<string, Record<string, Record<string, { checked: boolean }>>>>({})

function getPermission(roleId: number, perm: string, action: string) {
  if (!perms[roleId]) perms[roleId] = {}
  if (!perms[roleId][perm]) perms[roleId][perm] = {}
  if (!perms[roleId][perm][action]) perms[roleId][perm][action] = { checked: roleId === 1 }
  return perms[roleId][perm][action]
}

function savePermissions() {
  // In production: persist to API
  alert('Permissions saved!')
}
</script>

<style scoped>
.admin-page { padding: 2.5rem; }
.page-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 1.5rem; margin-bottom: 2rem; flex-wrap: wrap; }
.page-eyebrow { font-size: 0.6875rem; text-transform: uppercase; letter-spacing: 0.08em; color: #6d7979; font-weight: 600; margin: 0; }
.page-title { font-size: 1.625rem; font-weight: 700; color: #015081; margin: 0.25rem 0; letter-spacing: -0.02em; }
.page-desc { font-size: 0.875rem; color: #3d4949; margin: 0; }
.btn-primary { display: flex; align-items: center; gap: 0.375rem; padding: 0.625rem 1.25rem; background: linear-gradient(135deg,#006768,#008283); color: #fff; border: none; border-radius: 0.5rem; font-weight: 700; font-size: 0.875rem; cursor: pointer; }

.roles-grid { display: grid; grid-template-columns: 280px 1fr; gap: 1.5rem; align-items: start; }
@media (max-width: 800px) { .roles-grid { grid-template-columns: 1fr; } }

.subsection-title { font-size: 0.8125rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #6d7979; margin: 0 0 0.875rem; }
.roles-list { display: flex; flex-direction: column; gap: 0.5rem; }
.role-card {
  background: #fff; border: 1.5px solid #e1e9f0; border-radius: 0.75rem;
  padding: 1rem; display: flex; align-items: center; gap: 0.875rem;
  cursor: pointer; transition: all 0.15s;
}
.role-card:hover { border-color: #006768; background: #f5faff; }
.role-card--selected { border-color: #006768; background: #edf5fc; }
.role-icon { width: 2.25rem; height: 2.25rem; border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.role-icon .material-symbols-outlined { font-size: 1.125rem; font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
.role-icon--navy { background: #e3f2fd; color: #015081; }
.role-icon--teal { background: #e0f2f1; color: #006768; }
.role-icon--gold { background: #fff8e1; color: #735c10; }
.role-icon--gray { background: #e7eff6; color: #6d7979; }
.role-info { flex: 1; }
.role-name { font-size: 0.9375rem; font-weight: 700; color: #151d22; margin: 0; }
.role-users { font-size: 0.75rem; color: #6d7979; margin: 0.125rem 0 0; }
.role-arrow { font-size: 1.125rem; color: #bcc9c8; }

.permissions-panel { background: #fff; border-radius: 0.875rem; padding: 1.5rem; box-shadow: 0 1px 4px rgba(1,80,129,0.06); }
.perm-header { display: flex; align-items: center; gap: 0.875rem; margin-bottom: 1.5rem; padding-bottom: 1.25rem; border-bottom: 1px solid #e1e9f0; }
.perm-role-name { font-size: 1.125rem; font-weight: 700; color: #015081; margin: 0; }
.perm-desc { font-size: 0.8125rem; color: #6d7979; margin: 0.125rem 0 0; }

.perm-group { margin-bottom: 1.25rem; }
.perm-group-label { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #6d7979; margin: 0 0 0.625rem; }
.perm-table { border: 1px solid #e1e9f0; border-radius: 0.5rem; overflow: hidden; }
.perm-row { display: flex; align-items: center; justify-content: space-between; padding: 0.625rem 1rem; border-bottom: 1px solid #e1e9f0; }
.perm-row:last-child { border-bottom: none; }
.perm-row:hover { background: #f5faff; }
.perm-name { font-size: 0.875rem; color: #151d22; font-weight: 500; }
.perm-actions { display: flex; gap: 1.25rem; }
.perm-check { display: flex; align-items: center; gap: 0.375rem; font-size: 0.8125rem; color: #3d4949; cursor: pointer; user-select: none; }
.perm-check input { accent-color: #006768; cursor: pointer; }

.perm-footer { display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid #e1e9f0; }
.btn-ghost { padding: 0.5rem 1rem; border: 1.5px solid #bcc9c8; border-radius: 0.5rem; background: transparent; color: #3d4949; font-size: 0.875rem; font-weight: 600; cursor: pointer; }
.btn-ghost:hover { background: #f5faff; }
.btn-save-perm { padding: 0.5rem 1.25rem; background: linear-gradient(135deg,#006768,#008283); border: none; border-radius: 0.5rem; color: #fff; font-size: 0.875rem; font-weight: 700; cursor: pointer; }
.btn-save-perm:hover { opacity: 0.9; }

.perm-empty { text-align: center; padding: 4rem 2rem; color: #6d7979; }
.perm-empty .material-symbols-outlined { font-size: 3rem; display: block; margin-bottom: 1rem; color: #bcc9c8; }
.perm-empty p { font-size: 0.9375rem; margin: 0; }
</style>
