<template>
  <div class="about-page">
    <div class="about-shell">
      <header class="about-header">
        <h1>{{ t("aboutPage.title") }}</h1>
        <p>{{ t("aboutPage.intro") }}</p>
      </header>

      <section class="about-hero-card">
        <div class="hero-content">
          <h2>{{ t("aboutPage.heroTitle") }}</h2>
          <p>{{ t("aboutPage.heroBody") }}</p>
          <div class="hero-badges">
            <span v-for="badge in heroBadges" :key="badge.label">
              <strong>{{ badge.value }}</strong>
              {{ badge.label }}
            </span>
          </div>
        </div>
        <div class="hero-panel" aria-hidden="true">
          <span class="material-symbols-outlined">travel_explore</span>
        </div>
      </section>

      <section class="about-grid">
        <article class="about-card">
          <div class="about-card-head">
            <span class="material-symbols-outlined">flag</span>
            <h3>{{ t("aboutPage.missionTitle") }}</h3>
          </div>
          <p>{{ t("aboutPage.missionBody") }}</p>
        </article>

        <article class="about-card">
          <div class="about-card-head">
            <span class="material-symbols-outlined">verified_user</span>
            <h3>{{ t("aboutPage.promiseTitle") }}</h3>
          </div>
          <ul>
            <li v-for="item in promiseItems" :key="item">{{ item }}</li>
          </ul>
        </article>
      </section>

      <section class="values-card">
        <h2>{{ t("aboutPage.valuesTitle") }}</h2>
        <div class="values-grid">
          <article v-for="value in valueCards" :key="value.title">
            <span class="material-symbols-outlined">{{ value.icon }}</span>
            <h3>{{ value.title }}</h3>
            <p>{{ value.body }}</p>
          </article>
        </div>
      </section>

      <section class="about-cta">
        <p>{{ t("aboutPage.ctaTitle") }}</p>
        <div class="about-cta-links">
          <NuxtLink to="/contact">{{ t("aboutPage.contactSupport") }}</NuxtLink>
          <NuxtLink to="/hotels">{{ t("aboutPage.browseHotels") }}</NuxtLink>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const { t } = useAppI18n()

const heroBadges = computed(() => [
  {
    value: t('aboutPage.badgeSupportValue'),
    label: t('aboutPage.badgeSupportLabel'),
  },
  {
    value: t('aboutPage.badgeSecureValue'),
    label: t('aboutPage.badgeSecureLabel'),
  },
  {
    value: t('aboutPage.badgeTransparentValue'),
    label: t('aboutPage.badgeTransparentLabel'),
  },
])

const promiseItems = computed(() => [
  t('aboutPage.promiseItem1'),
  t('aboutPage.promiseItem2'),
  t('aboutPage.promiseItem3'),
])

const valueCards = computed(() => [
  {
    icon: 'stars',
    title: t('aboutPage.excellenceTitle'),
    body: t('aboutPage.excellenceBody'),
  },
  {
    icon: 'handshake',
    title: t('aboutPage.trustTitle'),
    body: t('aboutPage.trustBody'),
  },
  {
    icon: 'public',
    title: t('aboutPage.globalTitle'),
    body: t('aboutPage.globalBody'),
  },
])

useHead(() => ({
  title: t('aboutPage.metaTitle'),
  meta: [
    {
      name: 'description',
      content: t('aboutPage.metaDescription'),
    },
  ],
}))
</script>

<style scoped>
.about-page {
  min-height: calc(100vh - 140px);
  background:
    radial-gradient(
      circle at top,
      color-mix(in srgb, var(--color-primary-50) 68%, transparent) 0%,
      transparent 52%
    ),
    linear-gradient(180deg, var(--color-bg-soft) 0%, var(--color-surface) 100%);
}

.about-shell {
  width: min(1120px, calc(100% - 2rem));
  margin: 0 auto;
  padding: 40px 0 56px;
}

.about-header h1,
.hero-content h2,
.about-card h3,
.values-card h2,
.values-grid h3,
.about-cta p {
  color: var(--color-text-primary);
}

.about-header h1 {
  margin: 0;
  font-size: clamp(2rem, 3vw, 2.5rem);
  font-weight: 800;
  letter-spacing: -0.02em;
}

.about-header p,
.hero-content p,
.about-card p,
.about-card li,
.values-grid p {
  color: var(--color-text-secondary);
  line-height: 1.7;
}

.about-header p {
  max-width: 860px;
  margin: 8px 0 0;
  font-weight: 600;
}

