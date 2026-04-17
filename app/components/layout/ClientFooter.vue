<template>
  <footer class="client-footer">
    <div class="footer-container">
      <div class="footer-grid">
        <!-- Brand & Manifesto -->
        <div class="footer-brand-col">
          <NuxtLink to="/" class="footer-brand">
            <span class="brand-text">Voyage<span class="brand-accent">Hub</span></span>
          </NuxtLink>
          <p class="footer-manifesto">
            We curate extraordinary stays for the discerning traveler. Our mission is to bridge the gap between architectural authority and personalized hospitality across France's most iconic destinations.
          </p>
          <div class="footer-social">
            <a href="#" class="social-link" title="Instagram"><i class="pi pi-instagram"></i></a>
            <a href="#" class="social-link" title="X (Twitter)"><i class="pi pi-twitter"></i></a>
            <a href="#" class="social-link" title="LinkedIn"><i class="pi pi-linkedin"></i></a>
          </div>
        </div>

        <!-- Navigation Groups -->
        <div class="footer-nav-grid">
          <div class="footer-col">
            <h4 class="footer-heading">Collections</h4>
            <NuxtLink to="/hotels" class="footer-link">Boutique Hotels</NuxtLink>
            <NuxtLink to="/hotels" class="footer-link">Luxury Resorts</NuxtLink>
            <NuxtLink to="/hotels" class="footer-link">Business Stays</NuxtLink>
            <NuxtLink to="/offers" class="footer-link">Seasonal Offers</NuxtLink>
          </div>

          <div class="footer-col">
            <h4 class="footer-heading">The Agency</h4>
            <NuxtLink to="/about" class="footer-link">Our Story</NuxtLink>
            <NuxtLink to="/reservations/history" class="footer-link">Guest Portal</NuxtLink>
            <a href="#" class="footer-link">Partner Program</a>
            <a href="#" class="footer-link">Contact</a>
          </div>

          <div class="footer-col">
            <h4 class="footer-heading">Support</h4>
            <a href="#" class="footer-link">Help Center</a>
            <a href="#" class="footer-link">Terms of Service</a>
            <a href="#" class="footer-link">Privacy Policy</a>
            <a href="#" class="footer-link">Cancellation</a>
          </div>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="footer-bottom">
        <div class="footer-bottom-content">
          <p class="copyright">&copy; {{ new Date().getFullYear() }} VoyageHub Authority. All rights reserved.</p>
          <div class="footer-meta">
            <span>Paris &bull; Nice &bull; Lyon &bull; Bordeaux</span>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.client-footer {
  background: var(--color-neutral-900);
  color: var(--color-neutral-300);
  margin-top: auto;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.footer-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 80px 40px 0;
}

.footer-grid {
  display: grid;
  grid-template-columns: 1.5fr 2.5fr;
  gap: 80px;
  margin-bottom: 80px;
}

.footer-brand {
  display: inline-block;
  text-decoration: none;
  margin-bottom: 24px;
}

.footer-brand .brand-text {
  font-size: 28px;
  font-weight: 800;
  color: white;
  font-family: var(--font-family-heading);
  letter-spacing: -0.02em;
}

.footer-brand .brand-accent {
  color: var(--color-primary-400);
}

.footer-manifesto {
  font-size: 15px;
  line-height: 1.7;
  color: var(--color-neutral-400);
  margin-bottom: 32px;
  max-width: 400px;
}

.footer-social {
  display: flex;
  gap: 16px;
}

.social-link {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.03);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.social-link:hover {
  background: var(--color-primary-500);
  border-color: var(--color-primary-400);
  transform: translateY(-3px);
}

/* Nav Grid */
.footer-nav-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
}

.footer-heading {
  color: white;
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 24px;
  text-transform: uppercase;
  letter-spacing: 0.15em;
}

.footer-col {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.footer-link {
  text-decoration: none;
  color: var(--color-neutral-400);
  font-size: 14px;
  transition: all 0.2s ease;
  width: fit-content;
}

.footer-link:hover {
  color: white;
  padding-left: 4px;
}

/* Bottom Bar */
.footer-bottom {
  padding: 40px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.footer-bottom-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
}

.copyright {
  font-size: 13px;
  color: var(--color-neutral-500);
}

.footer-meta {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-neutral-600);
}

@media (max-width: 1024px) {
  .footer-grid { grid-template-columns: 1fr; gap: 60px; }
  .footer-container { padding: 60px 24px 0; }
}

@media (max-width: 640px) {
  .footer-nav-grid { grid-template-columns: 1fr; gap: 40px; }
  .footer-bottom-content { flex-direction: column; text-align: center; }
}
</style>
