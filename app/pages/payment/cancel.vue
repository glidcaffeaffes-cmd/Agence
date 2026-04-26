<template>
  <div class="payment-result cancel">
    <section class="card">
      <h1>Payment cancelled</h1>
      <p>Your payment was not completed. You can try again whenever you are ready.</p>
      <NuxtLink class="link" to="/reservations/book">Back to Booking</NuxtLink>
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
  border: 1px solid #fed7aa;
  background: #fff7ed;
  padding: 28px;
  text-align: center;
}

h1 {
  margin: 0 0 10px;
  color: #9a3412;
}

p {
  margin: 0 0 16px;
  color: #7c2d12;
}

.link {
  display: inline-block;
  text-decoration: none;
  background: #9a3412;
  color: #ffffff;
  padding: 10px 14px;
  border-radius: 10px;
  font-weight: 700;
}
</style>
