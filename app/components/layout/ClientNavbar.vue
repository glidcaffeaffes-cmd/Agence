<template>
  <header
    ref="headerRef"
    :class="[
      'client-navbar',
      isHomePage ? 'client-navbar--overlay' : 'client-navbar--sticky',
      isTransparentHeader
        ? 'client-navbar--transparent'
        : 'client-navbar--solid',
    ]"
  >
    <div class="client-navbar__inner app-shell">
      <div class="client-navbar__left">
        <NuxtLink
          to="/"
          class="client-navbar__brand"
          @click="mobileOpen = false"
        >
          <div class="client-navbar__brand-mark">
            <img
              :src="brandLogoUrl"
              alt=""
              class="client-navbar__brand-logo"
              aria-hidden="true"
            />
          </div>
          <span class="client-navbar__brand-text">
            Voyage<span class="client-navbar__brand-accent">Hub</span>
          </span>
        </NuxtLink>

        <nav class="client-navbar__desktop-nav">
          <NuxtLink
            to="/hotels"
            class="client-navbar__link"
            active-class="client-navbar__link--active"
          >
            {{ t("nav.hotels") }}
          </NuxtLink>
          <NuxtLink
            to="/offers"
            class="client-navbar__link"
            active-class="client-navbar__link--active"
          >
            {{ t("nav.offers") }}
          </NuxtLink>
          <NuxtLink
            to="/wishlist"
            class="client-navbar__link"
            active-class="client-navbar__link--active"
            @click="handleWishlistNav"
          >
            {{ t("nav.wishlist") }}
          </NuxtLink>
        </nav>
      </div>

      <div class="client-navbar__desktop-controls">
        <div class="client-navbar__preferences">
          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>

        <template v-if="isAuthenticated">
          <div ref="notificationsRef" class="client-navbar__menu-shell">
            <button
              class="client-navbar__icon-btn"
              :title="t('nav.notifications')"
              @click="toggleNotificationsMenu"
            >
              <span class="material-symbols-outlined">notifications</span>
              <span
                v-if="unreadCount > 0"
                class="client-navbar__badge"
              >
                {{ unreadCount > 99 ? "99+" : unreadCount }}
              </span>
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
                class="notifications-dropdown"
              >
                <div class="notifications-head">
                  <h4>{{ t("nav.notifications") }}</h4>
                  <button
                    v-if="unreadCount > 0"
                    class="notifications-mark-all"
                    @click="handleMarkAllAsRead"
                  >
                    {{ t("nav.markAllAsRead") }}
                  </button>
                </div>

                <div
                  v-if="latestNotifications.length === 0"
                  class="notifications-empty"
                >
                  <span class="material-symbols-outlined">notifications_none</span>
                  <p>{{ t("nav.noNotifications") }}</p>
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
                      <span class="notification-item__message">
                        {{ formatNotificationMessage(notification.message) }}
                      </span>
                      <span class="notification-item__meta">
                        {{ formatNotificationDate(notification.sentDate) }}
                      </span>
                    </span>
                    <span
                      v-if="!notification.read"
                      class="notification-item__dot"
                    ></span>
                  </button>
                </div>
              </div>
            </transition>
          </div>

          <div ref="userMenuRef" class="client-navbar__menu-shell">
            <button
              class="client-navbar__profile-btn"
              @click="showUserMenu = !showUserMenu"
            >
              <div
                v-if="currentProfile?.photo"
                class="client-navbar__avatar-wrap"
              >
                <img
                  :src="currentProfile.photo"
                  alt="Avatar"
                  referrerpolicy="no-referrer"
                  class="client-navbar__avatar"
                />
              </div>
              <div
                v-else
                class="client-navbar__avatar-placeholder brand-text"
              >
                {{ avatarLetter }}
              </div>
              <span class="client-navbar__profile-name">
                {{ currentProfile?.firstName || "" }}
              </span>
              <span class="client-navbar__profile-chevron material-symbols-outlined">
                expand_more
              </span>
            </button>

            <transition
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="opacity-0 translate-y-2"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition duration-150 ease-in"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 translate-y-2"
            >
              <div v-if="showUserMenu" class="client-navbar__dropdown">
                <NuxtLink
                  to="/profile"
                  class="client-navbar__dropdown-link"
                  @click="showUserMenu = false"
                >
                  <span class="material-symbols-outlined">person</span>
                  {{ t("nav.profile") }}
                </NuxtLink>
                <NuxtLink
                  to="/reservations/history"
                  class="client-navbar__dropdown-link"
                  @click="showUserMenu = false"
                >
                  <span class="material-symbols-outlined">event_available</span>
                  {{ t("nav.myReservations") }}
                </NuxtLink>
                <NuxtLink
                  v-if="isAdmin"
                  to="/admin"
                  class="client-navbar__dropdown-link"
                  @click="showUserMenu = false"
                >
                  <span class="material-symbols-outlined">admin_panel_settings</span>
                  {{ t("nav.adminPanel") }}
                </NuxtLink>
                <button
                  class="client-navbar__dropdown-link client-navbar__dropdown-link--danger"
                  @click="handleLogout"
                >
                  <span class="material-symbols-outlined">logout</span>
                  {{ t("nav.logout") }}
                </button>
              </div>
            </transition>
          </div>
        </template>

        <template v-else>
          <NuxtLink to="/login" class="client-navbar__sign-in">
            {{ t("nav.signIn") }}
          </NuxtLink>
          <NuxtLink to="/register" class="client-navbar__register">
            {{ t("nav.register") }}
          </NuxtLink>
        </template>
      </div>

      <button
        class="client-navbar__mobile-toggle"
        :title="mobileOpen ? t('nav.closeMenu') : t('nav.menu')"
        @click="mobileOpen = !mobileOpen"
      >
        <span class="material-symbols-outlined">
          {{ mobileOpen ? "close" : "menu" }}
        </span>
      </button>
    </div>

    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div v-if="mobileOpen" class="client-navbar__mobile-panel">
        <div class="client-navbar__mobile-links">
          <NuxtLink to="/" class="client-navbar__mobile-link" @click="closeMobileNav">
            {{ t("nav.home") }}
          </NuxtLink>
          <NuxtLink
            to="/hotels"
            class="client-navbar__mobile-link"
            @click="closeMobileNav"
          >
            {{ t("nav.hotels") }}
          </NuxtLink>
          <NuxtLink
            to="/offers"
            class="client-navbar__mobile-link"
            @click="closeMobileNav"
          >
            {{ t("nav.offers") }}
          </NuxtLink>
          <NuxtLink
            to="/wishlist"
            class="client-navbar__mobile-link"
            @click="handleWishlistNav"
          >
            {{ t("nav.wishlist") }}
          </NuxtLink>
        </div>

        <div class="client-navbar__mobile-preferences">
          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>

        <template v-if="isAuthenticated">
          <div class="client-navbar__mobile-divider"></div>
          <NuxtLink
            to="/profile"
            class="client-navbar__mobile-link"
            @click="closeMobileNav"
          >
            {{ t("nav.profile") }}
          </NuxtLink>
          <NuxtLink
            to="/reservations/history"
            class="client-navbar__mobile-link"
            @click="closeMobileNav"
          >
            {{ t("nav.myReservations") }}
          </NuxtLink>
          <NuxtLink
            v-if="isAdmin"
            to="/admin"
            class="client-navbar__mobile-link"
            @click="closeMobileNav"
          >
            {{ t("nav.adminPanel") }}
          </NuxtLink>
          <button
            class="client-navbar__mobile-link client-navbar__mobile-link--danger"
            @click="handleLogout"
          >
            {{ t("nav.logout") }}
          </button>
        </template>

        <template v-else>
          <div class="client-navbar__mobile-divider"></div>
          <NuxtLink
            to="/login"
            class="client-navbar__mobile-link client-navbar__mobile-link--ghost"
            @click="closeMobileNav"
          >
            {{ t("nav.signIn") }}
          </NuxtLink>
          <NuxtLink
            to="/register"
            class="client-navbar__mobile-link client-navbar__mobile-link--primary"
            @click="closeMobileNav"
          >
            {{ t("nav.register") }}
          </NuxtLink>
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

