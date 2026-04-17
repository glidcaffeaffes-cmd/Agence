<template>
  <div>
    <Head>
      <title>User Management — VoyageHub Admin</title>
      <meta name="description" content="Manage user accounts, roles and access in VoyageHub." />
    </Head>

    <div class="admin-page">
      <!-- Page header -->
      <div class="page-header">
        <div>
          <p class="page-eyebrow">Administration</p>
          <h1 class="page-title">User Management</h1>
          <p class="page-desc">Manage client accounts, activation status and roles</p>
        </div>
        <div class="header-actions">
          <div class="search-box">
            <span class="material-symbols-outlined">search</span>
            <input v-model="search" id="user-search" type="text" placeholder="Search users…" />
          </div>
          <select v-model="roleFilter" id="user-role-filter" class="filter-select">
            <option value="">All roles</option>
            <option value="client">Client</option>
            <option value="admin">Admin</option>
          </select>
          <select v-model="statusFilter" id="user-status-filter" class="filter-select">
            <option value="">All statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <!-- KPI row -->
      <div class="kpi-row">
        <div class="kpi-card">
          <span class="material-symbols-outlined kpi-icon" style="color:#006768">group</span>
          <div>
            <p class="kpi-label">Total Users</p>
            <p class="kpi-value">{{ accounts.length }}</p>
          </div>
        </div>
        <div class="kpi-card">
          <span class="material-symbols-outlined kpi-icon" style="color:#236294">how_to_reg</span>
          <div>
            <p class="kpi-label">Active</p>
            <p class="kpi-value">{{ accounts.filter(a => a.active).length }}</p>
          </div>
        </div>
        <div class="kpi-card">
          <span class="material-symbols-outlined kpi-icon" style="color:#ba1a1a">person_off</span>
          <div>
            <p class="kpi-label">Inactive</p>
            <p class="kpi-value">{{ accounts.filter(a => !a.active).length }}</p>
          </div>
        </div>
        <div class="kpi-card">
          <span class="material-symbols-outlined kpi-icon" style="color:#CDAF5D">admin_panel_settings</span>
          <div>
            <p class="kpi-label">Admins</p>
            <p class="kpi-value">{{ accounts.filter(a => a.role === 'admin').length }}</p>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="table-card">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Role</th>
              <th>Registration Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading"><td colspan="6" class="table-loading">
              <span class="material-symbols-outlined spin">progress_activity</span> Loading…
            </td></tr>
            <tr v-else-if="filtered.length === 0"><td colspan="6" class="table-empty">No users match your criteria</td></tr>
            <tr v-for="acc in filtered" :key="acc.id" :id="`user-row-${acc.id}`">
              <td class="td-id">#{{ acc.id }}</td>
              <td class="td-email">
                <div class="user-cell">
                  <div class="user-avatar">{{ acc.email.charAt(0).toUpperCase() }}</div>
                  <span>{{ acc.email }}</span>
                </div>
              </td>
              <td>
                <span class="role-badge" :class="`role-badge--${acc.role}`">{{ acc.role }}</span>
              </td>
              <td class="td-date">{{ formatDate(acc.registrationDate) }}</td>
              <td>
                <span class="status-dot" :class="acc.active ? 'dot--active' : 'dot--inactive'"></span>
                {{ acc.active ? 'Active' : 'Inactive' }}
              </td>
              <td>
                <div class="row-actions">
                  <button class="row-btn" title="Edit" @click="openEdit(acc)">
                    <span class="material-symbols-outlined">edit</span>
                  </button>
                  <button
                    class="row-btn"
                    :class="acc.active ? 'row-btn--danger' : 'row-btn--success'"
                    :title="acc.active ? 'Deactivate' : 'Activate'"
                    @click="toggleActive(acc)"
                  >
                    <span class="material-symbols-outlined">{{ acc.active ? 'person_off' : 'how_to_reg' }}</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Edit Modal -->
      <div v-if="editing" class="modal-backdrop" @click.self="editing = null">
        <div class="modal" id="user-edit-modal">
          <div class="modal-header">
            <h3>Edit User #{{ editing.id }}</h3>
            <button class="modal-close" @click="editing = null">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="field-group">
              <label class="field-label">Email</label>
              <input v-model="editing.email" class="field-input" type="email" />
            </div>
            <div class="field-group">
              <label class="field-label">Role</label>
              <select v-model="editing.role" class="field-input">
                <option value="client">Client</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-ghost" @click="editing = null">Cancel</button>
            <button class="btn-primary" @click="saveEdit">Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Account } from '~/types/models'
