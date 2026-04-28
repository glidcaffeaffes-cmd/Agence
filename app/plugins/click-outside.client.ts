import type { DirectiveBinding, ObjectDirective } from 'vue'

type ClickOutsideEl = HTMLElement & {
  __clickOutsideHandler__?: (event: MouseEvent | TouchEvent) => void
}

const clickOutsideDirective: ObjectDirective<ClickOutsideEl, ((event: MouseEvent | TouchEvent) => void) | undefined> = {
  mounted(el: ClickOutsideEl, binding: DirectiveBinding<((event: MouseEvent | TouchEvent) => void) | undefined>) {
    const handler = (event: MouseEvent | TouchEvent) => {
      const callback = binding.value
      if (!callback || !(event.target instanceof Node)) {
        return
      }

      if (el === event.target || el.contains(event.target)) {
        return
      }

      callback(event)
    }

    el.__clickOutsideHandler__ = handler
    document.addEventListener('click', handler)
    document.addEventListener('touchstart', handler)
  },
  unmounted(el: ClickOutsideEl) {
    const handler = el.__clickOutsideHandler__
    if (!handler) {
      return
    }

    document.removeEventListener('click', handler)
    document.removeEventListener('touchstart', handler)
    delete el.__clickOutsideHandler__
  },
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('click-outside', clickOutsideDirective)
})
