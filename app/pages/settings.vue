<template>
  <div>
    <Head>
      <title>My Settings — VoyageHub</title>
      <meta name="description" content="Manage your VoyageHub account settings." />
    </Head>

    <div class="settings-page">
      <div class="settings-container">
        
        <div class="sidebar">
          <h2 class="sidebar-title">Account Settings</h2>
          <nav class="settings-nav">
            <button class="nav-btn" :class="{'active': activeTab === 'profile'}" @click="activeTab = 'profile'">
              <span class="material-symbols-outlined">person</span> Personal Info
            </button>
            <button class="nav-btn" :class="{'active': activeTab === 'security'}" @click="activeTab = 'security'">
              <span class="material-symbols-outlined">lock</span> Security
            </button>
            <button class="nav-btn" :class="{'active': activeTab === 'notifications'}" @click="activeTab = 'notifications'">
              <span class="material-symbols-outlined">notifications</span> Notifications
            </button>
            <button class="nav-btn" :class="{'active': activeTab === 'payment'}" @click="activeTab = 'payment'">
              <span class="material-symbols-outlined">credit_card</span> Payment Methods
            </button>
          </nav>
        </div>

        <div class="content-panel">
          <!-- Profile Tab -->
          <div v-show="activeTab === 'profile'" class="tab-pane">
            <h1 class="pane-title">Personal Information</h1>
            <p class="pane-subtitle">Update your personal details and how we can reach you.</p>

            <div class="avatar-section">
              <div class="avatar">{{ currentAccount?.email.charAt(0).toUpperCase() || 'U' }}</div>
              <div>
                <button class="btn-outline-sm">Change picture</button>
                <p class="avatar-hint">JPG, GIF or PNG. Max size of 800K</p>
              </div>
            </div>

            <div class="form-grid">
              <div class="field-group">
                <label>First Name</label>
                <input type="text" class="field-input" placeholder="Jean" />
              </div>
              <div class="field-group">
                <label>Last Name</label>
                <input type="text" class="field-input" placeholder="Dupont" />
              </div>
              <div class="field-group">
                <label>Email Address</label>
                <input type="email" class="field-input" :value="currentAccount?.email" readonly />
                <span class="field-hint">Used for login. Contact support to change.</span>
              </div>
              <div class="field-group">
                <label>Phone Number</label>
                <input type="tel" class="field-input" placeholder="+33 6 00 00 00 00" />
              </div>
            </div>

            <div class="form-actions">
              <button class="btn-primary">Save Changes</button>
            </div>
          </div>

          <!-- Security Tab -->
          <div v-show="activeTab === 'security'" class="tab-pane">
            <h1 class="pane-title">Security & Password</h1>
            <p class="pane-subtitle">Manage your password and security preferences.</p>

            <div class="form-grid" style="max-width:400px">
              <div class="field-group">
                <label>Current Password</label>
                <input type="password" class="field-input" />
              </div>
              <div class="field-group">
                <label>New Password</label>
                <input type="password" class="field-input" />
              </div>
              <div class="field-group">
                <label>Confirm New Password</label>
                <input type="password" class="field-input" />
              </div>
            </div>

            <div class="form-actions">
              <button class="btn-primary">Update Password</button>
            </div>

            <hr class="separator" />
            
            <h3 class="section-heading">Two-Factor Authentication</h3>
            <p class="section-desc">Add an extra layer of security to your account.</p>
            <button class="btn-outline">Enable 2FA</button>
          </div>

          <!-- Notifications Tab -->
          <div v-show="activeTab === 'notifications'" class="tab-pane">
            <h1 class="pane-title">Notification Preferences</h1>
            <p class="pane-subtitle">Choose what we notify you about.</p>

            <div class="toggle-list">
              <label class="toggle-row">
                <div class="toggle-info">
                  <strong>Booking Updates</strong>
                  <span>Confirmations, changes, and cancellations.</span>
                </div>
                <input type="checkbox" checked class="toggle-chbox" />
              </label>
              <label class="toggle-row">
                <div class="toggle-info">
                  <strong>Special Offers</strong>
                  <span>Promotions, discounts, and personalized deals.</span>
                </div>
                <input type="checkbox" class="toggle-chbox" />
              </label>
              <label class="toggle-row">
                <div class="toggle-info">
                  <strong>News & Updates</strong>
                  <span>New features, policies, and company news.</span>
                </div>
                <input type="checkbox" checked class="toggle-chbox" />
              </label>
            </div>
          </div>

          <!-- Payment Tab -->
          <div v-show="activeTab === 'payment'" class="tab-pane">
            <h1 class="pane-title">Payment Methods</h1>
            <p class="pane-subtitle">Manage your saved credit cards.</p>
            
            <div class="empty-state">
              <span class="material-symbols-outlined">credit_card_off</span>
              <p>You have no saved payment methods.</p>
            </div>
            <button class="btn-outline" style="margin-top:1rem">Add Payment Method</button>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '~/composables/useAuth'

const { currentAccount } = useAuth()
const activeTab = ref('profile')
</script>