const { isAuthenticated, isAdmin, currentProfile, logout, accountId } = useAuth();
const { open: openAuthPrompt } = useAuthPrompt();
const { latestNotifications, unreadCount, markAsRead, markAllAsRead } =
  useNotifications();
const { t, formatDate } = useAppI18n();
const route = useRoute();
const runtimeConfig = useRuntimeConfig();
const brandLogoUrl = `${runtimeConfig.app.baseURL}logo.png`;

const showUserMenu = ref(false);
const showNotificationsMenu = ref(false);
const mobileOpen = ref(false);
const headerRef = ref<HTMLElement | null>(null);
const notificationsRef = ref<HTMLElement | null>(null);
const userMenuRef = ref<HTMLElement | null>(null);
const hasSolidHeader = ref(true);

const isHomePage = computed(() => route.path === "/");
const isTransparentHeader = computed(
  () => isHomePage.value && !hasSolidHeader.value && !mobileOpen.value,
);

const avatarLetter = computed(() => {
  const first = currentProfile.value?.firstName?.trim().charAt(0).toUpperCase() || "";
  return first || "?";
});

function closeMobileNav() {
  mobileOpen.value = false;
}

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

  if (diffMinutes < 1) return t("notifications.justNow");
  if (diffMinutes < 60) return t("notifications.minutesAgo", { count: diffMinutes });

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return t("notifications.hoursAgo", { count: diffHours });

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return t("notifications.daysAgo", { count: diffDays });

  return formatDate(date, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
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
  if (!unreadCount.value || !accountId.value) {
    return;
  }

  await markAllAsRead(accountId.value);
}

