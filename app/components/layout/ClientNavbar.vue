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
            class="client-navbar__brand-mark w-10 h-10 rounded-xl flex items-center justify-center"
          >
            <img
              :src="brandLogoUrl"
              alt=""
              class="client-navbar__brand-logo h-8 w-8 object-contain"
              aria-hidden="true"
            />
          </div>
          <span
            class="client-navbar__brand-text text-xl font-bold tracking-tight"
            >Voyage<span class="client-navbar__brand-accent">Hub</span></span
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
          <NuxtLink
            to="/wishlist"
            class="client-navbar__link px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            active-class="client-navbar__link--active"
            @click="handleWishlistNav"
            >Wishlist</NuxtLink
          >
        </nav>
      </div>

      <!-- Desktop Actions -->
      <div class="hidden md:flex items-center gap-4">
        <template v-if="isAuthenticated">
          <div ref="notificationsRef" class="relative">
            <button
              class="client-navbar__icon-btn relative p-2 rounded-full transition-all"
              @click="toggleNotificationsMenu"
              title="Notifications"
            >
              <span class="material-symbols-outlined text-[24px]"
                >notifications</span
              >
              <span
                v-if="unreadCount > 0"
                class="absolute top-1 right-1 min-w-4 h-4 px-1 bg-error text-white text-[10px] font-bold flex items-center justify-center rounded-full"
                >{{ unreadCount > 99 ? "99+" : unreadCount }}</span
              >
            </button>

            <transition
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="opacity-0 translate-y-2"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition duration-150 ease-in"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 translate-y-2"
            >
              <div
                v-if="showNotificationsMenu"
                class="notifications-dropdown absolute top-full right-0 mt-2 w-[360px] bg-white border border-outline-variant/40 rounded-xl shadow-lg z-50 overflow-hidden"
              >
                <div class="notifications-head">
                  <h4>Notifications</h4>
                  <button
                    v-if="unreadCount > 0"
                    class="notifications-mark-all"
                    @click="handleMarkAllAsRead"
                  >
                    Mark all as read
                  </button>
                </div>

                <div v-if="latestNotifications.length === 0" class="notifications-empty">
                  <span class="material-symbols-outlined">notifications_none</span>
                  <p>No notifications yet.</p>
                </div>

                <div v-else class="notifications-list">
                  <button
                    v-for="notification in latestNotifications"
                    :key="notification.id"
                    class="notification-item"
                    @click="openNotification(notification.id, notification.type, notification.read)"
                  >
                    <span class="material-symbols-outlined notification-item__icon">
                      {{ getNotificationIcon(notification.type) }}
                    </span>
                    <span class="notification-item__content">
                      <span class="notification-item__message">{{ formatNotificationMessage(notification.message) }}</span>
                      <span class="notification-item__meta">
                        {{ formatNotificationDate(notification.sentDate) }}
                      </span>
                    </span>
                    <span v-if="!notification.read" class="notification-item__dot"></span>
                  </button>
                </div>
              </div>
            </transition>
          </div>

          <div class="relative">
            <button
              class="client-navbar__profile-btn flex items-center gap-2 pl-1 pr-3 py-1 rounded-full transition-all focus:outline-none"
              @click="showUserMenu = !showUserMenu"
            >
              <div
                v-if="currentProfile?.photo"
                class="w-8 h-8 rounded-full overflow-hidden"
              >
                <img
                  :src="currentProfile.photo"
                  alt="Avatar"
                  referrerpolicy="no-referrer"
                  class="w-full h-full object-cover"
                />
              </div>
              <div
                v-else
                class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-[14px] brand-text"
              >
                {{ avatarLetter }}
              </div>
              <span class="client-navbar__profile-name text-sm font-bold">{{
                currentProfile?.firstName || ""
              }}</span>
              <span
                class="client-navbar__profile-chevron material-symbols-outlined text-[18px]"
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
                  to="/reservations/history"
                  class="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-on-surface hover:bg-surface-container-low transition-colors"
                  @click="showUserMenu = false"
                >
                  <span
                    class="material-symbols-outlined text-[20px] text-outline"
                    >event_available</span
                  >
                  My Reservations
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
            class="client-navbar__register px-4 py-1.5 rounded-xl text-sm font-bold text-white bg-primary hover:bg-primary-container hover:text-white shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
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
        <NuxtLink
          to="/wishlist"
          class="block px-4 py-3 rounded-xl text-base font-bold text-on-surface hover:bg-surface-container-lowest transition-colors"
          @click="handleWishlistNav"
          >Wishlist</NuxtLink
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
import { useAuthPrompt } from "~/composables/useAuthPrompt";
import { useNotifications } from "~/composables/useNotifications";
import { NotificationType } from "~/types/enums";

