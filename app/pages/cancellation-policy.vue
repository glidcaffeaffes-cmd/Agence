<template>
  <div class="policy-page">
    <Head>
      <title>Cancellation Policy - VoyageHub</title>
      <meta
        name="description"
        content="Understand VoyageHub cancellation windows, refund rules, and timeline expectations."
      />
    </Head>

    <div class="policy-shell">
      <header class="policy-header">
        <h1>Cancellation Policy</h1>
        <p>Simple cancellation rules for transparent booking management.</p>
      </header>

      <section class="policy-grid">
        <article class="policy-card">
          <h2>Free Cancellation Window</h2>
          <p>
            Eligible rates can be cancelled without fees before the deadline
            shown in your booking details.
          </p>
        </article>

        <article class="policy-card">
          <h2>Partial Refund Scenarios</h2>
          <p>
            Some rates may include partial refund conditions after the free
            cancellation window closes.
          </p>
        </article>

        <article class="policy-card">
          <h2>Non-Refundable Rates</h2>
          <p>
            Promotional or special rates may be non-refundable. This is clearly
            indicated before booking confirmation.
          </p>
        </article>
      </section>

      <section class="policy-content">
        <h2>How Refunds Are Processed</h2>
        <p>
          Approved refunds are returned to the original payment method after
          cancellation confirmation. Processing timelines vary by payment
          provider and bank.
        </p>

        <h2>Where to Cancel a Booking</h2>
        <p>
          Manage cancellation directly from
          <NuxtLink to="/my-bookings">My Bookings</NuxtLink> or your booking
          history dashboard.
        </p>

        <h2>Need Help?</h2>
        <p>
          If your case requires manual review, open a request from the
          <NuxtLink to="/contact">Contact</NuxtLink> page and include your
          booking reference.
        </p>
      </section>
    </div>
  </div>
</template>

<style scoped>
.policy-page {
  background:
    radial-gradient(circle at top, color-mix(in srgb, var(--color-primary-50) 70%, white 30%) 0%, transparent 50%),
    linear-gradient(180deg, var(--color-gray-50) 0%, white 100%);
  min-height: calc(100vh - 140px);
}

.policy-shell {
  max-width: 1120px;
  margin: 0 auto;
  padding: 40px 24px 56px;
}

.policy-header h1 {
  margin: 0;
  color: var(--color-navy-500);
  font-size: clamp(2rem, 3vw, 2.5rem);
  font-weight: 800;
  letter-spacing: -0.02em;
}

.policy-header p {
  margin: 8px 0 0;
  color: var(--color-gray-500);
  font-weight: 600;
}

.policy-grid {
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.policy-card {
  background: white;
  border: 1px solid color-mix(in srgb, var(--color-gray-200) 72%, white 28%);
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 14px 28px rgba(15, 23, 42, 0.06);
}

.policy-card h2 {
  margin: 0 0 8px;
  color: var(--color-navy-500);
  font-size: 1rem;
  font-weight: 800;
}

.policy-card p {
  margin: 0;
  color: var(--color-gray-600);
  line-height: 1.6;
  font-size: 0.93rem;
}

.policy-content {
  margin-top: 18px;
  background: white;
  border: 1px solid color-mix(in srgb, var(--color-gray-200) 74%, white 26%);
  border-radius: 20px;
  padding: 26px;
  box-shadow: 0 16px 30px rgba(15, 23, 42, 0.06);
}

.policy-content h2 {
  margin: 0 0 8px;
  color: var(--color-navy-500);
  font-size: 1.05rem;
  font-weight: 800;
}

.policy-content p {
  margin: 0 0 16px;
  color: var(--color-gray-600);
  line-height: 1.7;
  font-size: 0.96rem;
}

.policy-content :deep(a) {
  color: var(--color-primary-600);
  text-decoration: none;
  font-weight: 700;
}

.policy-content :deep(a:hover) {
  text-decoration: underline;
}

@media (max-width: 900px) {
  .policy-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .policy-shell {
    padding: 28px 16px 40px;
  }

  .policy-content {
    border-radius: 16px;
    padding: 20px;
  }
}
</style>