function handleDocumentClick(event: MouseEvent) {
  const target = event.target as Node | null;
  if (!target) {
    return;
  }

  if (notificationsRef.value && !notificationsRef.value.contains(target)) {
    showNotificationsMenu.value = false;
  }

  if (userMenuRef.value && !userMenuRef.value.contains(target)) {
    showUserMenu.value = false;
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
  () => route.fullPath,
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
.client-navbar {
  z-index: var(--z-sticky);
  transition:
    background-color var(--duration-normal) var(--easing-standard),
    border-color var(--duration-normal) var(--easing-standard),
    box-shadow var(--duration-normal) var(--easing-standard),
    backdrop-filter var(--duration-normal) var(--easing-standard);
}

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
  background: color-mix(in srgb, var(--navbar-bg) 88%, transparent);
  border-bottom: 1px solid color-mix(in srgb, var(--color-border) 70%, transparent);
  backdrop-filter: blur(16px);
  box-shadow: 0 1px 0 rgb(15 23 42 / 0.06);
}

.client-navbar__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  min-height: 78px;
}

.client-navbar__left {
  display: flex;
  align-items: center;
  gap: clamp(1rem, 3vw, 2rem);
  min-width: 0;
}

.client-navbar__brand {
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  color: var(--color-primary-600);
  text-decoration: none;
  min-width: 0;
}

.client-navbar__brand-mark {
  width: 2.6rem;
  height: 2.6rem;
  border-radius: 1rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.client-navbar__brand-logo {
  width: 2rem;
  height: 2rem;
  object-fit: contain;
  filter: none;
  transition: filter var(--duration-normal) var(--easing-standard);
}

.client-navbar__brand-text {
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--color-text-primary);
  white-space: nowrap;
}

.client-navbar__brand-accent {
  color: var(--color-primary-500);
}

.client-navbar__desktop-nav,
.client-navbar__desktop-controls {
  display: none;
}

.client-navbar__desktop-nav {
  align-items: center;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.client-navbar__desktop-controls {
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  min-width: 0;
}

.client-navbar__preferences {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  flex-wrap: wrap;
}

.client-navbar__link,
.client-navbar__icon-btn,
.client-navbar__profile-name,
.client-navbar__profile-chevron,
.client-navbar__mobile-toggle {
  transition:
    color var(--duration-fast) var(--easing-standard),
    background-color var(--duration-fast) var(--easing-standard),
    border-color var(--duration-fast) var(--easing-standard);
}

.client-navbar__link {
  padding: 0.65rem 0.95rem;
  border-radius: 0.9rem;
  color: var(--color-text-secondary);
  font-size: 0.92rem;
  font-weight: 700;
  text-decoration: none;
}

.client-navbar__link:hover,
.client-navbar__link--active {
  color: var(--color-primary-600);
  background: color-mix(in srgb, var(--color-primary-500) 10%, transparent);
}

.client-navbar__menu-shell {
  position: relative;
}

.client-navbar__icon-btn {
  position: relative;
  width: 2.75rem;
  height: 2.75rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-border-soft);
  border-radius: 999px;
  background: var(--color-surface);
  color: var(--color-text-secondary);
  cursor: pointer;
}

.client-navbar__icon-btn:hover {
  color: var(--color-primary-600);
  border-color: color-mix(in srgb, var(--color-primary-400) 45%, transparent);
}

.client-navbar__badge {
  position: absolute;
  top: 0.18rem;
  inset-inline-end: 0.15rem;
  min-width: 1rem;
  height: 1rem;
  padding-inline: 0.18rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: var(--color-danger-500);
  color: var(--color-white);
  font-size: 0.62rem;
  font-weight: 800;
  line-height: 1;
}

.client-navbar__profile-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  min-height: 2.85rem;
  padding: 0.3rem 0.8rem 0.3rem 0.35rem;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: var(--color-surface);
  cursor: pointer;
}

.client-navbar__profile-btn:hover {
  border-color: color-mix(in srgb, var(--color-primary-400) 48%, transparent);
  background: var(--color-surface-secondary);
}

