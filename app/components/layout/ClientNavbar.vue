<template>
  <header
    ref="headerRef"
    :class="[
      'client-navbar z-50 transition-all duration-300',
      isHomePage ? 'client-navbar--overlay' : 'client-navbar--sticky',
      isTransparentHeader
        ? 'client-navbar--transparent'
        : 'client-navbar--solid',
    ]"
  >
    <div
      class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between"
    >
      <div class="flex items-center gap-8">
        <!-- Brand Logo -->
        <NuxtLink
          to="/"
          class="client-navbar__brand flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <div
            class="client-navbar__brand-mark w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-container flex items-center justify-center shadow-sm"
          >
            <span
              class="material-symbols-outlined text-white text-2xl"
              style="font-variation-settings: &quot;FILL&quot; 1"
              >bolt</span
            >
          </div>
          <span
            class="client-navbar__brand-text text-xl font-bold tracking-tight"
            >Voyage<span class="text-primary">Hub</span></span
          >
        </NuxtLink>

        <!-- Desktop Links -->
        <nav class="hidden md:flex items-center gap-1">
          <NuxtLink
            to="/hotels"
            class="client-navbar__link px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            active-class="client-navbar__link--active"
            >Hotels</NuxtLink
          >
          <NuxtLink
            to="/offers"
            class="client-navbar__link px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            active-class="client-navbar__link--active"
            >Offers</NuxtLink
          >
        </nav>
      </div>

      <!-- Desktop Actions -->
      <div class="hidden md:flex items-center gap-4">
        <template v-if="isAuthenticated">
          <button
            class="client-navbar__icon-btn relative p-2 rounded-full transition-all"
            @click="$emit('toggle-notifications')"
            title="Notifications"
          >
            <span class="material-symbols-outlined text-[24px]"
              >notifications</span
            >
            <span
              v-if="unreadCount > 0"
              class="absolute top-1 right-1 w-4 h-4 bg-error text-white text-[10px] font-bold flex items-center justify-center rounded-full"
              >{{ unreadCount }}</span
            >
          </button>

          <div class="relative">
            <button
              class="flex items-center gap-2 pl-1 pr-3 py-1 border border-outline-variant/50 rounded-full hover:border-primary/50 hover:bg-surface-container-lowest transition-all focus:outline-none"
              @click="showUserMenu = !showUserMenu"
            >
              <div
                v-if="currentProfile?.photo"
                class="w-8 h-8 rounded-full overflow-hidden"
              >
                <img
                  :src="currentProfile.photo"
                  alt="Avatar"
                  class="w-full h-full object-cover"
                />
              </div>
              <div
                v-else
                class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-[10px] brand-text"
              >
                {{ avatarLetter }}
              </div>
              <span class="text-sm font-bold text-on-surface">{{
                currentProfile?.firstName || ""
              }}</span>
              <span
                class="material-symbols-outlined text-[18px] text-on-surface-variant"
                >expand_more</span
              >
            </button>

            <!-- Dropdown -->
            <transition
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="opacity-0 translate-y-2"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition duration-150 ease-in"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 translate-y-2"
            >
              <div
                v-if="showUserMenu"
                class="absolute right-0 mt-3 w-48 bg-white border border-outline-variant/40 rounded-xl shadow-lg p-2 z-50"
              >
                <NuxtLink
                  to="/profile"
                  class="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-on-surface hover:bg-surface-container-low transition-colors"
                  @click="showUserMenu = false"
                >
                  <span
                    class="material-symbols-outlined text-[20px] text-outline"
                    >person</span
                  >
                  Profile
                </NuxtLink>
                <NuxtLink
                  v-if="isAdmin"
                  to="/admin"
                  class="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-on-surface hover:bg-surface-container-low transition-colors"
                  @click="showUserMenu = false"
                >
                  <span
                    class="material-symbols-outlined text-[20px] text-outline"
                    >admin_panel_settings</span
                  >
                  Admin Panel
                </NuxtLink>
                <button
                  class="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-error hover:bg-error-container/30 transition-colors"
                  @click="handleLogout"
                >
                  <span class="material-symbols-outlined text-[20px]"
                    >logout</span
                  >
                  Logout
                </button>
              </div>
            </transition>
          </div>
        </template>
        <template v-else>
          <NuxtLink
            to="/login"
            class="client-navbar__sign-in px-4 py-1.5 rounded-xl text-sm font-bold transition-all"
            >Sign In</NuxtLink
          >
          <NuxtLink
            to="/register"
            class="client-navbar__register px-4 py-1.5 rounded-xl text-sm font-bold text-white bg-primary hover:bg-primary-container shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
            >Register</NuxtLink
          >
        </template>
      </div>

      <!-- Mobile Menu Button -->
      <button
        class="client-navbar__mobile-toggle md:hidden p-2 transition-colors focus:outline-none"
        @click="mobileOpen = !mobileOpen"
      >
        <span class="material-symbols-outlined text-3xl">{{
          mobileOpen ? "close" : "menu"
        }}</span>
      </button>
    </div>

    <!-- Mobile Menu -->
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div
        v-if="mobileOpen"
        class="md:hidden border-t border-outline-variant/30 bg-white px-4 py-6 space-y-2"
      >
        <NuxtLink
          to="/"
          class="block px-4 py-3 rounded-xl text-base font-bold text-on-surface hover:bg-surface-container-lowest transition-colors"
          @click="mobileOpen = false"
          >Home</NuxtLink
        >
        <NuxtLink
          to="/hotels"
          class="block px-4 py-3 rounded-xl text-base font-bold text-on-surface hover:bg-surface-container-lowest transition-colors"
          @click="mobileOpen = false"
          >Hotels</NuxtLink
        >
        <NuxtLink
          to="/offers"
          class="block px-4 py-3 rounded-xl text-base font-bold text-on-surface hover:bg-surface-container-lowest transition-colors"
          @click="mobileOpen = false"
          >Offers</NuxtLink
        >

        <template v-if="isAuthenticated">
          <div class="h-px bg-outline-variant/30 my-4"></div>

          <NuxtLink
            to="/profile"
            class="block px-4 py-3 rounded-xl text-base font-bold text-on-surface hover:bg-surface-container-lowest transition-colors"
            @click="mobileOpen = false"
            >Profile</NuxtLink
          >
          <button
            class="block w-full text-left px-4 py-3 rounded-xl text-base font-bold text-error hover:bg-error-container/30 transition-colors"
            @click="handleLogout"
          >
            Logout
          </button>
        </template>
        <template v-else>
          <div class="h-px bg-outline-variant/30 my-4"></div>
          <NuxtLink
            to="/login"
            class="block text-center px-4 py-3 rounded-xl text-base font-bold text-primary border border-primary/20 hover:bg-primary/5 transition-colors mb-3"
            @click="mobileOpen = false"
            >Sign In</NuxtLink
          >
          <NuxtLink
            to="/register"
            class="block text-center px-4 py-3 rounded-xl text-base font-bold text-white bg-primary shadow-sm hover:bg-primary-container transition-colors"
            @click="mobileOpen = false"
            >Register</NuxtLink
          >
        </template>
      </div>
    </transition>
  </header>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useAuth } from "~/composables/useAuth";
