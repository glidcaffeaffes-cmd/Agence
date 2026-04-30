<template>
  <section class="calendar-shell">
    <div class="calendar-nav">
      <button @click="$emit('prev-month')" class="nav-btn">
        <span class="material-symbols-outlined">chevron_left</span>
      </button>
      <strong>{{ monthLabel }}</strong>
      <button @click="$emit('next-month')" class="nav-btn">
        <span class="material-symbols-outlined">chevron_right</span>
      </button>
    </div>
    <div class="calendar-weekdays">
      <span v-for="weekday in weekdays" :key="weekday">{{ weekday }}</span>
    </div>

    <div class="calendar-scroll">
      <div class="calendar-grid">
        <article
          v-for="cell in cells"
          :key="cell.key"
          class="calendar-cell"
          :class="{ 'calendar-cell--muted': !cell.inMonth, 'calendar-cell--today': cell.key === todayKey }"
        >
          <div class="calendar-cell__header">
            <span class="calendar-cell__day">{{ cell.dayNumber }}</span>
            <span v-if="cell.entries.length" class="calendar-cell__count">{{ cell.entries.length }}</span>
            <span v-if="admin && cell.totalRevenue > 0" class="calendar-cell__revenue">
              {{ formatCurrency(cell.totalRevenue) }}
            </span>
          </div>

          <div v-if="cell.entries.length" class="calendar-events">
            <div
              v-for="entry in cell.entries.slice(0, 3)"
              :key="`${cell.key}-${entry.id}`"
              class="calendar-event"
              :class="statusClass(entry.status)"
              @click="$emit('event-click', entry)"
              style="cursor: pointer;"
              :title="`${entry.title} - ${entry.subtitle}${entry.amountLabel ? ' (' + entry.amountLabel + ')' : ''}`"
            >
              <strong>{{ entry.title }}</strong>
              <span>{{ entry.subtitle }}</span>
              <small v-if="entry.amountLabel">{{ entry.amountLabel }}</small>
            </div>
            <div v-if="cell.entries.length > 3" class="calendar-more">
              {{ t('calendar.more', { count: cell.entries.length - 3 }) }}
            </div>
          </div>

          <div v-else class="calendar-empty">
            {{ emptyLabel || t('calendar.emptyDefault') }}
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type CalendarEntry = {
  id: number
  title: string
  subtitle?: string
  start: string
  end: string
  status: string
  amountLabel?: string
}

const props = withDefaults(
  defineProps<{
    month: string
    entries: CalendarEntry[]
    emptyLabel?: string
    admin?: boolean
  }>(),
  {
    emptyLabel: '',
    admin: false,
  },
)

const emit = defineEmits<{
  eventClick: [entry: CalendarEntry]
  prevMonth: []
  nextMonth: []
}>()
const { t, formatDate, formatCurrency } = useAppI18n()

const weekdays = computed(() => {
  const sunday = new Date(Date.UTC(2026, 0, 4))
  return Array.from({ length: 7 }, (_, index) =>
    formatDate(addUtcDays(sunday, index), { weekday: 'short' }),
  )
})

function monthStart(key: string) {
  const [year, month] = key.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, 1))
}

function dateKey(date: Date) {
  return date.toISOString().slice(0, 10)
}

function isoKey(value: string) {
  return value.slice(0, 10)
}

function addUtcDays(date: Date, days: number) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + days))
}

const todayKey = computed(() => dateKey(new Date()))

const monthLabel = computed(() => {
  const [year, month] = props.month.split('-').map(Number)
  return formatDate(new Date(Date.UTC(year, month - 1, 1)), {
    month: 'long',
    year: 'numeric',
  })
})

const cells = computed(() => {
  const start = monthStart(props.month)
  const gridStart = addUtcDays(start, -start.getUTCDay())
  const monthValue = start.getUTCMonth()
  const entryMap = new Map<string, CalendarEntry[]>()
  const revenueMap = new Map<string, number>()

  for (const entry of props.entries) {
    const startKey = isoKey(entry.start)
    const endKey = isoKey(entry.end)
    let cursor = new Date(`${startKey}T00:00:00.000Z`)
    const exclusiveEnd = new Date(`${endKey}T00:00:00.000Z`)

    while (cursor < exclusiveEnd) {
      const key = dateKey(cursor)
      const dayEntries = entryMap.get(key) ?? []
      dayEntries.push(entry)
      entryMap.set(key, dayEntries)

      if (props.admin && entry.amountLabel) {
        const amount = parseFloat(entry.amountLabel.replace(/[^\d.-]/g, '')) || 0
        revenueMap.set(key, (revenueMap.get(key) || 0) + amount)
      }

      cursor = addUtcDays(cursor, 1)
    }
  }

  return Array.from({ length: 42 }, (_, index) => {
    const current = addUtcDays(gridStart, index)
    const key = dateKey(current)

    return {
      key,
      inMonth: current.getUTCMonth() === monthValue,
      dayNumber: current.getUTCDate(),
      entries: (entryMap.get(key) ?? []).sort((left, right) => left.start.localeCompare(right.start)),
      totalRevenue: revenueMap.get(key) || 0,
    }
  })
})

