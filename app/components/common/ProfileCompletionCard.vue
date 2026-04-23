<template>
  <div class="completion-card">
    <div class="completion-card__inner">
      <!-- ── Left Side: Radial Progress ── -->
      <div class="completion-card__left">
        <div class="radial-wrap">
          <svg class="radial-svg" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
            <circle class="radial-track" cx="60" cy="60" r="54" fill="none" stroke-width="10" />
            <circle class="radial-progress" cx="60" cy="60" r="54" fill="none" stroke-width="10" stroke-linecap="round" :stroke-dasharray="circumference" :stroke-dashoffset="animatedOffset" transform="rotate(-90 60 60)" />
          </svg>
          <div class="radial-center">
            <span class="radial-pct">{{ percentage }}%</span>
            <span class="radial-label">complete</span>
          </div>
        </div>
      </div>

      <!-- ── Right Side: Content ── -->
      <div class="completion-card__right">
        <!-- Header -->
        <div class="completion-header">
          <h3 class="completion-title">Profile Completion</h3>
          <p class="completion-subtitle">{{ motivationalMessage }}</p>
        </div>

        <!-- Stats -->
        <div class="stats-row">
          <div class="stat-chip stat-chip--done">
            <span class="material-symbols-outlined">check_circle</span>
            {{ completedCount }} done
          </div>
          <div class="stat-chip stat-chip--todo">
            <span class="material-symbols-outlined">radio_button_unchecked</span>
            {{ totalCount - completedCount }} left
          </div>
        </div>

        <!-- Missing Tasks -->
        <div class="missing-tasks" v-if="missingFields.length > 0">
          <h4 class="missing-tasks__title">Next steps:</h4>
          <ul class="missing-tasks__list">
            <li v-for="field in missingFields.slice(0, 3)" :key="field.key" class="missing-tasks__item">
              <span class="material-symbols-outlined missing-tasks__icon">{{ field.icon }}</span>
              <span class="missing-tasks__label">Add {{ field.label }}</span>
            </li>
            <li v-if="missingFields.length > 3" class="missing-tasks__item missing-tasks__item--more">
              + {{ missingFields.length - 3 }} more details
            </li>
          </ul>
        </div>

        <!-- Action -->
        <div class="completion-action">
          <button class="btn-complete" @click="scrollToForm" v-if="percentage < 100">
            Complete Profile
            <span class="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import { useProfileCompletion } from '~/composables/useProfileCompletion'
import { useAuth } from '~/composables/useAuth'

const { currentProfile } = useAuth()

const {
  completedCount,
  totalCount,
  percentage,
  missingFields,
  motivationalMessage,
  dashOffset,
  circumference,
} = useProfileCompletion(currentProfile)

const animatedOffset = ref(circumference)

onMounted(() => {
  setTimeout(() => {
    animatedOffset.value = dashOffset.value
  }, 200)
})

watch(dashOffset, (val) => {
  animatedOffset.value = val
})

function scrollToForm() {
  document.getElementById('profile-save-btn')?.scrollIntoView({ behavior: 'smooth', block: 'end' })
}
</script>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

/* ── Card Shell ── */
.completion-card {
  background: var(--color-card);
  border: 1px solid var(--color-border-soft);
  border-radius: var(--radius-2xl);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); /* subtle shadow */
  overflow: hidden;
  transition: box-shadow 0.3s ease;
}
.completion-card:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
}

.completion-card__inner {
  display: flex;
  flex-direction: column;
  padding: 32px;
  gap: 32px;
}
@media (min-width: 768px) {
  .completion-card__inner {
    flex-direction: row;
    align-items: center;
    padding: 40px;
    gap: 48px;
  }
}

/* ── Left Side: Radial ── */
.completion-card__left {
  flex-shrink: 0;
  display: flex;
  justify-content: center;
}
.radial-wrap {
  position: relative;
  width: 160px;
  height: 160px;
}
.radial-svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}
.radial-track {
  stroke: var(--color-bg-soft);
}
.radial-progress {
  stroke: var(--color-primary-500);
  stroke-dasharray: 339.29; /* 2*PI*54 */
  transition: stroke-dashoffset 1.2s cubic-bezier(0.34, 1.56, 0.64, 1); /* bouncy easing */
}
.radial-center {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
}
.radial-pct {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-heading);
  line-height: 1;
  letter-spacing: -0.04em;
}
.radial-label {
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--color-text-muted);
}

/* ── Right Side: Content ── */
.completion-card__right {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Header */
.completion-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.completion-title {
  font-size: var(--font-size-title-lg);
  font-weight: 700;
  color: var(--color-heading);
}
.completion-subtitle {
  font-size: var(--font-size-body-md);
  color: var(--color-text-muted);
  line-height: var(--line-height-relaxed);
}

/* Stats */
.stats-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.stat-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: var(--radius-pill);
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.stat-chip .material-symbols-outlined { font-size: 16px; }
.stat-chip--done {
  background: var(--color-primary-50);
  color: var(--color-primary-700);
  border: 1px solid var(--color-primary-100);
}
.stat-chip--todo {
  background: var(--color-bg-soft);
  color: var(--color-text-muted);
  border: 1px solid var(--color-border);
}

/* Missing Tasks */
.missing-tasks {
  background: var(--color-bg-soft);
  border-radius: var(--radius-xl);
  padding: 16px 20px;
  border: 1px dashed var(--color-border);
}
.missing-tasks__title {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-muted);
  margin-bottom: 12px;
}
.missing-tasks__list {
  display: grid;
  gap: 10px;
  list-style: none;
  padding: 0;
  margin: 0;
}
@media (min-width: 640px) {
  .missing-tasks__list {
    grid-template-columns: repeat(2, 1fr);
  }
}
.missing-tasks__item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--color-text);
  font-weight: 500;
}
.missing-tasks__icon {
  font-size: 16px;
  color: var(--color-primary-500);
}
.missing-tasks__item--more {
  color: var(--color-text-muted);
  font-style: italic;
  font-weight: 400;
}

/* Action */
.completion-action {
  margin-top: 8px;
}
.btn-complete {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: var(--color-primary-600);
  color: #fff;
  border-radius: var(--radius-xl);
  font-size: 14px;
  font-weight: 700;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 103, 104, 0.2);
}
.btn-complete:hover {
  background: var(--color-primary-700);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 103, 104, 0.3);
}
.btn-complete .material-symbols-outlined {
  font-size: 18px;
  transition: transform 0.2s ease;
}
.btn-complete:hover .material-symbols-outlined {
  transform: translateX(4px);
}
</style>
