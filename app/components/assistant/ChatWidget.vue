<template>
  <div class="assistant-widget">
    <button type="button" class="assistant-trigger" @click="toggle">
      <span class="assistant-trigger__icon material-symbols-outlined" aria-hidden="true">smart_toy</span>
      {{ isOpen ? 'Close' : 'Assistant' }}
    </button>

    <section v-if="isOpen" class="assistant-panel" aria-label="AI assistant chat">
      <header class="assistant-header">
        <h3>VoyageHub Assistant</h3>
        <p>Hotels, offers, and booking help — answers use live catalog data.</p>
      </header>

      <div class="assistant-body">
        <div class="assistant-messages" ref="messagesEl">
          <article
            v-for="msg in messages"
            :key="msg.id"
            :class="[
              'assistant-message',
              msg.role === 'user' ? 'assistant-message--user' : 'assistant-message--assistant',
            ]"
          >
            {{ msg.content }}
          </article>
          <p v-if="loading" class="assistant-typing">Thinking…</p>
        </div>

        <div v-if="quickPrompts.length" class="assistant-section">
          <span class="assistant-section__label">Quick picks</span>
          <div class="assistant-chips">
            <button
              v-for="(prompt, idx) in quickPrompts.slice(0, 8)"
              :key="'q' + idx"
              type="button"
              class="assistant-chip assistant-chip--accent"
              :disabled="loading"
              @click="sendSuggestion(prompt)"
            >
              {{ prompt }}
            </button>
          </div>
        </div>

        <div v-if="suggestions.length" class="assistant-section">
          <span class="assistant-section__label">Try asking</span>
          <div class="assistant-chips">
            <button
              v-for="(suggestion, idx) in suggestions.slice(0, 6)"
              :key="'s' + idx"
              type="button"
              class="assistant-chip"
              :disabled="loading"
              @click="sendSuggestion(suggestion)"
            >
              {{ suggestion }}
            </button>
          </div>
        </div>

        <div v-if="actions.length" class="assistant-actions">
          <button
            v-for="(action, idx) in actions"
            :key="'a' + idx"
            type="button"
            class="assistant-action-btn"
            :disabled="loading"
            @click="applyAction(action)"
          >
            {{ action.label }}
          </button>
        </div>

        <p v-if="error" class="assistant-error">{{ error }}</p>
      </div>

      <form class="assistant-input" @submit.prevent="submit">
        <input
          v-model="draft"
          type="text"
          autocomplete="off"
          placeholder="Ask about hotels, offers, or booking…"
          :disabled="loading"
        />
        <button type="submit" :disabled="loading || !draft.trim()">
          {{ loading ? '…' : 'Send' }}
        </button>
      </form>
    </section>
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'

const draft = ref('')
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

watch(
  () => messages.value.length,
  async () => {
    await nextTick()
    messagesEl.value?.scrollTo({ top: messagesEl.value.scrollHeight, behavior: 'smooth' })
  },
)

async function submit() {
  const text = draft.value
  draft.value = ''
  await sendMessage(text)
}

async function sendSuggestion(value: string) {
  await sendMessage(value)
}
</script>

<style scoped>
.assistant-widget {
  position: fixed;
  right: var(--space-5);
  bottom: var(--space-5);
  z-index: var(--z-fixed, 70);
  font-family: var(--font-family-base);
}

.assistant-trigger {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  border: 1px solid color-mix(in srgb, var(--color-primary) 45%, white 55%);
  border-radius: 999px;
  padding: var(--space-2) var(--space-4);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-body-md);
  color: white;
  background: linear-gradient(
    135deg,
    var(--color-primary),
    color-mix(in srgb, var(--color-primary) 82%, black 18%)
  );
  cursor: pointer;
  box-shadow: var(--shadow-lg);
  transition: var(--transition-hover);
}

.assistant-trigger__icon {
  font-size: 1.05rem;
}

.assistant-trigger:hover {
  transform: translateY(-1px);
}

.assistant-trigger:active {
  transform: translateY(0);
}

.assistant-panel {
  width: min(390px, calc(100vw - 2 * var(--space-4)));
  height: min(560px, calc(100vh - 120px));
  margin-bottom: var(--space-3);
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  gap: 0;
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-border);
  background: var(--color-bg);
  box-shadow: var(--shadow-2xl, var(--shadow-lg));
  overflow: hidden;
}

.assistant-body {
  min-height: 0;
  overflow-y: auto;
  background: var(--color-bg-soft);
}

.assistant-header {
  padding: var(--space-4) var(--space-4) var(--space-3);
  background: var(--color-surface, var(--color-bg));
  border-bottom: 1px solid var(--color-border);
}

.assistant-header h3 {
  margin: 0;
  font-size: var(--font-size-body-xl);
  color: var(--color-heading);
  font-family: var(--font-family-heading);
  font-weight: var(--font-weight-semibold);
}