.client-navbar__avatar-wrap,
.client-navbar__avatar-placeholder {
  width: 2rem;
  height: 2rem;
  border-radius: 999px;
  overflow: hidden;
  flex-shrink: 0;
}

.client-navbar__avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.client-navbar__avatar-placeholder {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary-500);
  color: var(--color-white);
  font-size: 0.76rem;
  font-weight: 800;
}

.client-navbar__profile-name {
  color: var(--color-text-primary);
  font-size: 0.88rem;
  font-weight: 800;
}

.client-navbar__profile-chevron {
  color: var(--color-text-secondary);
  font-size: 1.05rem;
}

.client-navbar__dropdown,
.notifications-dropdown {
  position: absolute;
  inset-inline-end: 0;
  margin-top: 0.75rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border-soft);
  border-radius: 1rem;
  box-shadow: var(--shadow-dropdown);
  z-index: var(--z-dropdown);
}

.client-navbar__dropdown {
  min-width: 14.5rem;
  padding: 0.45rem;
}

.client-navbar__dropdown-link {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0.85rem;
  border: 0;
  border-radius: 0.8rem;
  background: transparent;
  color: var(--color-text-primary);
  font-size: 0.9rem;
  font-weight: 600;
  text-align: start;
  text-decoration: none;
  cursor: pointer;
}

.client-navbar__dropdown-link:hover {
  background: color-mix(in srgb, var(--color-primary-500) 9%, transparent);
  color: var(--color-primary-700);
}

.client-navbar__dropdown-link .material-symbols-outlined {
  font-size: 1.15rem;
  color: var(--color-text-secondary);
}

.client-navbar__dropdown-link--danger {
  color: var(--color-danger-600);
}

.client-navbar__dropdown-link--danger:hover {
  background: var(--alert-danger-bg);
  color: var(--color-danger-700);
}

.client-navbar__sign-in,
.client-navbar__register {
  min-height: 2.7rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 1rem;
  border-radius: 0.95rem;
  font-size: 0.9rem;
  font-weight: 800;
  text-decoration: none;
  transition:
    transform var(--duration-fast) var(--easing-standard),
    box-shadow var(--duration-fast) var(--easing-standard),
    border-color var(--duration-fast) var(--easing-standard),
    background-color var(--duration-fast) var(--easing-standard);
}

.client-navbar__sign-in {
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
  background: var(--color-surface);
}

.client-navbar__sign-in:hover {
  border-color: var(--color-primary-400);
  color: var(--color-primary-600);
}

.client-navbar__register {
  color: var(--color-white);
  background: linear-gradient(
    135deg,
    var(--color-primary-500),
    var(--color-primary-600)
  );
  box-shadow: 0 12px 24px rgb(0 103 104 / 0.18);
}

.client-navbar__register:hover {
  transform: translateY(-1px);
  box-shadow: 0 16px 28px rgb(0 103 104 / 0.24);
}

.client-navbar__mobile-toggle {
  width: 2.75rem;
  height: 2.75rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-border-soft);
  border-radius: 999px;
  background: var(--color-surface);
  color: var(--color-text-primary);
  cursor: pointer;
}

.client-navbar__mobile-toggle .material-symbols-outlined {
  font-size: 1.55rem;
}

.client-navbar__mobile-panel {
  border-top: 1px solid color-mix(in srgb, var(--color-border) 64%, transparent);
  background: color-mix(in srgb, var(--color-surface) 96%, transparent);
  backdrop-filter: blur(16px);
  padding: 0 1rem 1.25rem;
}

.client-navbar__mobile-links,
.client-navbar__mobile-preferences {
  display: grid;
  gap: 0.7rem;
}

.client-navbar__mobile-links {
  padding-top: 1rem;
}

.client-navbar__mobile-preferences {
  margin-top: 1rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.client-navbar__mobile-link {
  min-height: 2.9rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.8rem 1rem;
  border: 1px solid var(--color-border-soft);
  border-radius: 1rem;
  background: var(--color-surface);
  color: var(--color-text-primary);
  font-size: 0.95rem;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
}

.client-navbar__mobile-link--ghost {
  color: var(--color-primary-700);
  background: color-mix(in srgb, var(--color-primary-50) 55%, var(--color-surface));
}

.client-navbar__mobile-link--primary {
  color: var(--color-white);
  background: linear-gradient(
    135deg,
    var(--color-primary-500),
    var(--color-primary-600)
  );
}

.client-navbar__mobile-link--danger {
  color: var(--color-danger-700);
  background: var(--alert-danger-bg);
}

.client-navbar__mobile-divider {
  height: 1px;
  margin: 1rem 0;
  background: color-mix(in srgb, var(--color-border) 70%, transparent);
}

.notifications-dropdown {
  width: min(22.5rem, calc(100vw - 1.5rem));
  overflow: hidden;
  max-height: min(70vh, 32rem);
}

.notifications-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.9rem 0.95rem;
  border-bottom: 1px solid color-mix(in srgb, var(--color-border) 64%, transparent);
}

