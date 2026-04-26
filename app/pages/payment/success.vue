<template>
  <div class="payment-result success">
    <section class="card">
      <h1>Payment successful</h1>
      <p>Your booking payment was completed. We have updated your reservation status.</p>
      <NuxtLink class="link" to="/my-bookings">Go to My Bookings</NuxtLink>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
</script>

<style scoped>
.payment-result {
  min-height: calc(100vh - 120px);
  display: grid;
  place-items: center;
  padding: 24px;
}

.card {
  width: min(520px, 100%);
  border-radius: 16px;
  border: 1px solid #bbf7d0;
  background: #f0fdf4;
  padding: 28px;
  text-align: center;
}

h1 {
  margin: 0 0 10px;
  color: #166534;
}

p {
  margin: 0 0 16px;
  color: #14532d;
}

.link {
  display: inline-block;
  text-decoration: none;
  background: #166534;
  color: #ffffff;
  padding: 10px 14px;
  border-radius: 10px;
  font-weight: 700;
}
</style>