<style scoped>
.settings-page { max-width: 1100px; margin: 0 auto; padding: 3rem 2rem; font-family: 'Inter', sans-serif; }
.settings-container { display: flex; gap: 3rem; align-items: flex-start; }
@media (max-width: 768px) { .settings-container { flex-direction: column; gap: 2rem; } }

.sidebar { width: 250px; flex-shrink: 0; }
@media (max-width: 768px) { .sidebar { width: 100%; } }
.sidebar-title { font-size: 0.8125rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #6d7979; margin: 0 0 1rem; }
.settings-nav { display: flex; flex-direction: column; gap: 0.25rem; }
.nav-btn { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1rem; background: transparent; border: none; border-radius: 0.5rem; color: #3d4949; font-size: 0.9375rem; font-weight: 600; cursor: pointer; text-align: left; transition: all 0.15s; font-family: 'Inter', sans-serif; }
.nav-btn:hover { background: #f5faff; color: #015081; }
.nav-btn.active { background: #e0f2f1; color: #006768; }
.nav-btn .material-symbols-outlined { font-size: 1.25rem; font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
.nav-btn.active .material-symbols-outlined { font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24; }

.content-panel { flex: 1; background: #fff; border-radius: 0.875rem; padding: 2.5rem; box-shadow: 0 1px 4px rgba(1,80,129,0.06), 0 4px 16px rgba(1,80,129,0.04); }

.pane-title { font-size: 1.5rem; font-weight: 700; color: #015081; margin: 0 0 0.5rem; letter-spacing: -0.02em; }
.pane-subtitle { font-size: 0.9375rem; color: #6d7979; margin: 0 0 2.5rem; }

.avatar-section { display: flex; align-items: center; gap: 1.5rem; margin-bottom: 2.5rem; }
.avatar { width: 4rem; height: 4rem; border-radius: 50%; background: linear-gradient(135deg, #006768, #008283); color: #fff; font-size: 1.5rem; font-weight: 700; display: flex; align-items: center; justify-content: center; }
.avatar-hint { font-size: 0.75rem; color: #6d7979; margin: 0.375rem 0 0; }

.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 2rem; }
@media (max-width: 600px) { .form-grid { grid-template-columns: 1fr; } }
.field-group { display: flex; flex-direction: column; gap: 0.375rem; }
.field-group label { font-size: 0.8125rem; font-weight: 600; color: #151d22; }
.field-input { padding: 0.625rem 0.875rem; border: 1px solid #bcc9c8; border-radius: 0.5rem; font-size: 0.9375rem; color: #151d22; outline: none; transition: border-color 0.15s; font-family: 'Inter', sans-serif; }
.field-input:focus { border-color: #008F90; box-shadow: 0 0 0 2px rgba(0,143,144,0.15); }
.field-input[readonly] { background: #f5faff; border-color: #e1e9f0; color: #6d7979; }
.field-hint { font-size: 0.75rem; color: #6d7979; }

.form-actions { display: flex; justify-content: flex-end; }
.btn-primary { padding: 0.625rem 1.5rem; background: linear-gradient(135deg,#006768,#008283); border: none; border-radius: 0.5rem; color: #fff; font-size: 0.9375rem; font-weight: 700; cursor: pointer; transition: opacity 0.15s; font-family: 'Inter', sans-serif; }
.btn-primary:hover { opacity: 0.9; }
.btn-outline-sm { padding: 0.375rem 0.75rem; border: 1.5px solid #bcc9c8; border-radius: 0.375rem; background: transparent; color: #3d4949; font-size: 0.8125rem; font-weight: 600; cursor: pointer; transition: background 0.15s; font-family: 'Inter', sans-serif; }
.btn-outline-sm:hover { background: #f5faff; }
.btn-outline { padding: 0.625rem 1.25rem; border: 1.5px solid #bcc9c8; border-radius: 0.5rem; background: transparent; color: #3d4949; font-size: 0.9375rem; font-weight: 600; cursor: pointer; transition: background 0.15s; font-family: 'Inter', sans-serif; }
.btn-outline:hover { background: #f5faff; }

.separator { border: none; border-top: 1px solid #e1e9f0; margin: 2.5rem 0; }
.section-heading { font-size: 1.125rem; font-weight: 700; color: #151d22; margin: 0 0 0.5rem; }
.section-desc { font-size: 0.875rem; color: #6d7979; margin: 0 0 1.5rem; }

.toggle-list { display: flex; flex-direction: column; gap: 1rem; }
.toggle-row { display: flex; justify-content: space-between; align-items: center; padding: 1rem; border: 1px solid #e1e9f0; border-radius: 0.75rem; cursor: pointer; transition: background 0.15s; }
.toggle-row:hover { background: #f5faff; }
.toggle-info strong { display: block; font-size: 0.9375rem; color: #151d22; margin-bottom: 0.125rem; }
.toggle-info span { font-size: 0.8125rem; color: #6d7979; }
.toggle-chbox { width: 1.25rem; height: 1.25rem; accent-color: #006768; }

.empty-state { text-align: center; padding: 3rem; background: #f5faff; border-radius: 0.75rem; border: 1px dashed #bcc9c8; color: #6d7979; }
.empty-state .material-symbols-outlined { font-size: 2.5rem; margin-bottom: 0.5rem; }
</style>
