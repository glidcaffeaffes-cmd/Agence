<template>
  <div class="profile-page">
    <Head>
      <title>Reservation History — VoyageHub</title>
      <meta
        name="description"
        content="View your complete reservation history and past stays with VoyageHub."
      />
    </Head>

    <div class="profile-container">
      <header class="page-header">
        <span class="badge-label">My Bookings</span>
      </header>

      <div class="profile-body">
        <!-- Sidebar -->
        <ProfileSidebar />

        <!-- Main -->
        <main class="profile-main">
          <!-- Filters & Search Bar -->
          <div class="control-panel">
            <div class="search-bar-wrap">
              <span class="material-symbols-outlined search-icon">search</span>
              <input
                v-model="search"
                type="text"
                placeholder="Search by hotel, city, or confirmation code…"
                class="search-input"
              />
            </div>

            <div class="filters-wrap">
              <div class="status-pills">
                <button
                  v-for="s in statuses"
                  :key="s.value"
                  @click="statusFilter = s.value"
                  class="filter-pill"
                  :class="{ 'filter-pill--active': statusFilter === s.value }"
                >
                  <span
                    class="material-symbols-outlined pill-icon"
                    v-if="s.value"
                    >{{ statusIcon(s.value) }}</span
                  >
                  {{ s.label }}
                </button>
              </div>

              <div class="sort-wrap">
                <div class="custom-select-wrap">
                  <select v-model="yearFilter" class="custom-select">
                    <option value="">All Years</option>
                    <option v-for="y in years" :key="y" :value="y">
                      {{ y }}
                    </option>
                  </select>
                  <span class="material-symbols-outlined select-chevron"
                    >expand_more</span
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="empty-display">
            <div class="loader-wrap">
              <span class="material-symbols-outlined spin"
                >progress_activity</span
              >
              <p>Fetching your journey details…</p>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else-if="filtered.length === 0" class="empty-display">
            <div class="empty-card">
              <div class="empty-icon-box">
                <span class="material-symbols-outlined">luggage</span>
              </div>
              <h3 class="empty-title">No reservations found</h3>
              <p class="empty-text">
                We couldn't find any bookings matching your current filters.
                Start exploring to plan your next adventure!
              </p>
              <div class="empty-actions">
                <NuxtLink to="/hotels" class="btn-primary">
                  <span class="material-symbols-outlined">explore</span>
                  Explore Destinations
                </NuxtLink>
                <button
                  v-if="search || statusFilter || yearFilter"
                  @click="resetFilters"
                  class="btn-ghost"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>

          <!-- Results Timeline -->
          <div v-else class="history-timeline">
            <template v-for="(group, year) in grouped" :key="year">
              <div class="timeline-header">
                <span class="timeline-year">{{ year }}</span>
                <div class="timeline-line"></div>
              </div>

              <div class="reservation-grid">
                <div
                  v-for="r in group"
                  :key="r.id"
                  class="journey-card"
                  :class="`journey-card--${r.status.toLowerCase()}`"
                >
                  <div class="journey-card__image">
                    <img
                      v-if="getHotel(r.hotelId)"
                      :src="getHotel(r.hotelId)?.images[0]"
                      :alt="getHotel(r.hotelId)?.name"
                    />
                    <div v-else class="image-placeholder">
                      <span class="material-symbols-outlined">hotel</span>
                    </div>
                    <div
                      class="journey-status-tag"
                      :class="badgeClass(r.status)"
                    >
                      <span class="material-symbols-outlined">{{
                        statusIcon(r.status)
                      }}</span>
                      {{ r.status }}
                    </div>
                  </div>

                  <div class="journey-card__content">
                    <div class="journey-card__header">
                      <div class="journey-card__id">
                        REF: {{ r.confirmationCode }}
                      </div>
                      <h3 class="journey-card__title">
                        {{ getHotel(r.hotelId)?.name || "Hotel #" + r.hotelId }}
                      </h3>
                      <div class="journey-card__location">
                        <span class="material-symbols-outlined"
                          >location_on</span
                        >
                        {{ getHotel(r.hotelId)?.city }},
                        {{ getHotel(r.hotelId)?.country }}
                      </div>
                    </div>

                    <div class="journey-card__details">
                      <div class="detail-block">
                        <span class="detail-label">Check-in</span>
                        <span class="detail-value">{{
                          formatDate(r.checkInDate)
                        }}</span>
                      </div>
                      <div class="detail-block">
                        <span class="detail-label">Stay Duration</span>
                        <span class="detail-value"
                          >{{ r.numberOfNights }} Night{{
                            r.numberOfNights > 1 ? "s" : ""
                          }}</span
                        >
                      </div>
                      <div class="detail-block detail-block--price">
                        <span class="detail-label">Total Cost</span>
                        <span class="detail-value">{{
                          formatCurrency(r.totalAmount)
                        }}</span>
                      </div>
                    </div>

                    <div class="journey-card__footer">
                      <NuxtLink
                        :to="`/hotels/${r.hotelId}`"
                        class="btn-card-action"
                      >
                        View Details
                        <span class="material-symbols-outlined"
                          >arrow_forward</span
                        >
                      </NuxtLink>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: "auth" });
