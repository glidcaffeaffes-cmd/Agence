<template>
  <div class="client-layout">
    <ClientNavbar />
    <main class="client-main">
      <slot />
    </main>
    <ClientFooter v-if="!hideFooter" />
    <AuthPromptModal />
    <ClientOnly>
      <ChatWidget />
    </ClientOnly>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const hideFooter = computed(() => {
  if (route.meta?.hideFooter) return true
  return ['/login', '/register', '/forgot-password', '/reset-password'].includes(route.path)
})

let promoBadgeObserver
let promoBadgeInterval

function hideInjectedPromoBadge() {
  if (typeof window === 'undefined') return

  const allElements = Array.from(document.body.querySelectorAll('*'))

  allElements.forEach((element) => {
    const text = element.textContent?.trim().replace(/\s+/g, ' ') || ''
    if (!/^save\s*\d+%$/i.test(text)) return

    const htmlElement = element instanceof HTMLElement ? element : null
    if (!htmlElement) return

    let candidate = htmlElement
    let current = htmlElement.parentElement

    while (current && current !== document.body) {
      const currentStyle = window.getComputedStyle(current)
      if (['fixed', 'sticky', 'absolute'].includes(currentStyle.position)) {
        candidate = current
      }
      current = current.parentElement
    }

    const rect = candidate.getBoundingClientRect()
    const style = window.getComputedStyle(candidate)
    const nearTopLeft = rect.top <= 96 && rect.left <= 180
    const compactSize = rect.width <= 260 && rect.height <= 120
    const overlayLike = ['fixed', 'sticky', 'absolute'].includes(style.position)

    if (nearTopLeft && compactSize && overlayLike) {
      candidate.style.setProperty('display', 'none', 'important')
      candidate.style.setProperty('visibility', 'hidden', 'important')
      candidate.style.setProperty('pointer-events', 'none', 'important')
    }
  })
}

onMounted(() => {
  hideInjectedPromoBadge()

  if (typeof window === 'undefined') return

  promoBadgeObserver = new MutationObserver(() => {
    hideInjectedPromoBadge()
  })

  promoBadgeObserver.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
  })

  promoBadgeInterval = window.setInterval(() => {
    hideInjectedPromoBadge()
  }, 1200)
})

onBeforeUnmount(() => {
  promoBadgeObserver?.disconnect?.()
  if (promoBadgeInterval) window.clearInterval(promoBadgeInterval)
})
</script>

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
