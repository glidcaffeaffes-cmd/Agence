<template>
  <div class="info-page">
    <Head>
      <title>Privacy Policy - VoyageHub</title>
      <meta
        name="description"
        content="VoyageHub privacy policy describing data collection, processing, and customer rights."
      />
    </Head>

    <div class="info-shell">
      <header class="info-header">
        <h1>Privacy Policy</h1>
        <p>Last updated: April 26, 2026</p>
      </header>

      <section class="info-card">
        <h2>1. Information We Collect</h2>
        <p>
          We collect account, booking, and support information required to
          process reservations and provide customer service.
        </p>

        <h2>2. How We Use Data</h2>
        <p>
          Data is used to confirm reservations, prevent fraud, communicate
          booking updates, and improve service quality.
        </p>

        <h2>3. Data Sharing</h2>
        <p>
          Booking-related details are shared only with relevant hotels and
          approved payment or operational providers when necessary for service
          delivery.
        </p>

        <h2>4. Data Retention</h2>
        <p>
          Reservation and support records are retained according to legal and
          operational requirements, then removed or anonymized when no longer
          needed.
        </p>

        <h2>5. Your Rights</h2>
        <p>
          You may request access, correction, or deletion of personal data
          where legally applicable through our support channels.
        </p>

        <h2>6. Contact for Privacy Requests</h2>
        <p>
          To submit a privacy request, use the
          <NuxtLink to="/contact">Contact</NuxtLink> page.
        </p>
      </section>
    </div>
  </div>
</template>

<style scoped>
.info-page {
  background:
    radial-gradient(circle at top, color-mix(in srgb, var(--color-primary-50) 68%, white 32%) 0%, transparent 52%),
    linear-gradient(180deg, var(--color-gray-50) 0%, white 100%);
  min-height: calc(100vh - 140px);
}

.info-shell {
  max-width: 1024px;
  margin: 0 auto;
  padding: 40px 24px 56px;
}

.info-header h1 {
  margin: 0;
  color: var(--color-navy-500);
  font-size: clamp(1.9rem, 3vw, 2.45rem);
  font-weight: 800;
  letter-spacing: -0.02em;
}

.info-header p {
  margin: 8px 0 0;
  color: var(--color-gray-500);
  font-size: 0.95rem;
  font-weight: 600;
}

.info-card {
  margin-top: 20px;
  background: white;
  border: 1px solid color-mix(in srgb, var(--color-gray-200) 74%, white 26%);
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 16px 30px rgba(15, 23, 42, 0.06);
}

.info-card h2 {
  margin: 0 0 8px;
  color: var(--color-navy-500);
  font-size: 1.05rem;
  font-weight: 800;
}

.info-card h2 + p {
  margin-top: 0;
}

.info-card p {
  margin: 0 0 16px;
  color: var(--color-gray-600);
  line-height: 1.7;
  font-size: 0.96rem;
}

.info-card :deep(a) {
  color: var(--color-primary-600);
  font-weight: 700;
  text-decoration: none;
}

.info-card :deep(a:hover) {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .info-shell {
    padding: 28px 16px 40px;
  }

  .info-card {
    border-radius: 16px;
    padding: 20px;
  }
}
</style>