const brandLogoUrl = new URL("../../../assets/images/logo.png", import.meta.url).href;
const { isAuthenticated, isAdmin, currentProfile, logout, accountId } = useAuth();
const { open: openAuthPrompt } = useAuthPrompt();
const { latestNotifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
const route = useRoute();

const showUserMenu = ref(false);
const showNotificationsMenu = ref(false);
const mobileOpen = ref(false);
const headerRef = ref<HTMLElement | null>(null);
const notificationsRef = ref<HTMLElement | null>(null);
const hasSolidHeader = ref(true);

const isHomePage = computed(() => route.path === "/");
const isTransparentHeader = computed(
  () => isHomePage.value && !hasSolidHeader.value && !mobileOpen.value,
);

const avatarLetter = computed(() => {
  const first = currentProfile.value?.firstName?.trim().charAt(0).toUpperCase() || "";
  return first || "?";
});

function handleLogout() {
  logout();
  showUserMenu.value = false;
  showNotificationsMenu.value = false;
  mobileOpen.value = false;
  navigateTo("/");
}

function toggleNotificationsMenu() {
  showUserMenu.value = false;
  showNotificationsMenu.value = !showNotificationsMenu.value;
}

function getNotificationIcon(type: NotificationType) {
  switch (type) {
    case NotificationType.PROMOTION:
      return "sell";
    case NotificationType.REMINDER:
      return "schedule";
    case NotificationType.RESERVATION_CANCELLATION:
      return "event_busy";
    case NotificationType.MODIFICATION_CONFIRMATION:
      return "info";
    case NotificationType.COMPLAINT:
      return "support_agent";
    case NotificationType.RESERVATION_CONFIRMATION:
    default:
      return "event_available";
  }
}

function resolveNotificationRoute(type: NotificationType) {
  switch (type) {
    case NotificationType.PROMOTION:
      return "/offers";
    case NotificationType.COMPLAINT:
      return "/contact";
    case NotificationType.REMINDER:
    case NotificationType.RESERVATION_CANCELLATION:
    case NotificationType.MODIFICATION_CONFIRMATION:
    case NotificationType.RESERVATION_CONFIRMATION:
    default:
      return "/reservations/history";
  }
}

function formatNotificationDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const now = new Date().getTime();
  const diffMs = Math.max(0, now - date.getTime());
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatNotificationMessage(message: string) {
  if (!message) return "";

  return message
    .replace(/\bVH-\d{4}-[A-Z0-9]+\b/gi, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([,.!?:;])/g, "$1")
    .trim();
}

async function openNotification(id: number, type: NotificationType, isRead: boolean) {
  if (!isRead) {
    await markAsRead(id);
  }
  showNotificationsMenu.value = false;
  await navigateTo(resolveNotificationRoute(type));
}

async function handleMarkAllAsRead() {
  if (!unreadCount.value) return;
  if (!accountId.value) return;

  await markAllAsRead(accountId.value);
}

function handleDocumentClick(event: MouseEvent) {
  const target = event.target as Node | null;
  if (!target) return;

  if (notificationsRef.value && !notificationsRef.value.contains(target)) {
    showNotificationsMenu.value = false;
  }
}

function handleWishlistNav(event: MouseEvent) {
  if (isAuthenticated.value) {
    mobileOpen.value = false;
    return;
  }

  event.preventDefault();
  mobileOpen.value = false;
  openAuthPrompt({
    redirectTo: "/wishlist",
  });
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
  document.addEventListener("click", handleDocumentClick);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", updateHeaderState);
  window.removeEventListener("resize", updateHeaderState);
  document.removeEventListener("click", handleDocumentClick);
});

