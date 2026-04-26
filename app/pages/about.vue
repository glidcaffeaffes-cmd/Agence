<template>
  <div class="about-page">
    <Head>
      <title>About Us - VoyageHub</title>
      <meta
        name="description"
        content="Learn more about VoyageHub and our mission to deliver reliable hotel booking experiences."
      />
    </Head>

    <div class="about-shell">
      <header class="about-header">
        <h1>About VoyageHub</h1>
        <p>
          We help travelers book trusted stays with transparent details,
          reliable support, and a smooth experience from search to check-out.
        </p>
      </header>

      <section class="about-hero-card">
        <div class="hero-content">
          <h2>Built for Modern Hotel Booking</h2>
          <p>
            VoyageHub connects guests and properties through a platform focused
            on clarity, speed, and confidence. We prioritize accurate listings,
            fair policies, and support that follows through.
          </p>
          <div class="hero-badges">
            <span>
              <strong>24/7</strong>
              Support Coverage
            </span>
            <span>
              <strong>Secure</strong>
              Booking Experience
            </span>
            <span>
              <strong>Transparent</strong>
              Policies & Pricing
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
            <h3>Our Mission</h3>
          </div>
          <p>
            Make hotel booking simple and dependable for every traveler by
            combining trusted inventory, clear reservation terms, and responsive
            customer care.
          </p>
        </article>

        <article class="about-card">
          <div class="about-card-head">
            <span class="material-symbols-outlined">verified_user</span>
            <h3>What We Promise</h3>
          </div>
          <ul>
            <li>Clear booking details before payment confirmation.</li>
            <li>Practical cancellation guidance per property policy.</li>
            <li>Fast support routing for booking-related issues.</li>
          </ul>
        </article>
      </section>

      <section class="values-card">
        <h2>Core Values</h2>
        <div class="values-grid">
          <article>
            <span class="material-symbols-outlined">stars</span>
            <h3>Excellence</h3>
            <p>
              We continuously improve booking quality, performance, and service.
            </p>
          </article>
          <article>
            <span class="material-symbols-outlined">handshake</span>
            <h3>Trust</h3>
            <p>
              We prioritize transparent communication and reliable commitments.
            </p>
          </article>
          <article>
            <span class="material-symbols-outlined">public</span>
            <h3>Global Reach</h3>
            <p>
              We support travel across destinations with consistent standards.
            </p>
          </article>
        </div>
      </section>

      <section class="about-cta">
        <p>Need help with a reservation or platform policy?</p>
        <div class="about-cta-links">
          <NuxtLink to="/contact">Contact Support</NuxtLink>
          <NuxtLink to="/hotels">Browse Hotels</NuxtLink>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.about-page {
  background:
    radial-gradient(circle at top, color-mix(in srgb, var(--color-primary-50) 68%, white 32%) 0%, transparent 52%),
    linear-gradient(180deg, var(--color-gray-50) 0%, white 100%);
  min-height: calc(100vh - 140px);
}

.about-shell {
  max-width: 1120px;
  margin: 0 auto;
  padding: 40px 24px 56px;
}

.about-header h1 {
  margin: 0;
  color: var(--color-navy-500);
  font-size: clamp(2rem, 3vw, 2.5rem);
  font-weight: 800;
  letter-spacing: -0.02em;
}

.about-header p {
  margin: 8px 0 0;
  color: var(--color-gray-500);
  font-weight: 600;
  max-width: 860px;
  line-height: 1.7;
}

.about-hero-card {
  margin-top: 18px;
  background: white;
  border: 1px solid color-mix(in srgb, var(--color-gray-200) 74%, white 26%);
  border-radius: 20px;
  box-shadow: 0 16px 30px rgba(15, 23, 42, 0.06);
  padding: 22px;
  display: grid;
  grid-template-columns: 1.45fr 0.55fr;
  gap: 16px;
}

.hero-content h2 {
  margin: 0;
  color: var(--color-navy-500);
  font-size: 1.35rem;
  font-weight: 800;
}

.hero-content p {
  margin: 10px 0 0;
  color: var(--color-gray-600);
  line-height: 1.7;
}