import { useNotifications } from "~/composables/useNotifications";

const { isAuthenticated, isAdmin, currentProfile, logout } = useAuth();
const { unreadCount } = useNotifications();
const route = useRoute();

const showUserMenu = ref(false);
const mobileOpen = ref(false);
const headerRef = ref<HTMLElement | null>(null);
const hasSolidHeader = ref(true);

const isHomePage = computed(() => route.path === "/");
const isTransparentHeader = computed(
  () => isHomePage.value && !hasSolidHeader.value && !mobileOpen.value,
);

const avatarLetter = computed(() => {
  const first = currentProfile.value?.firstName?.trim().charAt(0).toUpperCase() || "";
  const last = currentProfile.value?.lastName?.trim().charAt(0).toUpperCase() || "";
  return (first + last) || "?";
});

function handleLogout() {
  logout();
  showUserMenu.value = false;
  mobileOpen.value = false;
  navigateTo("/");
}

function updateHeaderState() {
  if (!isHomePage.value || typeof window === "undefined") {
    hasSolidHeader.value = true;
    return;
  }

  hasSolidHeader.value = window.scrollY >= 100;
}

onMounted(() => {
  updateHeaderState();
  window.addEventListener("scroll", updateHeaderState, { passive: true });
  window.addEventListener("resize", updateHeaderState);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", updateHeaderState);
  window.removeEventListener("resize", updateHeaderState);
});

