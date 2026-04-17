<template>
  <div class="client-layout">
    <ClientNavbar />
    <main class="client-main">
      <slot />
    </main>
    <ClientFooter />
  </div>
</template>

<style scoped>
.client-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.client-main {
  flex: 1;
}
</style>
