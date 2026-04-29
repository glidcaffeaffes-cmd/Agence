<template>
  <div class="assistant-widget">
    <button
      v-if="!isOpen"
      type="button"
      class="assistant-trigger"
      aria-controls="voyagehub-assistant-panel"
      :aria-expanded="isOpen"
      @click="toggle"
    >
      <span class="assistant-trigger__icon material-symbols-outlined" aria-hidden="true">
        headset_mic
      </span>
    </button>

    <section
      v-if="isOpen"
      id="voyagehub-assistant-panel"
      class="assistant-panel"
      aria-label="VoyageHub assistant chat"
    >
      <header class="assistant-header">
        <span class="assistant-header__icon material-symbols-outlined" aria-hidden="true">
          headset_mic
        </span>

        <div class="assistant-header__copy">
          <h3>VoyageHub Assistant</h3>
          <p>Live hotel and booking help</p>
        </div>

        <button
          type="button"
          class="assistant-close"
          aria-label="Close assistant"
          @click="toggle"
        >
          <span class="material-symbols-outlined" aria-hidden="true">close</span>
        </button>
      </header>

      <div class="assistant-conversation" ref="messagesEl">
        <article
          v-for="msg in messages"
          :key="msg.id"
          :class="[
            'assistant-message',
            msg.role === 'user' ? 'assistant-message--user' : 'assistant-message--assistant',
          ]"
        >
          <div class="assistant-message__bubble">
            {{ msg.content }}
          </div>
        </article>

        <div
          v-if="messages.length <= 1 && starterPrompts.length"
          class="assistant-starters"
          aria-label="Suggested questions"
        >
          <button
            v-for="(prompt, idx) in starterPrompts"
            :key="'starter' + idx"
            type="button"
            class="assistant-starter"
            :disabled="loading"
            @click="sendSuggestion(prompt)"
          >
            <span>{{ prompt }}</span>
            <span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
          </button>
        </div>

        <div v-if="loading" class="assistant-typing" aria-live="polite">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <footer class="assistant-footer">
        <div v-if="actions.length" class="assistant-actions">
          <button
            v-for="(action, idx) in actions"
            :key="'a' + idx"
            type="button"
            class="assistant-action"
            :disabled="loading"
            @click="applyAction(action)"
          >
            {{ action.label }}
          </button>
        </div>

        <div
          v-else-if="messages.length > 1 && compactSuggestions.length"
          class="assistant-suggestions"
          aria-label="Suggested follow-up questions"
        >
          <button
            v-for="(suggestion, idx) in compactSuggestions"
            :key="'s' + idx"
            type="button"
            class="assistant-suggestion"
            :disabled="loading"
            @click="sendSuggestion(suggestion)"
          >
            {{ suggestion }}
          </button>
        </div>

        <p v-if="error" class="assistant-error">{{ error }}</p>

        <form class="assistant-input" @submit.prevent="submit">
          <input
            ref="draftInput"
            v-model="draft"
            type="text"
            autocomplete="off"
            aria-label="Ask about hotels, offers, or booking"
            placeholder="Ask about hotels, offers, or booking"
            :disabled="loading"
          />
          <button type="submit" :disabled="loading || !draft.trim()" aria-label="Send message">
            <span class="material-symbols-outlined" aria-hidden="true">
              {{ loading ? 'progress_activity' : 'send' }}
            </span>
          </button>
        </form>
      </footer>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'

const draft = ref('')
const draftInput = ref<HTMLInputElement | null>(null)
const messagesEl = ref<HTMLElement | null>(null)

const {
  isOpen,
  loading,
  error,
  messages,
  suggestions,
  quickPrompts,
  actions,
  sendMessage,
  applyAction,
  toggle,
} = useAssistant()

const starterPrompts = computed(() => {
  const prompts = quickPrompts.value.length ? quickPrompts.value : suggestions.value
  return prompts.slice(0, 3)
})

const compactSuggestions = computed(() => suggestions.value.slice(0, 3))

watch(
  [() => messages.value.length, () => loading.value, () => isOpen.value],
  async () => {
    await nextTick()
    messagesEl.value?.scrollTo({ top: messagesEl.value.scrollHeight, behavior: 'smooth' })
  },
)

watch(
  () => isOpen.value,
  async (open) => {
    if (!open) return
    await nextTick()
    draftInput.value?.focus()
  },
)

async function submit() {
  const text = draft.value.trim()
  if (!text) return

  draft.value = ''
  await sendMessage(text)
}

async function sendSuggestion(value: string) {
  await sendMessage(value)
}
</script>

<style scoped>
.assistant-widget {
  --assistant-ink: #172033;
  --assistant-muted: #667085;
  --assistant-line: #d9e1ea;
  --assistant-soft: #f6f8fb;
  --assistant-accent: #1d4b8f;
  --assistant-accent-strong: #17376b;
  --assistant-accent-weak: #eaf1fb;
  --assistant-focus: rgb(29 75 143 / 0.18);

  position: fixed;
  right: max(1.25rem, env(safe-area-inset-right));
  bottom: max(1.25rem, env(safe-area-inset-bottom));
  z-index: var(--z-fixed, 70);
  font-family: var(--font-family-base);
}