import { ref, computed, onMounted } from "vue";
import { useAuth } from "~/composables/useAuth";
import { useReservations } from "~/composables/useReservations";
import { useHotels } from "~/composables/useHotels";

const { accountId } = useAuth();
const { reservations, loading: rLoading, fetchByAccount } = useReservations();
const { hotels, fetchAll: fetchHotels, loading: hLoading } = useHotels();

const search = ref("");
const statusFilter = ref("");
const yearFilter = ref("");

const loading = computed(() => rLoading.value || hLoading.value);

const statuses = [
  { value: "", label: "All" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "COMPLETED", label: "Completed" },
  { value: "PENDING", label: "Pending" },
];

const years = computed(() => {
  const ys = new Set(
    reservations.value.map((r) => r.checkInDate.substring(0, 4)),
  );
  return [...ys].sort((a, b) => b.localeCompare(a));
});

function getHotel(id: number) {
  return hotels.value.find((h) => h.id === id);
}

const filtered = computed(() =>
  reservations.value.filter((r) => {
    const hotel = getHotel(r.hotelId);
    const matchSearch =
      !search.value ||
      r.confirmationCode.toLowerCase().includes(search.value.toLowerCase()) ||
      (hotel &&
        hotel.name.toLowerCase().includes(search.value.toLowerCase())) ||
      (hotel && hotel.city.toLowerCase().includes(search.value.toLowerCase()));
    const matchStatus = !statusFilter.value || r.status === statusFilter.value;
    const matchYear =
      !yearFilter.value || r.checkInDate.startsWith(yearFilter.value);
    return matchSearch && matchStatus && matchYear;
  }),
);

const grouped = computed<Record<string, typeof filtered.value>>(() => {
  const result: Record<string, typeof filtered.value> = {};
  for (const r of [...filtered.value].sort((a, b) =>
    b.checkInDate.localeCompare(a.checkInDate),
  )) {
    const year = r.checkInDate.substring(0, 4);
    if (!result[year]) result[year] = [];
    result[year].push(r);
  }
  return result;
});

function resetFilters() {
  search.value = "";
  statusFilter.value = "";
  yearFilter.value = "";
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
  }).format(n);
}

function statusIcon(s: string) {
  const map: Record<string, string> = {
    CONFIRMED: "check_circle",
    CANCELLED: "cancel",
    COMPLETED: "task_alt",
    PENDING: "schedule",
    BLOCKED: "block",
  };
  return map[s] ?? "help";
}

function badgeClass(s: string) {
  const map: Record<string, string> = {
    CONFIRMED: "badge--confirmed",
    COMPLETED: "badge--completed",
    CANCELLED: "badge--cancelled",
    PENDING: "badge--pending",
    BLOCKED: "badge--blocked",
  };
  return map[s] ?? "";
}