watch(
  () => route.path,
  () => {
    showUserMenu.value = false;
    showNotificationsMenu.value = false;
    mobileOpen.value = false;
    if (typeof window !== "undefined") {
      window.requestAnimationFrame(() => updateHeaderState());
    }
  },
);
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

.client-navbar__brand-logo {
  filter: none;
  transition: filter 0.25s ease;
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

.client-navbar__brand-accent {
  color: var(--color-primary-500);
  transition: color 0.25s ease;
}

.client-navbar--solid .client-navbar__brand-text,
.client-navbar--solid .client-navbar__profile-name {
  color: var(--color-text-primary);
}

.client-navbar--solid .client-navbar__profile-chevron {
  color: var(--color-text-secondary);
}

.client-navbar--transparent .client-navbar__brand-text,
.client-navbar--transparent .client-navbar__profile-name,
.client-navbar--transparent .client-navbar__icon-btn,
.client-navbar--transparent .client-navbar__profile-chevron,
.client-navbar--transparent .client-navbar__mobile-toggle {
  color: white;
}

.client-navbar--transparent .client-navbar__brand-logo {
  filter: brightness(0) invert(1);
}

.client-navbar--transparent .client-navbar__brand-accent {
  color: var(--color-primary-400);
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

.notifications-dropdown {
  max-height: min(70vh, 520px);
  margin: 0;
}

.notifications-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 12px 14px;
  border-bottom: 1px solid rgb(209 219 229 / 0.4);
}

.notifications-head h4 {
  margin: 0;
  font-size: 0.92rem;
  font-weight: 800;
  color: var(--color-text-primary);
}

.notifications-mark-all {
  border: 0;
  background: transparent;
  color: var(--color-primary-600);
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
}

.notifications-list {
  display: flex;
  flex-direction: column;
  max-height: min(60vh, 420px);
  overflow-y: auto;
}

.notification-item {
  width: 100%;
  border: 0;
  border-bottom: 1px solid rgb(209 219 229 / 0.35);
  background: white;
  cursor: pointer;
  text-align: left;
  display: grid;
  grid-template-columns: 24px 1fr auto;
  align-items: start;
  gap: 10px;
  padding: 12px 14px;
}

.notification-item:hover {
  background: color-mix(in srgb, var(--color-primary-50) 60%, white 40%);
}

.notification-item:last-child {
  border-bottom: 0;
}

.notification-item__icon {
  color: var(--color-primary-600);
  font-size: 1.2rem;
  margin-top: 1px;
}

.notification-item__content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.notification-item__message {
  font-size: 0.84rem;
  line-height: 1.45;
  color: var(--color-text-primary);
  font-weight: 600;
}

.notification-item__meta {
  font-size: 0.74rem;
  color: var(--color-text-secondary);
  font-weight: 600;
}

.notification-item__dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: var(--color-primary-500);
  margin-top: 6px;
}

.notifications-empty {
  min-height: 140px;
  display: grid;
  place-content: center;
  text-align: center;
  gap: 8px;
  color: var(--color-text-secondary);
}

.notifications-empty .material-symbols-outlined {
  font-size: 1.45rem;
}

.notifications-empty p {
  margin: 0;
  font-size: 0.84rem;
  font-weight: 600;
}

@media (max-width: 768px) {
  .client-navbar--transparent {
    background: rgba(10, 27, 44, 0.16);
    backdrop-filter: blur(10px);
  }
}
</style>
