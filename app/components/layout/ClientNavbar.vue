<template>
  <header class="client-navbar">
    <div class="navbar-container">
      <NuxtLink to="/" class="navbar-brand">
        <span class="brand-icon">✈</span>
        <span class="brand-text">Voyage<span class="brand-accent">Hub</span></span>
      </NuxtLink>

      <nav class="navbar-links">
        <NuxtLink to="/" class="nav-link" active-class="nav-link--active">Home</NuxtLink>
        <NuxtLink to="/hotels" class="nav-link" active-class="nav-link--active">Hotels</NuxtLink>
        <NuxtLink to="/offers" class="nav-link" active-class="nav-link--active">Offers</NuxtLink>
      </nav>

      <div class="navbar-actions">
        <template v-if="isAuthenticated">
          <button class="nav-icon-btn" @click="$emit('toggle-notifications')" title="Notifications">
            <i class="pi pi-bell"></i>
            <span v-if="unreadCount > 0" class="notification-badge">{{ unreadCount }}</span>
          </button>
          <NuxtLink to="/reservations" class="nav-link" active-class="nav-link--active">My Bookings</NuxtLink>
          <div class="nav-user-menu">
            <button class="nav-avatar-btn" @click="showUserMenu = !showUserMenu">
              <img :src="currentProfile?.photo || 'https://i.pravatar.cc/40'" alt="Avatar" class="nav-avatar" />
              <span class="nav-username">{{ currentProfile?.firstName }}</span>
              <i class="pi pi-chevron-down" style="font-size: 0.7rem"></i>
            </button>
            <Transition name="dropdown">
              <div v-if="showUserMenu" class="user-dropdown">
                <NuxtLink to="/profile" class="dropdown-item" @click="showUserMenu = false">
                  <i class="pi pi-user"></i> Profile
                </NuxtLink>
                <NuxtLink v-if="isAdmin" to="/admin" class="dropdown-item" @click="showUserMenu = false">
                  <i class="pi pi-cog"></i> Admin Panel
                </NuxtLink>
                <button class="dropdown-item dropdown-item--danger" @click="handleLogout">
                  <i class="pi pi-sign-out"></i> Logout
                </button>
              </div>
            </Transition>
          </div>
        </template>
        <template v-else>
          <NuxtLink to="/login" class="nav-btn nav-btn--outline">Sign In</NuxtLink>
          <NuxtLink to="/register" class="nav-btn nav-btn--primary">Register</NuxtLink>
        </template>
      </div>

      <button class="navbar-hamburger" @click="mobileOpen = !mobileOpen">
        <i :class="mobileOpen ? 'pi pi-times' : 'pi pi-bars'"></i>
      </button>
    </div>

    <!-- Mobile menu -->
    <Transition name="slide-down">
      <div v-if="mobileOpen" class="mobile-menu">
        <NuxtLink to="/" class="mobile-link" @click="mobileOpen = false">Home</NuxtLink>
        <NuxtLink to="/hotels" class="mobile-link" @click="mobileOpen = false">Hotels</NuxtLink>
        <NuxtLink to="/offers" class="mobile-link" @click="mobileOpen = false">Offers</NuxtLink>
        <template v-if="isAuthenticated">
          <NuxtLink to="/reservations" class="mobile-link" @click="mobileOpen = false">My Bookings</NuxtLink>
          <NuxtLink to="/profile" class="mobile-link" @click="mobileOpen = false">Profile</NuxtLink>
          <button class="mobile-link mobile-link--danger" @click="handleLogout">Logout</button>
        </template>
        <template v-else>
          <NuxtLink to="/login" class="mobile-link" @click="mobileOpen = false">Sign In</NuxtLink>
          <NuxtLink to="/register" class="mobile-link" @click="mobileOpen = false">Register</NuxtLink>
        </template>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useNotifications } from '~/composables/useNotifications'

const { isAuthenticated, isAdmin, currentProfile, logout } = useAuth()
const { unreadCount } = useNotifications()

const showUserMenu = ref(false)
const mobileOpen = ref(false)

function handleLogout() {
  logout()
  showUserMenu.value = false
  mobileOpen.value = false
  navigateTo('/')
}

defineEmits(['toggle-notifications'])
</script>

<style scoped>
.client-navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--color-border);
  transition: box-shadow var(--motion-duration-normal) var(--motion-ease-default);
}
.client-navbar:hover { box-shadow: var(--shadow-sm); }

