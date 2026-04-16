<template>
  <div class="profile-page">
    <header class="page-header">
      <div class="header-content">
        <h1 class="page-title">My Profile</h1>
      </div>
    </header>

    <div class="page-container">
      <div class="profile-grid">
        <!-- Sidebar Info -->
        <aside class="profile-sidebar">
          <AppCard variant="elevated" class="profile-card">
            <div class="avatar-section">
              <img :src="currentProfile?.photo || 'https://i.pravatar.cc/150'" alt="Avatar" class="profile-avatar">
              <h2 class="profile-name">{{ currentProfile?.firstName }} {{ currentProfile?.lastName }}</h2>
              <p class="profile-email">{{ currentProfile?.email }}</p>
              <AppBadge :color="currentProfile?.role === 'Admin' ? 'warning' : 'primary'" class="role-badge">
                {{ currentProfile?.role }}
              </AppBadge>
            </div>
            
            <nav class="profile-nav">
              <a href="#" class="profile-nav-item active"><i class="pi pi-user"></i> Personal Info</a>
              <a href="#" class="profile-nav-item"><i class="pi pi-lock"></i> Security</a>
              <a href="#" class="profile-nav-item"><i class="pi pi-bell"></i> Preferences</a>
            </nav>
          </AppCard>
        </aside>

        <!-- Main Form -->
        <main class="profile-main">
          <AppCard variant="default">
            <template #header>
              <h3 class="form-title">Personal Information</h3>
            </template>
            <form class="profile-form" @submit.prevent="saveProfile">
              <div class="form-row">
                <div class="form-group">
                  <label>First Name</label>
                  <input type="text" class="form-input" :value="currentProfile?.firstName" />
                </div>
                <div class="form-group">
                  <label>Last Name</label>
                  <input type="text" class="form-input" :value="currentProfile?.lastName" />
                </div>
              </div>
              <div class="form-group">
                <label>Email Address</label>
                <input type="email" class="form-input" :value="currentProfile?.email" disabled />
                <span class="help-text">Email cannot be changed directly. Please contact support.</span>
              </div>
              <div class="form-group">
                <label>Phone Number</label>
                <input type="tel" class="form-input" :value="currentProfile?.phone" />
              </div>
              <div class="form-actions">
                <button type="submit" class="app-btn app-btn--primary">Save Changes</button>
              </div>
            </form>
          </AppCard>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'

const { currentProfile } = useAuth()

function saveProfile() {
  alert('Profile updated successfully! (Mock Action)')
}
</script>

<style scoped>
.profile-page { background: var(--color-bg-soft); min-height: 100vh; padding-bottom: var(--spacing-16); }

.page-header { background: var(--color-surface-primary); border-bottom: 1px solid var(--color-border); padding: var(--spacing-8) var(--spacing-6); margin-bottom: var(--spacing-8); }
.header-content { max-width: 1024px; margin: 0 auto; }
.page-title { font-family: var(--font-family-heading); font-size: var(--font-size-2xl); font-weight: 700; margin: 0; color: var(--color-text-primary); }

.page-container { max-width: 1024px; margin: 0 auto; padding: 0 var(--spacing-6); }

.profile-grid { display: grid; gap: var(--spacing-8); }
@media (min-width: 768px) { .profile-grid { grid-template-columns: 300px 1fr; align-items: start; } }

.profile-card { padding: var(--spacing-6); text-align: center; }
.avatar-section { border-bottom: 1px solid var(--color-border); padding-bottom: var(--spacing-6); margin-bottom: var(--spacing-4); }
.profile-avatar { width: 100px; height: 100px; border-radius: var(--radius-full); object-fit: cover; margin-bottom: var(--spacing-3); border: 4px solid var(--color-surface-secondary); }
.profile-name { font-size: var(--font-size-lg); font-weight: 600; margin: 0 0 var(--spacing-1); color: var(--color-text-primary); }
.profile-email { font-size: var(--font-size-sm); color: var(--color-text-secondary); margin: 0 0 var(--spacing-3); }
.role-badge { margin: 0 auto; }

.profile-nav { display: flex; flex-direction: column; gap: var(--spacing-1); text-align: left; }
.profile-nav-item { display: flex; align-items: center; gap: var(--spacing-3); padding: var(--spacing-3); color: var(--color-text-secondary); text-decoration: none; border-radius: var(--radius-md); font-weight: 500; font-size: var(--font-size-sm); transition: all 0.2s; }
.profile-nav-item:hover { background: var(--color-surface-secondary); color: var(--color-text-primary); }
.profile-nav-item.active { background: var(--color-primary-50); color: var(--color-primary-600); }
.profile-nav-item i { font-size: 1.1em; opacity: 0.7; }
.profile-nav-item.active i { opacity: 1; }

.form-title { font-size: var(--font-size-lg); font-weight: 600; margin: 0; color: var(--color-text-primary); border-bottom: 1px solid var(--color-border); padding-bottom: var(--spacing-4); margin-bottom: var(--spacing-6); }

.profile-form { display: flex; flex-direction: column; gap: var(--spacing-5); }
.form-row { display: grid; gap: var(--spacing-5); }
@media (min-width: 640px) { .form-row { grid-template-columns: 1fr 1fr; } }
.form-group label { display: block; font-size: var(--font-size-sm); font-weight: 600; color: var(--color-text-primary); margin-bottom: var(--spacing-2); }
.form-input { width: 100%; padding: var(--spacing-3); border: 1px solid var(--color-border); border-radius: var(--radius-md); font-size: var(--font-size-base); transition: border-color 0.2s; background: var(--color-surface-primary); }
.form-input:focus { outline: none; border-color: var(--color-primary-500); }
.form-input:disabled { background: var(--color-surface-secondary); color: var(--color-text-muted); cursor: not-allowed; }
.help-text { display: block; font-size: var(--font-size-xs); color: var(--color-text-muted); margin-top: var(--spacing-1); }

.form-actions { margin-top: var(--spacing-2); display: flex; justify-content: flex-end; }
.app-btn { padding: var(--spacing-2) var(--spacing-6); border-radius: var(--radius-md); font-weight: 500; cursor: pointer; border: none; font-size: var(--font-size-base); }
.app-btn--primary { background: var(--color-primary-600); color: white; }
.app-btn--primary:hover { background: var(--color-primary-700); }
</style>