.about-hero-card,
.about-card,
.values-card {
  border: 1px solid var(--color-border-soft);
  background: var(--color-surface);
}

.about-hero-card {
  display: grid;
  grid-template-columns: 1.45fr 0.55fr;
  gap: 16px;
  margin-top: 18px;
  padding: 22px;
  border-radius: 20px;
  box-shadow: var(--shadow-md);
}

.hero-content h2 {
  margin: 0;
  font-size: 1.35rem;
  font-weight: 800;
}

.hero-content p {
  margin: 10px 0 0;
}

.hero-badges {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin-top: 14px;
}

.hero-badges span {
  padding: 10px;
  border: 1px solid color-mix(in srgb, var(--color-primary-300) 30%, transparent);
  border-radius: 12px;
  background: color-mix(in srgb, var(--color-primary-50) 45%, var(--color-surface));
  color: var(--color-text-secondary);
  font-size: 0.84rem;
  font-weight: 600;
  line-height: 1.4;
}

.hero-badges strong {
  display: block;
  color: var(--color-primary-600);
  font-size: 0.92rem;
  font-weight: 800;
}

.hero-panel {
  display: grid;
  place-items: center;
  min-height: 170px;
  border-radius: 14px;
  background:
    linear-gradient(
      145deg,
      color-mix(in srgb, var(--color-primary-500) 88%, white 12%),
      color-mix(in srgb, var(--color-navy-500) 70%, white 30%)
    );
}

.hero-panel .material-symbols-outlined {
  color: var(--color-white);
  font-size: clamp(2.4rem, 5vw, 3.4rem);
}

.about-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 14px;
}

.about-card {
  padding: 18px;
  border-radius: 16px;
}

.about-card-head {
  display: flex;
  align-items: center;
  gap: 10px;
}

.about-card-head .material-symbols-outlined,
.values-grid .material-symbols-outlined {
  color: var(--color-primary-600);
}

.about-card h3 {
  margin: 0;
  font-size: 1.08rem;
  font-weight: 800;
}

.about-card p,
.about-card ul {
  margin: 10px 0 0;
}

.about-card ul {
  padding-inline-start: 18px;
}

.values-card {
  margin-top: 14px;
  padding: 22px;
  border-radius: 20px;
  box-shadow: var(--shadow-sm);
}

.values-card h2 {
  margin: 0;
  font-size: 1.22rem;
  font-weight: 800;
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-top: 14px;
}

.values-grid article {
  padding: 14px;
  border: 1px solid color-mix(in srgb, var(--color-primary-300) 26%, transparent);
  border-radius: 14px;
  background: color-mix(in srgb, var(--color-primary-50) 40%, var(--color-surface));
}

.values-grid .material-symbols-outlined {
  font-size: 1.4rem;
}

.values-grid h3 {
  margin: 8px 0 0;
  font-size: 1rem;
  font-weight: 800;
}

.values-grid p {
  margin: 6px 0 0;
  font-size: 0.92rem;
}

.about-cta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 14px;
  padding: 16px;
  border: 1px solid color-mix(in srgb, var(--color-secondary-300) 28%, transparent);
  border-radius: 14px;
  background: color-mix(in srgb, var(--color-secondary-50) 54%, var(--color-surface));
}

.about-cta p {
  margin: 0;
  font-weight: 700;
}

.about-cta-links {
  display: flex;
  align-items: center;
  gap: 10px;
}

.about-cta-links a {
  padding: 9px 14px;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 700;
}

.about-cta-links a:first-child {
  background: linear-gradient(135deg, var(--color-primary-600), var(--color-primary-500));
  color: var(--color-white);
}

.about-cta-links a:last-child {
  border: 1px solid color-mix(in srgb, var(--color-primary-300) 28%, transparent);
  background: var(--color-surface);
  color: var(--color-primary-600);
}

@media (max-width: 980px) {
  .about-hero-card,
  .about-grid,
  .values-grid {
    grid-template-columns: 1fr;
  }

  .hero-badges {
    grid-template-columns: 1fr;
  }

  .hero-panel {
    min-height: 140px;
  }
}

@media (max-width: 768px) {
  .about-shell {
    width: min(100% - 1.5rem, 1120px);
    padding: 28px 0 40px;
  }

  .about-hero-card,
  .values-card {
    border-radius: 16px;
  }

  .about-cta,
  .about-cta-links {
    flex-direction: column;
    align-items: stretch;
  }

  .about-cta-links a {
    text-align: center;
  }
}
</style>