import { MockAccountRepository } from '~/repositories/mock'

definePageMeta({ layout: 'admin' })

const repo = new MockAccountRepository()
const accounts = ref<Account[]>([])
const loading = ref(false)
const search = ref('')
const roleFilter = ref('')
const statusFilter = ref('')
const editing = ref<Account | null>(null)

const filtered = computed(() =>
  accounts.value.filter(a => {
    const q = search.value.toLowerCase()
    const matchSearch = !q || a.email.toLowerCase().includes(q) || String(a.id).includes(q)
    const matchRole = !roleFilter.value || a.role === roleFilter.value
    const matchStatus = !statusFilter.value || (statusFilter.value === 'active' ? a.active : !a.active)
    return matchSearch && matchRole && matchStatus
  })
)

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

function openEdit(acc: Account) { editing.value = { ...acc } }

async function toggleActive(acc: Account) {
  if (acc.active) await repo.deactivate(acc.id)
  else await repo.update(acc.id, { active: true })
  const i = accounts.value.findIndex(a => a.id === acc.id)
  if (i !== -1) accounts.value[i] = { ...accounts.value[i], active: !acc.active }
}

async function saveEdit() {
  if (!editing.value) return
  const updated = await repo.update(editing.value.id, editing.value)
  const i = accounts.value.findIndex(a => a.id === updated.id)
  if (i !== -1) accounts.value[i] = updated
  editing.value = null
}

onMounted(async () => { loading.value = true; accounts.value = await repo.getAll(); loading.value = false })
</script>

<style scoped>
.admin-page { padding: 2.5rem; font-family: 'Inter', sans-serif; }