watch(
  () => route.path,
  () => {
    showUserMenu.value = false;
    mobileOpen.value = false;
    if (typeof window !== "undefined") {
      window.requestAnimationFrame(() => updateHeaderState());
    }
  },
);

defineEmits(["toggle-notifications"]);
</script>

<style scoped>
.client-navbar--overlay {
  position: fixed;
  inset: 0 0 auto;
}

.client-navbar--sticky {
  position: sticky;
  top: 0;
}

.client-navbar--transparent {
  background: transparent;
  border-bottom: 1px solid transparent;
  backdrop-filter: none;
  box-shadow: none;
}

.client-navbar--solid {
  background: rgba(255, 255, 255, 0.9);
  border-bottom: 1px solid rgb(209 219 229 / 0.3);
  backdrop-filter: blur(14px);
  box-shadow: 0 1px 0 rgba(15, 23, 42, 0.04);
}

.client-navbar__brand {
  color: var(--color-primary-600);
}

.client-navbar__brand-text,
.client-navbar__link,
.client-navbar__icon-btn,
.client-navbar__profile-name,
.client-navbar__profile-chevron,
.client-navbar__mobile-toggle {
  transition:
    color 0.25s ease,
    background 0.25s ease,
    border-color 0.25s ease;
}

.client-navbar--solid .client-navbar__brand-text,
.client-navbar--solid .client-navbar__profile-name {
  color: var(--color-text-primary);
}

.client-navbar--transparent .client-navbar__brand-text,
.client-navbar--transparent .client-navbar__profile-name,
.client-navbar--transparent .client-navbar__icon-btn,
.client-navbar--transparent .client-navbar__profile-chevron,
.client-navbar--transparent .client-navbar__mobile-toggle {
  color: white;
}

.client-navbar__link {
  color: var(--color-text-secondary);
}

.client-navbar__link:hover {
  color: var(--color-primary-600);
  background: color-mix(in srgb, var(--color-primary-500) 8%, transparent);
}

.client-navbar__link--active {
  color: var(--color-primary-600);
  background: color-mix(in srgb, var(--color-primary-500) 8%, transparent);
}

.client-navbar--transparent .client-navbar__link {
  color: rgba(255, 255, 255, 0.84);
}

.client-navbar--transparent .client-navbar__link:hover,
.client-navbar--transparent .client-navbar__link--active {
  color: white;
  background: rgba(255, 255, 255, 0.1);
}

.client-navbar__icon-btn {
  color: var(--color-text-secondary);
}

.client-navbar__icon-btn:hover {
  color: var(--color-primary-600);
  background: var(--color-surface-secondary);
}

.client-navbar--transparent .client-navbar__icon-btn:hover {
  color: white;
  background: rgba(255, 255, 255, 0.1);
}

.client-navbar__profile-btn {
  border: 1px solid rgb(209 219 229 / 0.5);
  background: transparent;
}

.client-navbar__profile-btn:hover {
  border-color: color-mix(in srgb, var(--color-primary-500) 50%, white 50%);
  background: var(--color-surface-secondary);
}

.client-navbar--transparent .client-navbar__profile-btn {
  border-color: rgba(255, 255, 255, 0.22);
  background: rgba(255, 255, 255, 0.05);
}

.client-navbar--transparent .client-navbar__profile-btn:hover {
  border-color: rgba(255, 255, 255, 0.32);
  background: rgba(255, 255, 255, 0.1);
}

.client-navbar__sign-in {
  color: var(--color-text-primary);
  border: 1px solid rgb(209 219 229 / 0.6);
}

.client-navbar__sign-in:hover {
  border-color: var(--color-primary-500);
  color: var(--color-primary-600);
}

.client-navbar--transparent .client-navbar__sign-in {
  color: white;
  border-color: rgba(255, 255, 255, 0.28);
  background: rgba(255, 255, 255, 0.05);
}

.client-navbar--transparent .client-navbar__sign-in:hover {
  border-color: rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.1);
}

.client-navbar--transparent .client-navbar__register {
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.16);
}

@media (max-width: 768px) {
  .client-navbar--transparent {
    background: rgba(10, 27, 44, 0.16);
    backdrop-filter: blur(10px);
  }
}
</style>
