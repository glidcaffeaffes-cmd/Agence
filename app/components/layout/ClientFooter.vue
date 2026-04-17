<template>
  <footer class="client-footer">
    <div class="footer-container">
      <div class="footer-grid">
        <!-- Brand -->
        <div class="footer-brand-col">
          <NuxtLink to="/" class="footer-brand">
            <span class="brand-icon">✈</span>
            <span class="brand-text">Voyage<span class="brand-accent">Hub</span></span>
          </NuxtLink>
          <p class="footer-tagline">Premium hotel booking. Discover exceptional stays across France and beyond.</p>
        </div>

        <!-- Quick Links -->
        <div class="footer-col">
          <h4 class="footer-heading">Explore</h4>
          <NuxtLink to="/hotels" class="footer-link">Hotels</NuxtLink>
          <NuxtLink to="/offers" class="footer-link">Special Offers</NuxtLink>
          <NuxtLink to="/reservations" class="footer-link">My Bookings</NuxtLink>
        </div>

        <!-- Support -->
        <div class="footer-col">
          <h4 class="footer-heading">Support</h4>
          <a href="#" class="footer-link">Help Center</a>
          <a href="#" class="footer-link">Cancellation Policy</a>
          <a href="#" class="footer-link">Contact Us</a>
        </div>

        <!-- Contact -->
        <div class="footer-col">
          <h4 class="footer-heading">Contact</h4>
          <p class="footer-contact"><i class="pi pi-envelope"></i> support@voyagehub.com</p>
          <p class="footer-contact"><i class="pi pi-phone"></i> +33 1 00 00 00 00</p>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; {{ new Date().getFullYear() }} VoyageHub. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.client-footer {
  background: var(--color-neutral-900);
  color: var(--color-neutral-300);
  margin-top: auto;
}
.footer-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: var(--spacing-12) var(--spacing-6) var(--spacing-6);
}
.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: var(--spacing-8);
  margin-bottom: var(--spacing-8);
}
.footer-brand {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  text-decoration: none;
  margin-bottom: var(--spacing-3);
}
.footer-brand .brand-icon { font-size: 1.5rem; }
.footer-brand .brand-text { font-size: var(--font-size-lg); font-weight: 700; color: white; font-family: var(--font-family-heading); }
.footer-brand .brand-accent { color: var(--color-primary-400); }
.footer-tagline { font-size: var(--font-size-sm); line-height: 1.6; max-width: 280px; }

.footer-heading {
  color: white;
  font-size: var(--font-size-sm);
  font-weight: 600;
  margin-bottom: var(--spacing-4);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.footer-col { display: flex; flex-direction: column; gap: var(--spacing-2); }
.footer-link {
  text-decoration: none;
  color: var(--color-neutral-400);
  font-size: var(--font-size-sm);
  transition: color var(--motion-duration-fast) var(--motion-ease-default);
}
.footer-link:hover { color: var(--color-primary-400); }
.footer-contact {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  font-size: var(--font-size-sm);
}

.footer-bottom {
  border-top: 1px solid var(--color-neutral-700);
  padding-top: var(--spacing-6);
  text-align: center;
  font-size: var(--font-size-xs);
}

@media (max-width: 768px) {
  .footer-grid { grid-template-columns: 1fr 1fr; gap: var(--spacing-6); }
}
@media (max-width: 480px) {
  .footer-grid { grid-template-columns: 1fr; }
}
</style>