.assistant-trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3.25rem;
  height: 3.25rem;
  border: 1px solid #2c5fa7;
  border-radius: 999px;
  padding: 0;
  background: var(--assistant-accent);
  color: white;
  box-shadow: 0 16px 30px -20px rgb(23 55 107 / 0.84);
  cursor: pointer;
  transition:
    transform 150ms ease,
    border-color 150ms ease,
    background 150ms ease,
    box-shadow 150ms ease;
}

.assistant-trigger:hover {
  transform: translateY(-1px);
  border-color: #3b6fb8;
  background: var(--assistant-accent-strong);
  box-shadow: 0 20px 34px -20px rgb(23 55 107 / 0.88);
}

.assistant-trigger:active {
  transform: translateY(0);
}

.assistant-trigger__icon {
  display: grid;
  place-items: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  color: white;
  font-size: 1.25rem;
}

.assistant-panel {
  width: min(374px, calc(100vw - 1rem));
  height: min(520px, calc(100vh - 1rem));
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  overflow: hidden;
  border: 1px solid var(--assistant-line);
  border-radius: 0.85rem;
  background: #fff;
  box-shadow: 0 28px 56px -34px rgb(23 32 51 / 0.55);
}

.assistant-header {
  display: grid;
  grid-template-columns: 2.1rem minmax(0, 1fr) 2.1rem;
  align-items: center;
  gap: 0.7rem;
  min-height: 4rem;
  padding: 0.65rem 0.85rem;
  border-bottom: 1px solid var(--assistant-line);
  background: #fff;
}

.assistant-header__icon,
.assistant-close {
  display: grid;
  place-items: center;
  width: 2.1rem;
  height: 2.1rem;
  border-radius: 0.65rem;
}

.assistant-header__icon {
  background: var(--assistant-accent-weak);
  color: var(--assistant-accent);
  font-size: 1.08rem;
}

.assistant-header__copy {
  min-width: 0;
}

.assistant-header h3 {
  margin: 0;
  color: var(--assistant-ink);
  font-family: var(--font-family-heading);
  font-size: 0.98rem;
  font-weight: 800;
  line-height: 1.2;
}

