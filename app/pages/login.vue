<template>
  <div>
    <Head>
      <title>Sign In — VoyageHub</title>
      <meta name="description" content="Sign in to your VoyageHub account to manage bookings and explore exclusive hotel offers." />
    </Head>

    <div class="auth-root">
      <!-- Background gradient blobs -->
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>

      <div class="auth-container">
        <!-- Brand -->
        <div class="auth-brand">
          <span class="material-symbols-outlined brand-icon">travel_explore</span>
          <h1 class="brand-name">VoyageHub</h1>
        </div>

        <!-- Card -->
        <div class="auth-card">
          <div class="auth-header">
            <h2 class="auth-title">Welcome back</h2>
            <p class="auth-subtitle">Sign in to your account to continue</p>
          </div>

          <!-- Demo shortcuts -->
          <div class="demo-bar">
            <span class="demo-label">Quick demo:</span>
            <button id="demo-client-btn" class="demo-btn" type="button" @click="handleDemoClient">
              <span class="material-symbols-outlined">person</span> Client
            </button>
            <button id="demo-admin-btn" class="demo-btn demo-btn--admin" type="button" @click="handleDemoAdmin">
              <span class="material-symbols-outlined">admin_panel_settings</span> Admin
            </button>
          </div>

          <form id="login-form" class="auth-form" @submit.prevent="handleLogin">
            <!-- Error alert -->
            <div v-if="error" class="auth-alert">
              <span class="material-symbols-outlined">error</span>
              {{ error }}
            </div>

            <div class="field-group">
              <label class="field-label" for="login-email">Email address</label>
              <div class="field-wrapper">
                <span class="material-symbols-outlined field-icon">mail</span>
                <input
                  id="login-email"
                  v-model="email"
                  class="field-input"
                  type="email"
                  placeholder="you@example.com"
                  autocomplete="email"
                  required
                />
              </div>
            </div>

            <div class="field-group">
              <div class="field-label-row">
                <label class="field-label" for="login-password">Password</label>
                <a class="forgot-link" href="#">Forgot password?</a>
              </div>
              <div class="field-wrapper">
                <span class="material-symbols-outlined field-icon">lock</span>
                <input
                  id="login-password"
                  v-model="password"
                  class="field-input"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="••••••••"
                  autocomplete="current-password"
                  required
                />
                <button class="field-toggle" type="button" @click="showPassword = !showPassword">
                  <span class="material-symbols-outlined">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
                </button>
              </div>
            </div>

            <button id="login-submit-btn" class="auth-submit" type="submit" :disabled="loading">
              <span v-if="loading" class="material-symbols-outlined spin">progress_activity</span>
              <span v-else>Sign In</span>
            </button>
          </form>

          <p class="auth-footer-text">
            Don't have an account?
            <NuxtLink class="auth-link" to="/register">Create one free</NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '~/composables/useAuth'

definePageMeta({ layout: false })

const router = useRouter()
const { login, demoLoginClient, demoLoginAdmin, loading, error } = useAuth()

const email = ref('')
const password = ref('')
const showPassword = ref(false)

async function handleLogin() {
  const ok = await login(email.value, password.value)
  if (ok) {
    const { currentAccount } = useAuth()
    router.push(currentAccount.value?.role === 'admin' ? '/admin' : '/')
  }
}

async function handleDemoClient() {
  const ok = await demoLoginClient()
  if (ok) router.push('/')
}

async function handleDemoAdmin() {
  const ok = await demoLoginAdmin()
  if (ok) router.push('/admin')
}
</script>

<style scoped>
.auth-root {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5faff 0%, #edf5fc 50%, #e1e9f0 100%);
  position: relative;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
  padding: 2rem;
}

.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.35;
  pointer-events: none;
}
.blob-1 { width: 500px; height: 500px; background: #006768; top: -120px; left: -120px; }
.blob-2 { width: 400px; height: 400px; background: #236294; bottom: -100px; right: -100px; }

.auth-container {
  width: 100%;
  max-width: 420px;
  position: relative;
  z-index: 1;
}

.auth-brand {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1.75rem;
}
.brand-icon {
  font-size: 2rem;
  color: #006768;
  font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
.brand-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: #015081;
  letter-spacing: -0.02em;
}

.auth-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(188, 201, 200, 0.4);
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(1, 80, 129, 0.08), 0 12px 40px rgba(1, 80, 129, 0.04);
}

.auth-header { margin-bottom: 1.5rem; }
.auth-title { font-size: 1.375rem; font-weight: 700; color: #151d22; margin: 0 0 0.25rem; }
.auth-subtitle { font-size: 0.875rem; color: #6d7979; margin: 0; }

.demo-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #edf5fc;
  border: 1px solid #bcc9c8;
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}
.demo-label { font-size: 0.75rem; color: #6d7979; font-weight: 500; margin-right: 0.25rem; }
.demo-btn {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.625rem;
  border-radius: 0.375rem;
  border: 1px solid #bcc9c8;
  background: #fff;
  color: #006768;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}
.demo-btn:hover { background: #006768; color: #fff; border-color: #006768; }
.demo-btn .material-symbols-outlined { font-size: 0.875rem; }
.demo-btn--admin { color: #015081; }
.demo-btn--admin:hover { background: #015081; color: #fff; border-color: #015081; }

.auth-form { display: flex; flex-direction: column; gap: 1.25rem; }

.auth-alert {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #ffdad6;
  border-left: 3px solid #ba1a1a;
  color: #93000a;
  padding: 0.625rem 0.875rem;
  border-radius: 0.375rem;
  font-size: 0.8125rem;
  font-weight: 500;
}
.auth-alert .material-symbols-outlined { font-size: 1rem; }

.field-group { display: flex; flex-direction: column; gap: 0.375rem; }
.field-label-row { display: flex; justify-content: space-between; align-items: center; }
.field-label { font-size: 0.8125rem; font-weight: 600; color: #151d22; }
.forgot-link { font-size: 0.75rem; color: #006768; text-decoration: none; font-weight: 500; }
.forgot-link:hover { text-decoration: underline; }

.field-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}
.field-icon {
  position: absolute;
  left: 0.75rem;
  color: #6d7979;
  font-size: 1.125rem;
  pointer-events: none;
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
.field-input {
  width: 100%;
  padding: 0.625rem 2.5rem 0.625rem 2.5rem;
  border: 1px solid #bcc9c8;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #151d22;
  background: #fff;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
  font-family: 'Inter', sans-serif;
}
.field-input:focus { border-color: #008F90; box-shadow: 0 0 0 2px rgba(0, 143, 144, 0.15); }
.field-toggle {
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #6d7979;
  padding: 0;
  display: flex;
  align-items: center;
}
.field-toggle .material-symbols-outlined { font-size: 1.125rem; }
.field-toggle:hover { color: #006768; }

.auth-submit {
  width: 100%;
  padding: 0.75rem;
  background: linear-gradient(135deg, #006768 0%, #008283 100%);
  color: #fff;
  font-weight: 700;
  font-size: 0.9375rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: opacity 0.15s, transform 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-family: 'Inter', sans-serif;
  margin-top: 0.25rem;
}
.auth-submit:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
.auth-submit:disabled { opacity: 0.6; cursor: not-allowed; }

@keyframes spin { to { transform: rotate(360deg); } }
.spin { animation: spin 0.8s linear infinite; }

.auth-footer-text {
  margin-top: 1.25rem;
  text-align: center;
  font-size: 0.8125rem;
  color: #6d7979;
}
.auth-link { color: #006768; font-weight: 600; text-decoration: none; }
.auth-link:hover { text-decoration: underline; }
</style>