.hero-badges {
  margin-top: 14px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.hero-badges span {
  background: color-mix(in srgb, var(--color-primary-25) 70%, white 30%);
  border: 1px solid color-mix(in srgb, var(--color-primary-200) 60%, white 40%);
  border-radius: 12px;
  padding: 10px;
  color: var(--color-gray-600);
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
  border-radius: 14px;
  background:
    linear-gradient(145deg, color-mix(in srgb, var(--color-primary-500) 88%, white 12%), color-mix(in srgb, var(--color-navy-500) 70%, white 30%));
  display: grid;
  place-items: center;
  min-height: 170px;
}

.hero-panel .material-symbols-outlined {
  color: white;
  font-size: clamp(2.4rem, 5vw, 3.4rem);
}

.about-grid {
  margin-top: 14px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.about-card {
  background: white;
  border: 1px solid color-mix(in srgb, var(--color-gray-200) 72%, white 28%);
  border-radius: 16px;
  padding: 18px;
}

.about-card-head {
  display: flex;
  align-items: center;
  gap: 10px;
}

.about-card-head .material-symbols-outlined {
  color: var(--color-primary-600);
  font-size: 1.45rem;
}

.about-card h3 {
  margin: 0;
  color: var(--color-navy-500);
  font-size: 1.08rem;
  font-weight: 800;
}

.about-card p {
  margin: 10px 0 0;
  color: var(--color-gray-600);
  line-height: 1.7;
}

.about-card ul {
  margin: 10px 0 0;
  padding-left: 18px;
  color: var(--color-gray-600);
  line-height: 1.7;
}

.values-card {
  margin-top: 14px;
  background: white;
  border: 1px solid color-mix(in srgb, var(--color-gray-200) 72%, white 28%);
  border-radius: 20px;
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.04);
  padding: 22px;
}

.values-card h2 {
  margin: 0;
  color: var(--color-navy-500);
  font-size: 1.22rem;
  font-weight: 800;
}

.values-grid {
  margin-top: 14px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.values-grid article {
  background: color-mix(in srgb, var(--color-primary-25) 64%, white 36%);
  border: 1px solid color-mix(in srgb, var(--color-primary-200) 52%, white 48%);
  border-radius: 14px;
  padding: 14px;
}

.values-grid .material-symbols-outlined {
  color: var(--color-primary-600);
  font-size: 1.4rem;
}

.values-grid h3 {
  margin: 8px 0 0;
  color: var(--color-navy-500);
  font-size: 1rem;
  font-weight: 800;
}

.values-grid p {
  margin: 6px 0 0;
  color: var(--color-gray-600);
  font-size: 0.92rem;
  line-height: 1.6;
}

.about-cta {
  margin-top: 14px;
  background: color-mix(in srgb, var(--color-secondary-50) 66%, white 34%);
  border: 1px solid color-mix(in srgb, var(--color-secondary-200) 65%, white 35%);
  border-radius: 14px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.about-cta p {
  margin: 0;
  color: var(--color-navy-500);
  font-weight: 700;
}

.about-cta-links {
  display: flex;
  align-items: center;
  gap: 10px;
}

.about-cta-links a {
  text-decoration: none;
  border-radius: 10px;
  padding: 9px 14px;
  font-size: 0.9rem;
  font-weight: 700;
}

.about-cta-links a:first-child {
  color: white;
  background: linear-gradient(135deg, var(--color-primary-600), var(--color-primary-500));
}

.about-cta-links a:last-child {
  color: var(--color-primary-600);
  background: white;
  border: 1px solid color-mix(in srgb, var(--color-primary-200) 68%, white 32%);
}

@media (max-width: 980px) {
  .about-hero-card {
    grid-template-columns: 1fr;
  }

  .hero-badges {
    grid-template-columns: 1fr;
  }

  .hero-panel {
    min-height: 140px;
  }

  .about-grid {
    grid-template-columns: 1fr;
  }

  .values-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .about-shell {
    padding: 28px 16px 40px;
  }

  .about-hero-card,
  .values-card {
    border-radius: 16px;
  }

  .about-cta {
    flex-direction: column;
    align-items: stretch;
  }

  .about-cta-links {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
  }

  .about-cta-links a {
    text-align: center;
  }
}
</style>