.page-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 1.5rem; margin-bottom: 2rem; flex-wrap: wrap; }
.page-eyebrow { font-size: 0.6875rem; text-transform: uppercase; letter-spacing: 0.08em; color: #6d7979; font-weight: 600; margin: 0; }
.page-title { font-size: 1.625rem; font-weight: 700; color: #015081; margin: 0.25rem 0; letter-spacing: -0.02em; }
.page-desc { font-size: 0.875rem; color: #3d4949; margin: 0; }

.header-actions { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; }
.search-box {
  display: flex; align-items: center; gap: 0.5rem;
  background: #fff; border: 1px solid #bcc9c8; border-radius: 0.5rem;
  padding: 0.5rem 0.875rem; min-width: 200px;
}
.search-box .material-symbols-outlined { font-size: 1.125rem; color: #6d7979; }
.search-box input { border: none; outline: none; background: transparent; font-size: 0.875rem; color: #151d22; font-family: 'Inter', sans-serif; width: 100%; }
.filter-select {
  padding: 0.5rem 0.875rem; border: 1px solid #bcc9c8; border-radius: 0.5rem;
  font-size: 0.875rem; color: #151d22; background: #fff; outline: none; cursor: pointer; font-family: 'Inter', sans-serif;
}

.kpi-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 2rem; }
@media (max-width: 900px) { .kpi-row { grid-template-columns: repeat(2, 1fr); } }
.kpi-card {
  background: #fff; border-radius: 0.75rem; padding: 1.25rem;
  display: flex; align-items: center; gap: 1rem;
  box-shadow: 0 1px 4px rgba(1,80,129,0.06);
}
.kpi-icon { font-size: 2rem; font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
.kpi-label { font-size: 0.6875rem; text-transform: uppercase; letter-spacing: 0.06em; color: #6d7979; font-weight: 600; margin: 0; }
.kpi-value { font-size: 1.5rem; font-weight: 700; color: #015081; margin: 0.125rem 0 0; }

.table-card { background: #fff; border-radius: 0.875rem; box-shadow: 0 1px 4px rgba(1,80,129,0.06); overflow: hidden; }
.data-table { width: 100%; border-collapse: collapse; }
.data-table th {
  text-align: left; padding: 0.875rem 1.25rem;
  font-size: 0.6875rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em;
  color: #6d7979; background: #f5faff; border-bottom: 1px solid #e1e9f0;
}
.data-table td { padding: 0.875rem 1.25rem; border-bottom: 1px solid #e1e9f0; font-size: 0.875rem; color: #151d22; }
.data-table tr:last-child td { border-bottom: none; }
.data-table tr:hover td { background: #f5faff; }
.table-loading, .table-empty { text-align: center; padding: 2rem; color: #6d7979; }
.table-loading { display: flex; align-items: center; justify-content: center; gap: 0.5rem; }

.td-id { color: #6d7979; font-weight: 700; font-size: 0.75rem; font-family: monospace; }
.user-cell { display: flex; align-items: center; gap: 0.75rem; }
.user-avatar {
  width: 2rem; height: 2rem; border-radius: 50%;
  background: linear-gradient(135deg, #006768, #008283); color: #fff;
  font-size: 0.75rem; font-weight: 700; display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.td-date { color: #6d7979; font-size: 0.8125rem; }

.role-badge {
  display: inline-block; padding: 0.2rem 0.625rem; border-radius: 999px;
  font-size: 0.6875rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em;
}
.role-badge--admin { background: #e3f2fd; color: #015081; }
.role-badge--client { background: #e0f2f1; color: #006768; }

.status-dot { display: inline-block; width: 6px; height: 6px; border-radius: 50%; margin-right: 0.375rem; vertical-align: middle; }
.dot--active { background: #006768; }
.dot--inactive { background: #ba1a1a; }

.row-actions { display: flex; gap: 0.375rem; }
.row-btn {
  width: 2rem; height: 2rem; border-radius: 0.375rem; border: 1px solid #e1e9f0;
  background: transparent; display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: #3d4949; transition: all 0.15s;
}
.row-btn .material-symbols-outlined { font-size: 1rem; }
.row-btn:hover { background: #edf5fc; border-color: #006768; color: #006768; }
.row-btn--danger:hover { background: #ffdad6; border-color: #ba1a1a; color: #ba1a1a; }
.row-btn--success:hover { background: #e0f2f1; border-color: #006768; color: #006768; }

@keyframes spin { to { transform: rotate(360deg); } }
.spin { animation: spin 0.8s linear infinite; }

.modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 100; display: flex; align-items: center; justify-content: center; }
.modal { background: #fff; border-radius: 0.875rem; width: 100%; max-width: 440px; box-shadow: 0 8px 40px rgba(0,0,0,0.15); }
.modal-header { display: flex; justify-content: space-between; align-items: center; padding: 1.25rem 1.5rem; border-bottom: 1px solid #e1e9f0; }
.modal-header h3 { font-size: 1rem; font-weight: 700; color: #015081; margin: 0; }
.modal-close { background: none; border: none; cursor: pointer; color: #6d7979; display: flex; }
.modal-body { padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
.modal-footer { display: flex; justify-content: flex-end; gap: 0.75rem; padding: 1rem 1.5rem; border-top: 1px solid #e1e9f0; }
.field-group { display: flex; flex-direction: column; gap: 0.375rem; }
.field-label { font-size: 0.8125rem; font-weight: 600; color: #151d22; }
.field-input { padding: 0.625rem 0.875rem; border: 1px solid #bcc9c8; border-radius: 0.5rem; font-size: 0.875rem; color: #151d22; outline: none; font-family: 'Inter', sans-serif; }
.field-input:focus { border-color: #008F90; box-shadow: 0 0 0 2px rgba(0,143,144,0.15); }
.btn-ghost { padding: 0.5rem 1rem; border: 1.5px solid #bcc9c8; border-radius: 0.5rem; background: transparent; color: #3d4949; font-size: 0.875rem; font-weight: 600; cursor: pointer; font-family: 'Inter', sans-serif; }
.btn-ghost:hover { background: #f5faff; }
.btn-primary { padding: 0.5rem 1.25rem; background: linear-gradient(135deg,#006768,#008283); border: none; border-radius: 0.5rem; color: #fff; font-size: 0.875rem; font-weight: 700; cursor: pointer; font-family: 'Inter', sans-serif; }
.btn-primary:hover { opacity: 0.9; }
</style>
