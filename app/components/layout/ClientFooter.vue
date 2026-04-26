<template>
  <footer class="client-footer">
    <div class="footer-container">
      <div class="footer-grid">
        <!-- Brand & Manifesto -->
        <div class="footer-brand-col">
          <NuxtLink to="/" class="footer-brand">
            <span class="footer-brand-mark">
              <span
                class="material-symbols-outlined footer-brand-icon"
                aria-hidden="true"
                >bolt</span
              >
            </span>
            <span class="brand-text"
              >Voyage<span class="brand-accent">Hub</span></span
            >
          </NuxtLink>
          <div class="footer-social">
            <div>
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                class="footer-social-link"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.6 1.7-1.6h1.6V3.8c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4V10H8v3h2.6v8h2.9z"
                  />
                </svg>
              </a>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                class="footer-social-link"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M12 7.2A4.8 4.8 0 1 0 12 16.8 4.8 4.8 0 1 0 12 7.2zm0 8A3.2 3.2 0 1 1 12 8.8a3.2 3.2 0 0 1 0 6.4z"
                  />
                  <path
                    d="M16.9 3H7.1A4.1 4.1 0 0 0 3 7.1v9.8A4.1 4.1 0 0 0 7.1 21h9.8a4.1 4.1 0 0 0 4.1-4.1V7.1A4.1 4.1 0 0 0 16.9 3zm2.5 13.9a2.5 2.5 0 0 1-2.5 2.5H7.1a2.5 2.5 0 0 1-2.5-2.5V7.1a2.5 2.5 0 0 1 2.5-2.5h9.8a2.5 2.5 0 0 1 2.5 2.5v9.8z"
                  />
                  <circle cx="17.4" cy="6.6" r="1.1" />
                </svg>
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X"
                class="footer-social-link"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M18.9 3h2.9l-6.3 7.2L23 21h-5.9l-4.6-6-5.3 6H4.3l6.7-7.6L1 3h6l4.2 5.5L18.9 3zm-1 16.3h1.6L6.1 4.6H4.4l13.5 14.7z"
                  />
                </svg>
              </a>
            </div>
            <span class="footer-social-label">FOLLOW US</span>
          </div>
        </div>

        <!-- Navigation Groups -->
        <div class="footer-nav-grid">
          <div class="footer-col">
            <h4 class="footer-heading">Company</h4>
            <NuxtLink to="/about" class="footer-link">About Us</NuxtLink>
            <NuxtLink to="/terms" class="footer-link"
              >Terms of Service</NuxtLink
            >
            <NuxtLink to="/privacy" class="footer-link"
              >Privacy Policy</NuxtLink
            >
          </div>

          <div class="footer-col">
            <h4 class="footer-heading">Booking</h4>
            <NuxtLink to="/my-bookings" class="footer-link"
              >My Bookings</NuxtLink
            >
            <NuxtLink to="/cancellation-policy" class="footer-link"
              >Cancellation Policy</NuxtLink
            >
            <NuxtLink to="/help-center" class="footer-link"
              >Help Center</NuxtLink
            >
          </div>

          <div class="footer-col">
            <h4 class="footer-heading">Support</h4>
            <NuxtLink to="/contact" class="footer-link">Contact</NuxtLink>
          </div>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="footer-bottom">
        <div class="footer-bottom-content">
          <p class="copyright">
            &copy; {{ new Date().getFullYear() }} VoyageHub Authority. All
            rights reserved.
          </p>
          <div class="footer-meta">
            <span>Sfax &bull; Tunis &bull; Mahdia &bull; Gafsa</span>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.client-footer {
  background: linear-gradient(180deg, #f9fcff 0%, #eef5fb 100%);
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
  padding: 16px 8px;
}

.footer-brand {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  margin-bottom: 24px;
}

.footer-brand-mark {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    135deg,
    var(--color-primary-500),
    var(--color-primary-container, #008283)
  );
  color: white;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.08);
  flex-shrink: 0;
}

.footer-brand-icon {
  font-size: 24px;
  line-height: 1;
  font-variation-settings: "FILL" 1;
}

.footer-brand .brand-text {
  font-size: 24px;
  font-weight: 800;
  color: var(--color-gray-900);
  letter-spacing: -0.02em;
  font-family: var(--font-family-heading) !important;
}

.footer-brand .brand-accent {
  color: var(--color-primary-500);
}

.footer-social {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-left: 12px;
}

.footer-social-label {
  font-size: 14px;
  color: var(--color-gray-700);
  font-weight: 800;
}

.footer-social-link {
  width: 36px;
  height: 36px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-gray-700);
  background: white;
  border: 1px solid rgba(188, 201, 200, 0.7);
  transition:
    color 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease,
    background-color 0.2s ease;
}

.footer-social-link:hover {
  color: var(--color-primary-600);
  border-color: var(--color-primary-300);
  background: color-mix(in srgb, var(--color-primary-50) 70%, white 30%);
  transform: translateY(-1px);
}

.footer-social-link svg {
  width: 20px;
  height: 20px;
  fill: currentColor;
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
  transition:
    color 0.2s ease,
    background-color 0.2s ease,
    transform 0.2s ease;
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
  .footer-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  .footer-container {
    padding: 20px 20px 0;
  }
  .footer-nav-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
  }
}

@media (max-width: 640px) {
  .footer-container {
    padding: 18px 16px 0;
  }
  .footer-grid {
    gap: 16px;
    margin-bottom: 14px;
  }
  .footer-brand .brand-text {
    font-size: 20px;
  }
  .footer-nav-grid {
    grid-template-columns: 1fr;
    gap: 14px;
  }
  .footer-col {
    gap: 2px;
  }
  .footer-bottom {
    padding: 10px 0 12px;
  }
  .footer-bottom-content {
    flex-direction: column;
    text-align: center;
  }
}
</style>