.navbar-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: var(--spacing-3) var(--spacing-6);
  display: flex;
  align-items: center;
  gap: var(--spacing-6);
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  text-decoration: none;
  font-family: var(--font-family-heading);
}
.brand-icon { font-size: 1.5rem; }
.brand-text {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--color-text-primary);
}
.brand-accent { color: var(--color-primary-500); }

.navbar-links {
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
  flex: 1;
}

.nav-link {
  padding: var(--spacing-2) var(--spacing-3);
  border-radius: var(--radius-md);
  text-decoration: none;
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text-secondary);
  transition: all var(--motion-duration-fast) var(--motion-ease-default);
}
.nav-link:hover { color: var(--color-primary-600); background: var(--color-primary-50); }
.nav-link--active { color: var(--color-primary-600); background: var(--color-primary-50); }

.navbar-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
}

.nav-icon-btn {
  position: relative;
  background: none;
  border: none;
  padding: var(--spacing-2);
  border-radius: var(--radius-full);
  cursor: pointer;
  color: var(--color-text-secondary);
  transition: all var(--motion-duration-fast) var(--motion-ease-default);
}
.nav-icon-btn:hover { background: var(--color-surface-secondary); color: var(--color-primary-600); }

.notification-badge {
  position: absolute;
  top: 0; right: 0;
  width: 18px; height: 18px;
  border-radius: var(--radius-full);
  background: var(--color-accent-500);
  color: white;
  font-size: 0.65rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-avatar-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  background: none;
  border: 1px solid var(--color-border);
  padding: var(--spacing-1) var(--spacing-3) var(--spacing-1) var(--spacing-1);
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all var(--motion-duration-fast) var(--motion-ease-default);
}
.nav-avatar-btn:hover { border-color: var(--color-primary-300); background: var(--color-surface-secondary); }
.nav-avatar { width: 32px; height: 32px; border-radius: var(--radius-full); object-fit: cover; }
.nav-username { font-size: var(--font-size-sm); font-weight: 500; color: var(--color-text-primary); }

.nav-user-menu { position: relative; }

.user-dropdown {
  position: absolute;
  top: calc(100% + var(--spacing-2));
  right: 0;
  min-width: 180px;
  background: var(--color-surface-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  padding: var(--spacing-2);
  z-index: 200;
}
.dropdown-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  width: 100%;
  padding: var(--spacing-2) var(--spacing-3);
  border-radius: var(--radius-md);
  text-decoration: none;
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  background: none;
  border: none;
  cursor: pointer;
  transition: background var(--motion-duration-fast) var(--motion-ease-default);
}
.dropdown-item:hover { background: var(--color-surface-secondary); }
.dropdown-item--danger { color: var(--color-error); }
.dropdown-item--danger:hover { background: rgba(220, 38, 38, 0.08); }

.nav-btn {
  padding: var(--spacing-2) var(--spacing-4);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: 600;
  text-decoration: none;
  transition: all var(--motion-duration-fast) var(--motion-ease-default);
  cursor: pointer;
}
.nav-btn--outline {
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
  background: transparent;
}
.nav-btn--outline:hover { border-color: var(--color-primary-300); background: var(--color-primary-50); }
.nav-btn--primary {
  background: var(--color-primary-500);
  color: white;
  border: none;
}
.nav-btn--primary:hover { background: var(--color-primary-600); transform: translateY(-1px); box-shadow: var(--shadow-sm); }

.navbar-hamburger {
  display: none;
  background: none;
  border: none;
  font-size: 1.4rem;
  cursor: pointer;
  color: var(--color-text-primary);
}

.mobile-menu {
  display: none;
  flex-direction: column;
  padding: var(--spacing-4) var(--spacing-6);
  border-top: 1px solid var(--color-border);
  background: var(--color-surface-primary);
}
.mobile-link {
  padding: var(--spacing-3);
  text-decoration: none;
  font-size: var(--font-size-base);
  color: var(--color-text-primary);
  border-radius: var(--radius-md);
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
}
.mobile-link:hover { background: var(--color-surface-secondary); }
.mobile-link--danger { color: var(--color-error); }

@media (max-width: 768px) {
  .navbar-links, .navbar-actions { display: none; }
  .navbar-hamburger { display: block; }
  .mobile-menu { display: flex; }
}

/* Transitions */
.dropdown-enter-active, .dropdown-leave-active { transition: all 0.2s ease; }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: translateY(-8px); }
.slide-down-enter-active, .slide-down-leave-active { transition: all 0.3s ease; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; max-height: 0; }
</style>
