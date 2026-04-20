<template>
  <footer class="client-footer">
    <div class="footer-container">
      <div class="footer-grid">
        <!-- Brand & Manifesto -->
        <div class="footer-brand-col">
          <NuxtLink to="/" class="footer-brand">
            <span class="footer-brand-mark">
              <span class="material-symbols-outlined footer-brand-icon" aria-hidden="true">bolt</span>
            </span>
            <span class="brand-text">Voyage<span class="brand-accent">Hub</span></span>
          </NuxtLink>
          <p class="footer-manifesto">
            We curate extraordinary stays for the discerning traveler. Our mission is to bridge the gap between architectural authority and personalized hospitality across France's most iconic destinations.
          </p>
          <div class="footer-social">
            <a href="#" class="social-link" title="Instagram" aria-label="Instagram">
              <svg viewBox="0 0 24 24" aria-hidden="true" class="social-icon">
                <path fill="currentColor" d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.8A3.95 3.95 0 0 0 3.8 7.75v8.5a3.95 3.95 0 0 0 3.95 3.95h8.5a3.95 3.95 0 0 0 3.95-3.95v-8.5a3.95 3.95 0 0 0-3.95-3.95h-8.5zm8.95 1.35a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3zM12 6.85A5.15 5.15 0 1 1 6.85 12 5.16 5.16 0 0 1 12 6.85zm0 1.8A3.35 3.35 0 1 0 15.35 12 3.35 3.35 0 0 0 12 8.65z"/>
              </svg>
            </a>
            <a href="#" class="social-link" title="X (Twitter)" aria-label="X (Twitter)">
              <svg viewBox="0 0 24 24" aria-hidden="true" class="social-icon">
                <path fill="currentColor" d="M18.9 3H21l-6.56 7.5L22 21h-6.06l-4.74-6.2L5.77 21H3.66l7.02-8.02L2 3h6.21l4.29 5.67L18.9 3zm-1.06 16.2h1.16L7.58 4.74H6.34L17.84 19.2z"/>
              </svg>
            </a>
            <a href="#" class="social-link" title="LinkedIn" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" aria-hidden="true" class="social-icon">
                <path fill="currentColor" d="M6.94 8.5H3.56V20h3.38V8.5zM5.25 3A2.02 2.02 0 1 0 5.3 7.04 2.02 2.02 0 0 0 5.25 3zM20.44 13.02c0-3.46-1.85-5.07-4.32-5.07A3.74 3.74 0 0 0 12.75 9.8V8.5H9.5c.04.86 0 11.5 0 11.5h3.25v-6.42c0-.34.03-.68.12-.92a2.13 2.13 0 0 1 2-1.42c1.42 0 1.99 1.08 1.99 2.67V20h3.25v-6.98z"/>
              </svg>
            </a>
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
  background:
    linear-gradient(180deg, #f9fcff 0%, #eef5fb 100%);
  color: var(--color-gray-700);
  margin-top: auto;
  border-top: 1px solid rgba(188, 201, 200, 0.55);
}

.footer-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px 24px 0;
}

.footer-grid {
  display: grid;
  grid-template-columns: minmax(280px, 1.2fr) minmax(0, 2fr);
  gap: 24px;
  margin-bottom: 16px;
}

.footer-brand {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  margin-bottom: 10px;
}

.footer-brand-mark {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-primary-500), var(--color-primary-container, #008283));
  color: white;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.08);
  flex-shrink: 0;
}

.footer-brand-icon {
  font-size: 24px;
  line-height: 1;
  font-variation-settings: 'FILL' 1;
}

.footer-brand .brand-text {
  font-size: 24px;
  font-weight: 800;
  color: var(--color-gray-900);
  font-family: var(--font-family-heading);
  letter-spacing: -0.02em;
}

.footer-brand .brand-accent {
  color: var(--color-primary-500);
}

.footer-manifesto {
  font-size: 13px;
  line-height: 1.55;
  color: var(--color-gray-600);
  margin-bottom: 12px;
  max-width: 360px;
}

.footer-social {
  display: flex;
  gap: 6px;
}

.social-link {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.82);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-gray-700);
  text-decoration: none;
  transition: all 0.3s ease;
  border: 1px solid rgba(188, 201, 200, 0.65);
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.05);
}

.social-icon {
  width: 15px;
  height: 15px;
  display: block;
}

.social-link:hover {
  background: rgba(77, 182, 172, 0.12);
  border-color: rgba(0, 103, 104, 0.28);
  color: var(--color-primary-700);
  box-shadow: 0 12px 20px rgba(0, 103, 104, 0.1);
  transform: translateY(-2px);
}

/* Nav Grid */
.footer-nav-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.footer-heading {
  color: var(--color-gray-500);
  font-size: 11px;
  font-weight: 700;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.16em;
}

.footer-col {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.footer-link {
  text-decoration: none;
  color: var(--color-gray-700);
  font-size: 13px;
  line-height: 1.4;
  transition: color 0.2s ease, background-color 0.2s ease, transform 0.2s ease;
  width: fit-content;
  padding: 3px 6px;
  margin-left: -6px;
  border-radius: 8px;
}

.footer-link:hover {
  color: var(--color-primary-700);
  background: rgba(77, 182, 172, 0.12);
  transform: translateX(2px);
}

/* Bottom Bar */
.footer-bottom {
  padding: 10px 0 12px;
  border-top: 1px solid rgba(188, 201, 200, 0.55);
}

.footer-bottom-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.copyright {
  font-size: 12px;
  color: var(--color-gray-600);
  margin: 0;
}

.footer-meta {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: var(--color-gray-500);
}

@media (max-width: 1024px) {
  .footer-grid { grid-template-columns: 1fr; gap: 20px; }
  .footer-container { padding: 20px 20px 0; }
  .footer-nav-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; }
}

@media (max-width: 640px) {
  .footer-container { padding: 18px 16px 0; }
  .footer-grid { gap: 16px; margin-bottom: 14px; }
  .footer-brand .brand-text { font-size: 20px; }
  .footer-manifesto { font-size: 12px; margin-bottom: 12px; }
  .footer-nav-grid { grid-template-columns: 1fr; gap: 14px; }
  .footer-col { gap: 2px; }
  .footer-bottom { padding: 10px 0 12px; }
  .footer-bottom-content { flex-direction: column; text-align: center; }
}
</style>