onMounted(async () => {
  await Promise.all([
    accountId.value ? fetchByAccount(accountId.value) : Promise.resolve(),
    fetchHotels(),
  ]);
});
</script>

<style scoped>
.material-symbols-outlined {
  font-variation-settings:
    "FILL" 0,
    "wght" 400,
    "GRAD" 0,
    "opsz" 24;
}

/* Page shell */
.profile-page {
  min-height: 100vh;
  background: var(--color-bg-soft);
}

.profile-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 32px 80px;
}

/* Header */
.page-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
}

.badge-label {
  display: inline-block;
  padding: 4px 12px;
  background: var(--color-primary-25);
  color: var(--color-primary-700);
  border-radius: var(--radius-full);
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin-bottom: 12px;
}

.page-header__title {
  font-size: 42px;
  font-weight: 700;
  color: var(--color-heading);
  letter-spacing: -0.02em;
  line-height: 1.1;
  margin: 0 0 8px;
}

.page-header__sub {
  font-size: 15px;
  color: var(--color-text-muted);
  margin: 0;
}

.btn-book {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 28px;
  background: var(--color-primary-600);
  color: #fff;
  border-radius: var(--radius-xl);
  text-decoration: none;
  font-size: 14px;
  font-weight: 700;
  box-shadow: 0 8px 24px rgba(0, 103, 104, 0.2);
  transition: all 0.2s ease;
}

.btn-book:hover {
  background: var(--color-primary-700);
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(0, 103, 104, 0.3);
}

/* Layout */
.profile-body {
  display: flex;
  gap: 32px;
  align-items: flex-start;
}

.profile-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* Control Panel (Filters) */
.control-panel {
  background: #ffffff;
  padding: 24px;
  border-radius: var(--radius-2xl);
  border: 1px solid var(--color-border-soft);
  box-shadow: 0 4px 20px -4px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.search-bar-wrap {
  position: relative;
  width: 100%;
}

.search-icon {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-muted);
  font-size: 22px;
}

.search-input {
  width: 100%;
  padding: 16px 20px 16px 56px;
  background: var(--color-bg-soft);
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-xl);
  font-size: 14px;
  color: var(--color-text);
  transition: all 0.2s ease;
  outline: none;
}

.search-input:focus {
  background: #ffffff;
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 4px rgba(0, 103, 104, 0.1);
}

.filters-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.status-pills {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.filter-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: var(--color-bg-soft);
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-pill);
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-pill:hover {
  background: #ffffff;
  border-color: var(--color-primary-300);
  color: var(--color-primary-600);
}

.filter-pill--active {
  background: var(--color-primary-600);
  border-color: var(--color-primary-600);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 103, 104, 0.2);
}

.pill-icon {
  font-size: 18px;
}

.custom-select-wrap {
  position: relative;
  min-width: 140px;
}

.custom-select {
  width: 100%;
  appearance: none;
  padding: 10px 40px 10px 16px;
  background: var(--color-bg-soft);
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-xl);
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text);
  cursor: pointer;
  outline: none;
}

.select-chevron {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-muted);
  pointer-events: none;
}

/* Empty Display */
.empty-display {
  padding: 80px 0;
}

.empty-card {
  text-align: center;
  max-width: 460px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.empty-icon-box {
  width: 80px;
  height: 80px;
  background: var(--color-primary-25);
  color: var(--color-primary-600);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}

.empty-icon-box .material-symbols-outlined {
  font-size: 40px;
}

.empty-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-heading);
  margin: 0;
}

.empty-text {
  font-size: 15px;
  color: var(--color-text-muted);
  line-height: 1.6;
}

.empty-actions {
  display: flex;
  gap: 16px;
  margin-top: 12px;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  background: var(--color-primary-600);
  color: #fff;
  border-radius: var(--radius-xl);
  text-decoration: none;
  font-size: 14px;
  font-weight: 700;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: var(--color-primary-700);
  transform: translateY(-2px);
}

