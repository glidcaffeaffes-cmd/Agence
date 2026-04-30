<template>
  <footer class="client-footer">
    <div class="footer-container">
      <div class="footer-grid">
        <div class="footer-brand-col">
          <NuxtLink to="/" class="footer-brand">
            <span class="footer-brand-mark">
              <img :src="brandLogoUrl" alt="" class="footer-brand-logo" aria-hidden="true" />
            </span>
            <span class="brand-text">
              Voyage<span class="brand-accent">Hub</span>
            </span>
          </NuxtLink>

          <div class="footer-social">
            <div class="footer-social-links">
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
            <span class="footer-social-label">{{ t("footer.followUs") }}</span>
          </div>
        </div>

        <div class="footer-nav-grid">
          <div class="footer-col">
            <h4 class="footer-heading">{{ t("footer.company") }}</h4>
            <NuxtLink to="/about" class="footer-link">{{ t("footer.aboutUs") }}</NuxtLink>
            <NuxtLink to="/terms" class="footer-link">{{ t("footer.terms") }}</NuxtLink>
            <NuxtLink to="/privacy" class="footer-link">{{ t("footer.privacy") }}</NuxtLink>
          </div>

          <div class="footer-col">
            <h4 class="footer-heading">{{ t("footer.booking") }}</h4>
            <NuxtLink to="/my-bookings" class="footer-link">{{ t("footer.myBookings") }}</NuxtLink>
            <NuxtLink to="/cancellation-policy" class="footer-link">
              {{ t("footer.cancellationPolicy") }}
            </NuxtLink>
            <NuxtLink to="/help-center" class="footer-link">{{ t("footer.helpCenter") }}</NuxtLink>
          </div>

          <div class="footer-col">
            <h4 class="footer-heading">{{ t("footer.support") }}</h4>
            <NuxtLink to="/contact" class="footer-link">{{ t("footer.contact") }}</NuxtLink>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="footer-bottom-content">
          <p class="copyright">
            &copy; {{ new Date().getFullYear() }} VoyageHub Authority. {{ t("footer.rights") }}
          </p>
          <div class="footer-meta">
            <span>{{ t("common.cities") }}</span>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const runtimeConfig = useRuntimeConfig();
const brandLogoUrl = `${runtimeConfig.app.baseURL}logo.png`;
const { t } = useAppI18n();
</script>

<style scoped>
.client-footer {
  margin-top: auto;
  border-top: 1px solid color-mix(in srgb, var(--color-border) 72%, transparent);
  background:
    linear-gradient(
      180deg,
      color-mix(in srgb, var(--color-bg-soft) 88%, transparent) 0%,
      color-mix(in srgb, var(--color-surface) 96%, transparent) 100%
    );
  color: var(--color-text-secondary);
}

.footer-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1.5rem 1.5rem 0;
}

.footer-grid {
  display: grid;
  grid-template-columns: minmax(280px, 1.2fr) minmax(0, 2fr);
  gap: 1.5rem;
  margin-bottom: 1rem;
  padding: 1rem 0.5rem;
}

.footer-brand {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  text-decoration: none;
}

.footer-brand-mark {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 1rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.footer-brand-logo {
  width: 2.1rem;
  height: 2.1rem;
  object-fit: contain;
}

.footer-brand .brand-text {
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  font-family: var(--font-family-heading) !important;
  color: var(--color-text-primary);
}

.footer-brand .brand-accent {
  color: var(--color-primary-500);
}

.footer-social {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-inline-start: 0.75rem;
}

.footer-social-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.footer-social-label {
  font-size: 0.85rem;
  font-weight: 800;
  color: var(--color-text-primary);
}

.footer-social-link {
  width: 2.35rem;
  height: 2.35rem;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  background: var(--color-surface);
  border: 1px solid var(--color-border-soft);
  transition:
    color var(--duration-fast) var(--easing-standard),
    border-color var(--duration-fast) var(--easing-standard),
    transform var(--duration-fast) var(--easing-standard),
    background-color var(--duration-fast) var(--easing-standard);
}

.footer-social-link:hover {
  color: var(--color-primary-600);
  border-color: var(--color-primary-300);
  background: color-mix(in srgb, var(--color-primary-50) 70%, var(--color-surface));
  transform: translateY(-1px);
}

.footer-social-link svg {
  width: 1.15rem;
  height: 1.15rem;
  fill: currentColor;
}

.footer-nav-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.footer-heading {
  margin-bottom: 0.6rem;
  color: var(--color-text-muted);
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.16em;
}

.footer-col {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.footer-link {
  width: fit-content;
  padding: 0.2rem 0.4rem;
  margin-inline-start: -0.4rem;
  border-radius: 0.6rem;
  color: var(--color-text-secondary);
  font-size: 0.85rem;
  line-height: 1.45;
  text-decoration: none;
  transition:
    color var(--duration-fast) var(--easing-standard),
    background-color var(--duration-fast) var(--easing-standard),
    transform var(--duration-fast) var(--easing-standard);
}

.footer-link:hover {
  color: var(--color-primary-700);
  background: color-mix(in srgb, var(--color-primary-50) 68%, transparent);
  transform: translateX(2px);
}

.footer-bottom {
  padding: 0.8rem 0 1rem;
  border-top: 1px solid color-mix(in srgb, var(--color-border) 72%, transparent);
}

.footer-bottom-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.copyright {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 0.78rem;
}

.footer-meta {
  color: var(--color-text-muted);
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.14em;
}

@media (max-width: 1024px) {
  .footer-grid {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }

  .footer-nav-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .footer-container {
    padding: 1.1rem 1rem 0;
  }

  .footer-nav-grid {
    grid-template-columns: 1fr;
    gap: 0.9rem;
  }

  .footer-brand .brand-text {
    font-size: 1.25rem;
  }

  .footer-bottom-content {
    flex-direction: column;
    text-align: center;
  }
}
</style>