.assistant-header p {
  margin: 0.2rem 0 0;
  color: var(--assistant-muted);
  font-size: 0.76rem;
  line-height: 1.25;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.assistant-close {
  border: 1px solid transparent;
  background: transparent;
  color: var(--assistant-muted);
  cursor: pointer;
  transition:
    background 150ms ease,
    border-color 150ms ease,
    color 150ms ease;
}

.assistant-close:hover {
  border-color: var(--assistant-line);
  background: var(--assistant-soft);
  color: var(--assistant-ink);
}

.assistant-close .material-symbols-outlined {
  font-size: 1.2rem;
}

.assistant-conversation {
  min-height: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  padding: 0.85rem;
  background: var(--assistant-soft);
}

.assistant-conversation::-webkit-scrollbar {
  width: 0.45rem;
}

.assistant-conversation::-webkit-scrollbar-thumb {
  border-radius: 999px;
  background: #bdc8d5;
}

.assistant-message {
  display: flex;
  max-width: 100%;
}

.assistant-message--user {
  justify-content: flex-end;
}

.assistant-message__bubble {
  max-width: 84%;
  padding: 0.7rem 0.82rem;
  border-radius: 0.8rem;
  font-size: 0.9rem;
  line-height: 1.5;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.assistant-message--assistant .assistant-message__bubble {
  border: 1px solid var(--assistant-line);
  border-bottom-left-radius: 0.35rem;
  background: white;
  color: var(--assistant-ink);
  box-shadow: 0 10px 22px -20px rgb(23 32 51 / 0.32);
}

.assistant-message--user .assistant-message__bubble {
  border: 1px solid #b7d9d8;
  border-bottom-right-radius: 0.35rem;
  background: #eef8f7;
  color: #16484b;
}

.assistant-starters {
  display: grid;
  gap: 0.45rem;
  margin-top: 0.2rem;
}

.assistant-starter {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 1.1rem;
  align-items: center;
  gap: 0.6rem;
  width: 100%;
  min-height: 2.62rem;
  border: 1px solid var(--assistant-line);
  border-radius: 0.75rem;
  padding: 0.5rem 0.65rem 0.5rem 0.75rem;
  background: white;
  color: var(--assistant-ink);
  text-align: left;
  font-size: 0.84rem;
  font-weight: 650;
  cursor: pointer;
  transition:
    border-color 150ms ease,
    background 150ms ease,
    transform 150ms ease;
}

.assistant-starter:hover:not(:disabled) {
  transform: translateY(-1px);
  border-color: var(--assistant-accent);
  background: #fbfdfd;
}

.assistant-starter span:first-child {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.assistant-starter .material-symbols-outlined {
  color: var(--assistant-accent);
  font-size: 1rem;
}

.assistant-typing {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  width: fit-content;
  padding: 0.8rem 0.9rem;
  border: 1px solid var(--assistant-line);
  border-radius: 999px;
  background: white;
}

.assistant-typing span {
  width: 0.4rem;
  height: 0.4rem;
  border-radius: 50%;
  background: var(--assistant-accent);
  opacity: 0.35;
  animation: assistant-pulse 1s infinite ease-in-out;
}

.assistant-typing span:nth-child(2) {
  animation-delay: 0.14s;
}

.assistant-typing span:nth-child(3) {
  animation-delay: 0.28s;
}

.assistant-footer {
  display: grid;
  gap: 0.6rem;
  padding: 0.7rem 0.85rem 0.8rem;
  border-top: 1px solid var(--assistant-line);
  background: white;
}

.assistant-actions,
.assistant-suggestions {
  display: flex;
  gap: 0.45rem;
  overflow-x: auto;
  padding-bottom: 0.1rem;
}

.assistant-actions::-webkit-scrollbar,
.assistant-suggestions::-webkit-scrollbar {
  display: none;
}

.assistant-action,
.assistant-suggestion {
  flex: 0 0 auto;
  max-width: 14rem;
  min-height: 2.12rem;
  border-radius: 999px;
  padding: 0.4rem 0.7rem;
  font-size: 0.78rem;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  transition:
    background 150ms ease,
    border-color 150ms ease,
    color 150ms ease;
}

.assistant-action {
  border: 1px solid var(--assistant-ink);
  background: var(--assistant-ink);
  color: white;
}

.assistant-action:hover:not(:disabled) {
  background: #0f172a;
}

.assistant-suggestion {
  border: 1px solid var(--assistant-line);
  background: #fff;
  color: var(--assistant-ink);
}

.assistant-suggestion:hover:not(:disabled) {
  border-color: var(--assistant-accent);
  color: var(--assistant-accent);
}

.assistant-error {
  margin: 0;
  border: 1px solid var(--alert-danger-border, #fecaca);
  border-radius: 0.65rem;
  padding: 0.65rem 0.75rem;
  background: var(--alert-danger-bg, #fef2f2);
  color: var(--alert-danger-text, #b91c1c);
  font-size: 0.82rem;
}

.assistant-input {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 2.75rem;
  align-items: center;
  gap: 0.5rem;
}

.assistant-input input {
  width: 100%;
  min-width: 0;
  height: 2.65rem;
  border: 1px solid var(--assistant-line);
  border-radius: 0.7rem;
  padding: 0 0.8rem;
  background: white;
  color: var(--assistant-ink);
  font-size: 0.9rem;
  transition:
    border-color 150ms ease,
    box-shadow 150ms ease;
}

.assistant-input input::placeholder {
  color: var(--assistant-muted);
}

.assistant-input input:focus-visible {
  outline: none;
  border-color: var(--assistant-accent);
  box-shadow: 0 0 0 3px var(--assistant-focus);
}

.assistant-input button {
  display: grid;
  place-items: center;
  width: 2.65rem;
  height: 2.65rem;
  border: 1px solid var(--assistant-accent);
  border-radius: 0.7rem;
  background: var(--assistant-accent);
  color: white;
  cursor: pointer;
  transition:
    background 150ms ease,
    transform 150ms ease,
    opacity 150ms ease;
}

.assistant-input button:hover:not(:disabled) {
  transform: translateY(-1px);
  background: var(--assistant-accent-strong);
}

.assistant-input button .material-symbols-outlined {
  font-size: 1.2rem;
}

.assistant-input button:disabled,
.assistant-input input:disabled,
.assistant-starter:disabled,
.assistant-action:disabled,
.assistant-suggestion:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

@keyframes assistant-pulse {
  0%,
  80%,
  100% {
    transform: translateY(0);
    opacity: 0.35;
  }
  40% {
    transform: translateY(-0.18rem);
    opacity: 1;
  }
}

@media (max-width: 640px) {
  .assistant-widget {
    right: max(0.75rem, env(safe-area-inset-right));
    bottom: max(0.75rem, env(safe-area-inset-bottom));
  }

  .assistant-panel {
    width: calc(100vw - 1.5rem);
    height: min(520px, calc(100vh - 1.5rem));
    border-radius: 0.85rem;
  }

  .assistant-trigger {
    width: 3.1rem;
    height: 3.1rem;
  }
}

@media (max-width: 420px) {
  .assistant-trigger {
    width: 3rem;
    height: 3rem;
  }

  .assistant-header {
    grid-template-columns: 2.1rem minmax(0, 1fr) 2.1rem;
    gap: 0.6rem;
    padding-inline: 0.75rem;
  }

  .assistant-conversation,
  .assistant-footer {
    padding-inline: 0.75rem;
  }
}
</style>
