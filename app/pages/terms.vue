<template>
  <div class="info-page">
    <Head>
      <title>Terms of Service - VoyageHub</title>
      <meta
        name="description"
        content="VoyageHub terms of service for booking, payments, cancellations, and platform usage."
      />
    </Head>

    <div class="info-shell">
      <header class="info-header">
        <h1>Terms of Service</h1>
        <p>Last updated: April 26, 2026</p>
      </header>

      <section class="info-card">
        <h2>1. Platform Scope</h2>
        <p>
          VoyageHub provides hotel discovery and booking services. By using the
          platform, you agree to provide accurate booking details and comply
          with applicable property policies.
        </p>

        <h2>2. Booking Conditions</h2>
        <p>
          Reservation confirmation is subject to availability and successful
          payment authorization. Prices, taxes, and fees are shown before final
          confirmation.
        </p>

        <h2>3. Payment and Billing</h2>
        <p>
          You are responsible for valid payment information and timely payment
          settlement. Fraud prevention checks may be applied before final
          confirmation.
        </p>

        <h2>4. Cancellations and Changes</h2>
        <p>
          Cancellation and modification eligibility depend on the selected
          property's rules and the rate type chosen at checkout. Refund amounts
          follow the active booking policy.
        </p>

        <h2>5. Acceptable Use</h2>
        <p>
          You agree not to misuse the platform, attempt unauthorized access, or
          submit malicious content through booking or support forms.
        </p>

        <h2>6. Contact</h2>
        <p>
          For policy clarifications, please visit the
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