.notifications-head h4 {
  margin: 0;
  color: var(--color-text-primary);
  font-size: 0.95rem;
  font-weight: 800;
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
  max-height: min(60vh, 26rem);
  overflow-y: auto;
}

.notification-item {
  width: 100%;
  border: 0;
  border-bottom: 1px solid color-mix(in srgb, var(--color-border) 52%, transparent);
  background: var(--color-surface);
  cursor: pointer;
  text-align: start;
  display: grid;
  grid-template-columns: 1.5rem minmax(0, 1fr) auto;
  align-items: start;
  gap: 0.7rem;
  padding: 0.85rem 0.95rem;
}

.notification-item:hover {
  background: color-mix(in srgb, var(--color-primary-500) 8%, var(--color-surface));
}

.notification-item:last-child {
  border-bottom: 0;
}

.notification-item__icon {
  color: var(--color-primary-600);
  font-size: 1.15rem;
}

.notification-item__content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}

.notification-item__message {
  color: var(--color-text-primary);
  font-size: 0.84rem;
  font-weight: 600;
  line-height: 1.45;
}

.notification-item__meta {
  color: var(--color-text-secondary);
  font-size: 0.75rem;
  font-weight: 600;
}

.notification-item__dot {
  width: 0.5rem;
  height: 0.5rem;
  margin-top: 0.35rem;
  border-radius: 999px;
  background: var(--color-primary-500);
}

.notifications-empty {
  min-height: 8.5rem;
  display: grid;
  place-content: center;
  text-align: center;
  gap: 0.55rem;
  color: var(--color-text-secondary);
  padding: 1rem;
}

.notifications-empty .material-symbols-outlined {
  font-size: 1.5rem;
}

.notifications-empty p {
  margin: 0;
  font-size: 0.85rem;
  font-weight: 600;
}

.client-navbar--transparent .client-navbar__brand-text,
.client-navbar--transparent .client-navbar__profile-name,
.client-navbar--transparent .client-navbar__icon-btn,
.client-navbar--transparent .client-navbar__profile-chevron,
.client-navbar--transparent .client-navbar__mobile-toggle,
.client-navbar--transparent .client-navbar__sign-in {
  color: var(--color-white);
}

.client-navbar--transparent .client-navbar__brand-logo {
  filter: brightness(0) invert(1);
}

.client-navbar--transparent .client-navbar__brand-accent {
  color: var(--color-primary-300);
}

.client-navbar--transparent .client-navbar__link {
  color: rgb(255 255 255 / 0.86);
}

.client-navbar--transparent .client-navbar__link:hover,
.client-navbar--transparent .client-navbar__link--active {
  color: var(--color-white);
  background: rgb(255 255 255 / 0.11);
}

.client-navbar--transparent .client-navbar__icon-btn,
.client-navbar--transparent .client-navbar__profile-btn,
.client-navbar--transparent .client-navbar__mobile-toggle,
.client-navbar--transparent .client-navbar__sign-in {
  border-color: rgb(255 255 255 / 0.22);
  background: rgb(255 255 255 / 0.08);
}

.client-navbar--transparent .client-navbar__profile-btn:hover,
.client-navbar--transparent .client-navbar__icon-btn:hover,
.client-navbar--transparent .client-navbar__mobile-toggle:hover,
.client-navbar--transparent .client-navbar__sign-in:hover {
  background: rgb(255 255 255 / 0.14);
}

@media (min-width: 1024px) {
  .client-navbar__desktop-nav,
  .client-navbar__desktop-controls {
    display: flex;
  }

  .client-navbar__mobile-toggle,
  .client-navbar__mobile-panel {
    display: none;
  }
}

@media (max-width: 1023px) {
  .client-navbar__inner {
    min-height: 74px;
  }

  .client-navbar--transparent {
    background: rgb(10 27 44 / 0.22);
    backdrop-filter: blur(10px);
  }
}

@media (max-width: 640px) {
  .client-navbar__brand-text {
    font-size: 1.1rem;
  }

  .client-navbar__mobile-panel {
    padding-inline: 0.9rem;
  }

  .client-navbar__mobile-preferences {
    grid-template-columns: 1fr;
  }
}
</style>