.btn-ghost {
  padding: 14px 24px;
  background: transparent;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-xl);
  font-size: 14px;
  font-weight: 700;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-ghost:hover {
  background: var(--color-bg-soft);
  color: var(--color-heading);
}

/* Results Display */
.history-timeline {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.timeline-header {
  display: flex;
  align-items: center;
  gap: 20px;
}

.timeline-year {
  font-size: 13px;
  font-weight: 800;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  background: #ffffff;
  padding: 6px 16px;
  border-radius: var(--radius-pill);
  border: 1px solid var(--color-border-soft);
}

.timeline-line {
  flex: 1;
  height: 1px;
  background: var(--color-border-soft);
}

.reservation-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100%, 1fr));
  gap: 20px;
}

.journey-card {
  background: #ffffff;
  border: 1px solid var(--color-border-soft);
  border-radius: var(--radius-2xl);
  overflow: hidden;
  display: flex;
  transition: all 0.3s ease;
}

.journey-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px -12px rgba(0, 0, 0, 0.1);
  border-color: var(--color-primary-200);
}

.journey-card__image {
  width: 240px;
  position: relative;
  flex-shrink: 0;
  overflow: hidden;
}

.journey-card__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.journey-card:hover .journey-card__image img {
  transform: scale(1.08);
}

.image-placeholder {
  width: 100%;
  height: 100%;
  background: var(--color-bg-soft);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted);
}

.journey-status-tag {
  position: absolute;
  top: 16px;
  left: 16px;
  padding: 6px 12px;
  border-radius: var(--radius-pill);
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  display: flex;
  align-items: center;
  gap: 6px;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.4);
}

.journey-card__content {
  flex: 1;
  padding: 28px;
  display: flex;
  flex-direction: column;
}

.journey-card__header {
  margin-bottom: 20px;
}

.journey-card__id {
  font-size: 10px;
  font-weight: 800;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 6px;
}

.journey-card__title {
  font-size: 22px;
  font-weight: 700;
  color: var(--color-heading);
  margin: 0 0 8px;
}

.journey-card__location {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--color-text-muted);
}

.journey-card__location .material-symbols-outlined {
  font-size: 16px;
  color: var(--color-primary-500);
}

.journey-card__details {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  padding: 20px 0;
  border-top: 1px solid var(--color-border-soft);
  border-bottom: 1px solid var(--color-border-soft);
  margin-bottom: 20px;
}

.detail-block {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-label {
  font-size: 10px;
  font-weight: 700;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.detail-value {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-heading);
}

.detail-block--price .detail-value {
  color: var(--color-primary-600);
}

.journey-card__footer {
  margin-top: auto;
  display: flex;
  justify-content: flex-end;
}

.btn-card-action {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 700;
  color: var(--color-primary-600);
  text-decoration: none;
  transition: all 0.2s ease;
}

.btn-card-action:hover {
  color: var(--color-primary-800);
  gap: 12px;
}

/* Status Badges Colors */
.badge--confirmed {
  background: rgba(0, 103, 104, 0.9);
  color: #fff;
}
.badge--completed {
  background: rgba(16, 185, 129, 0.9);
  color: #fff;
}
.badge--cancelled {
  background: rgba(239, 68, 68, 0.9);
  color: #fff;
}
.badge--pending {
  background: rgba(245, 158, 11, 0.9);
  color: #fff;
}

.loader-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  color: var(--color-text-muted);
}

.spin {
  animation: spin 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Responsive Adjustments */
@media (max-width: 900px) {
  .profile-body {
    flex-direction: column;
  }
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
  .journey-card {
    flex-direction: column;
  }
  .journey-card__image {
    width: 100%;
    height: 180px;
  }
}

@media (max-width: 600px) {
  .journey-card__details {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  .control-panel {
    padding: 16px;
  }
  .status-pills {
    overflow-x: auto;
    padding-bottom: 8px;
  }
}
</style>