.assistant-header p {
  margin: var(--space-1) 0 0;
  font-size: var(--font-size-body-sm);
  line-height: var(--line-height-normal);
  color: var(--color-text-soft);
}

.assistant-messages {
  padding: var(--space-3);
  overflow: visible;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  background: transparent;
  min-height: 0;
}

.assistant-message {
  max-width: 90%;
  font-size: var(--font-size-body-md);
  line-height: var(--line-height-normal);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-lg);
  overflow-wrap: anywhere;
  word-break: break-word;
}

.assistant-message--assistant {
  align-self: flex-start;
  background: var(--color-bg);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
}

.assistant-message--user {
  align-self: flex-end;
  background: color-mix(in srgb, var(--color-primary) 14%, white 86%);
  color: var(--color-primary);
  border: 1px solid color-mix(in srgb, var(--color-primary) 35%, white 65%);
}

.assistant-typing {
  margin: 0;
  font-size: var(--font-size-body-sm);
  color: var(--color-text-soft);
  font-style: italic;
}

.assistant-section {
  padding: var(--space-2) var(--space-3) var(--space-1);
  background: var(--color-surface, var(--color-bg));
  border-top: 1px solid var(--color-border);
}

.assistant-section__label {
  display: block;
  font-size: var(--font-size-caption, 0.7rem);
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-text-soft);
  margin-bottom: var(--space-1);
}

.assistant-chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1);
}

.assistant-chip {
  border: 1px solid var(--color-border);
  background: var(--color-bg-soft);
  border-radius: 999px;
  padding: 5px var(--space-2);
  font-size: var(--font-size-caption, 0.72rem);
  line-height: 1.25;
  cursor: pointer;
  color: var(--color-text-soft);
  text-align: left;
  transition: var(--transition-hover);
}

.assistant-chip:hover:not(:disabled) {
  border-color: color-mix(in srgb, var(--color-primary) 45%, white 55%);
  color: var(--color-primary);
  background: color-mix(in srgb, var(--color-primary) 8%, white 92%);
}

.assistant-chip--accent {
  background: color-mix(in srgb, var(--color-primary) 10%, white 90%);
  border-color: color-mix(in srgb, var(--color-primary) 36%, white 64%);
  color: var(--color-primary);
}

.assistant-chip:disabled {
  opacity: var(--opacity-disabled, 0.55);
  cursor: not-allowed;
}

.assistant-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1);
  padding: var(--space-2) var(--space-3);
  background: var(--color-surface, var(--color-bg));
  border-top: 1px solid var(--color-border);
}

.assistant-action-btn {
  flex: 1 1 auto;
  min-width: calc(50% - 3px);
  border: 1px solid var(--color-border);
  background: var(--color-bg);
  border-radius: var(--radius-md);
  padding: var(--space-2) var(--space-2);
  font-size: var(--font-size-body-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
  cursor: pointer;
  transition: var(--transition-hover);
}

.assistant-action-btn:hover:not(:disabled) {
  border-color: color-mix(in srgb, var(--color-primary) 45%, white 55%);
  color: var(--color-primary);
  background: color-mix(in srgb, var(--color-primary) 6%, white 94%);
}

.assistant-action-btn:disabled {
  opacity: var(--opacity-disabled, 0.55);
  cursor: not-allowed;
}

.assistant-error {
  margin: 0;
  padding: var(--space-1) var(--space-3);
  font-size: var(--font-size-body-sm);
  color: var(--alert-danger-text, #b91c1c);
  background: var(--alert-danger-bg, #fef2f2);
  border-top: 1px solid var(--alert-danger-border, #fecaca);
}

.assistant-input {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3) var(--space-3);
  background: var(--color-surface, var(--color-bg));
  border-top: 1px solid var(--color-border);
}

.assistant-input input {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-2) var(--space-3);
  font-size: var(--font-size-body-md);
  background: var(--color-bg);
  color: var(--color-text);
}

.assistant-input input::placeholder {
  color: var(--color-text-soft);
}

.assistant-input input:focus-visible {
  border-color: color-mix(in srgb, var(--color-primary) 45%, white 55%);
}

.assistant-input button {
  border: 1px solid color-mix(in srgb, var(--color-primary) 45%, white 55%);
  border-radius: var(--radius-md);
  padding: var(--space-2) var(--space-3);
  background: var(--color-primary);
  color: white;
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-body-md);
  cursor: pointer;
  transition: var(--transition-hover);
}

.assistant-input button:hover:not(:disabled) {
  background: color-mix(in srgb, var(--color-primary) 84%, black 16%);
}

.assistant-input button:disabled {
  opacity: var(--opacity-disabled, 0.55);
  cursor: not-allowed;
}
</style>