function statusClass(status: string) {
  const upperStatus = status.toUpperCase()
  switch (upperStatus) {
    case 'CONFIRMED':
      return 'calendar-event--confirmed'
    case 'COMPLETED':
      return 'calendar-event--completed'
    case 'PENDING':
      return 'calendar-event--pending'
    case 'CANCELLED':
      return 'calendar-event--cancelled'
    default:
      return 'calendar-event--blocked'
  }
}

</script>

<style scoped>
.calendar-shell {
  display: grid;
  gap: 12px;
}

.calendar-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border-soft);
  border-radius: 999px;
  padding: 0.3rem 0.45rem;
  box-shadow: var(--shadow-sm);
}

.nav-btn {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  border: 1px solid transparent;
  background: transparent;
  color: var(--color-text-muted);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.nav-btn:hover {
  background: var(--color-bg-soft);
}

.calendar-nav strong {
  min-width: 144px;
  text-align: center;
  color: var(--color-text-primary);
  font-size: 0.88rem;
}

.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 10px;
  color: var(--color-text-secondary);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.calendar-weekdays span {
  padding: 0 4px;
}

.calendar-scroll {
  overflow-x: auto;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 10px;
}

.calendar-cell {
  min-height: 162px;
  border: 1px solid var(--color-border-soft);
  background: var(--color-surface);
  border-radius: 16px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: var(--shadow-sm);
}

.calendar-cell--muted {
  background: var(--color-surface-secondary);
}

.calendar-cell--today {
  border-color: color-mix(in srgb, var(--color-primary-300) 72%, white 28%);
  box-shadow: 0 16px 28px rgba(0, 103, 104, 0.08);
}

.calendar-cell__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.calendar-cell__day {
  font-size: 0.92rem;
  font-weight: 800;
  color: var(--color-text-primary);
}

.calendar-cell__count {
  min-width: 24px;
  height: 24px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: color-mix(in srgb, var(--color-primary-50) 80%, white 20%);
  color: var(--color-primary-700);
  font-size: 0.72rem;
  font-weight: 800;
}

.calendar-cell__revenue {
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--color-success-700);
  background: var(--color-success-50);
  padding: 2px 6px;
  border-radius: 4px;
  margin-top: 2px;
  display: block;
}

.calendar-events {
  display: grid;
  gap: 8px;
}

.calendar-event {
  border-radius: 12px;
  padding: 9px 10px;
  display: grid;
  gap: 3px;
}

.calendar-event strong {
  font-size: 0.78rem;
  line-height: 1.2;
  color: var(--color-text-primary);
}

.calendar-event span,
.calendar-event small {
  font-size: 0.7rem;
  line-height: 1.25;
  color: var(--color-text-secondary);
}

.calendar-event--confirmed {
  background: #ecfdf3;
}

.calendar-event--completed {
  background: #eff8ff;
}

.calendar-event--pending {
  background: #fffaeb;
}

.calendar-event--cancelled {
  background: #fef3f2;
}

.calendar-event--blocked {
  background: #fef3f2;
}

.calendar-more {
  font-size: 0.72rem;
  font-weight: 800;
  color: var(--color-primary-700);
}

.calendar-empty {
  margin-top: auto;
  color: var(--color-text-secondary);
  font-size: 0.76rem;
}

@media (max-width: 768px) {
  .calendar-nav {
    display: none;
  }
  .calendar-grid {
    min-width: auto;
    grid-template-columns: repeat(7, minmax(40px, 1fr));
  }
  .calendar-cell {
    min-height: 120px;
    padding: 8px;
  }
  .calendar-event strong {
    font-size: 0.7rem;
  }
  .calendar-event span,
  .calendar-event small {
    font-size: 0.65rem;
  }
}
</style>
