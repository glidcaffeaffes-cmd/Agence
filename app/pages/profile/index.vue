<template>
  <div class="profile-page">
    <Head>
      <title>{{ t("profilePage.metaTitle") }}</title>
      <meta
        name="description"
        :content="t('profilePage.metaDescription')"
      />
    </Head>

    <div class="profile-container">
      <!-- Page Header -->
      <header class="profile-header">
        <span class="profile-header__title">{{
          t("profilePage.title")
        }}</span>
      </header>

      <div class="profile-body">
        <!-- Sidebar -->
        <ProfileSidebar />

        <!-- Main Content -->
        <main class="profile-main">
          <div class="profile-card main-settings-card">
            <!-- Tabs Header -->
            <div class="tabs-header">
              <button
                v-for="tab in tabItems"
                :key="tab.id"
                class="tab-btn"
                :class="{ 'tab-btn--active': activeTab === tab.id }"
                @click="activeTab = tab.id"
              >
                {{ tab.label }}
              </button>
            </div>

            <!-- Tab Content -->
            <div class="tab-content">
              <!-- Account Settings Tab -->
              <div v-if="activeTab === 'account'" class="tab-pane">
                <form @submit.prevent="saveProfile" class="profile-form">
                  <!-- Personal Details Section -->
                  <section
                    class="settings-section settings-section--allow-overflow"
                  >
                    <div class="settings-section__header">
                      <span class="material-symbols-outlined section-icon"
                        >account_circle</span
                      >
                      <h2 class="settings-section__title">
                        {{ t("profilePage.sections.personalDetails") }}
                      </h2>
                    </div>
                    <div class="settings-section__body">
                      <div class="form-row">
                        <!-- First Name -->
                        <div
                          class="form-group"
                          :class="
                            getFieldState('firstName', formData.firstName)
                          "
                        >
                          <div class="form-label-row">
                            <label class="form-label">{{
                              t("profilePage.labels.firstName")
                            }}</label>
                            <span class="field-status-text">{{
                              getFieldStatusText(
                                "firstName",
                                formData.firstName,
                              )
                            }}</span>
                          </div>
                          <div class="input-icon-wrap">
                            <input
                              type="text"
                              v-model="formData.firstName"
                              class="form-input"
                              :placeholder="t('profilePage.placeholders.firstName')"
                            />
                            <span
                              class="material-symbols-outlined state-icon"
                              >{{
                                getFieldIcon("firstName", formData.firstName)
                              }}</span
                            >
                          </div>
                        </div>
                        <!-- Last Name -->
                        <div
                          class="form-group"
                          :class="getFieldState('lastName', formData.lastName)"
                        >
                          <div class="form-label-row">
                            <label class="form-label">{{
                              t("profilePage.labels.lastName")
                            }}</label>
                            <span class="field-status-text">{{
                              getFieldStatusText("lastName", formData.lastName)
                            }}</span>
                          </div>
                          <div class="input-icon-wrap">
                            <input
                              type="text"
                              v-model="formData.lastName"
                              class="form-input"
                              :placeholder="t('profilePage.placeholders.lastName')"
                            />
                            <span
                              class="material-symbols-outlined state-icon"
                              >{{
                                getFieldIcon("lastName", formData.lastName)
                              }}</span
                            >
                          </div>
                        </div>
                      </div>

                      <div class="form-row">
                        <!-- Date of Birth -->
                        <div
                          class="form-group"
                          :class="
                            getFieldState('dateOfBirth', formData.dateOfBirth)
                          "
                        >
                          <div class="form-label-row">
                            <label class="form-label">{{
                              t("profilePage.labels.dateOfBirth")
                            }}</label>
                            <span class="field-status-text">{{
                              getFieldStatusText(
                                "dateOfBirth",
                                formData.dateOfBirth,
                              )
                            }}</span>
                          </div>
                          <div class="input-icon-wrap">
                            <input
                              type="date"
                              v-model="formData.dateOfBirth"
                              class="form-input"
                            />
                            <span
                              class="material-symbols-outlined state-icon"
                              >{{
                                getFieldIcon(
                                  "dateOfBirth",
                                  formData.dateOfBirth,
                                )
                              }}</span
                            >
                          </div>
                        </div>
                        <div class="form-group"></div>
                      </div>
                    </div>
                  </section>

                  <!-- Contact Information Section -->
                  <section class="settings-section">
                    <div class="settings-section__header">
                      <span class="material-symbols-outlined section-icon"
                        >contact_page</span
                      >
                      <h2 class="settings-section__title">
                        {{ t("profilePage.sections.contactInformation") }}
                      </h2>
                    </div>
                    <div class="settings-section__body">
                      <div class="form-row">
                        <!-- Phone -->
                        <div
                          class="form-group"
                          :class="getFieldState('phone', formData.phone)"
                        >
                          <div class="form-label-row">
                            <label class="form-label">{{
                              t("profilePage.labels.phoneNumber")
                            }}</label>
                            <span class="field-status-text">{{
                              getFieldStatusText("phone", formData.phone)
                            }}</span>
                          </div>
                          <div class="phone-input-group">
                            <div
                              ref="phoneCountryPickerRef"
                              class="phone-country-picker"
                            >
                              <button
                                type="button"
                                class="phone-country-trigger"
                                @click="togglePhoneCountryMenu"
                              >
                                <img
                                  v-if="selectedPhoneCountryData"
                                  :src="selectedPhoneCountryData.flagUrl"
                                  :alt="selectedPhoneCountryData.name"
                                  class="phone-country-flag phone-country-flag--trigger"
                                  loading="lazy"
                                />
                                <span class="material-symbols-outlined">
                                  {{
                                    isPhoneCountryMenuOpen
                                      ? "expand_less"
                                      : "expand_more"
                                  }}
                                </span>
                              </button>
                            </div>
                            <Teleport to="body">
                              <div
                                v-if="isPhoneCountryMenuOpen"
                                ref="phoneCountryMenuRef"
                                class="phone-country-menu"
                                :style="phoneCountryMenuStyle"
                              >
                                <button
                                  v-for="country in phoneCountries"
                                  :key="country.code"
                                  type="button"
                                  class="phone-country-option"
                                  @click="selectPhoneCountry(country.code)"
                                >
                                  <img
                                    :src="country.flagUrl"
                                    :alt="country.name"
                                    class="phone-country-flag"
                                    loading="lazy"
                                  />
                                  <span>
                                    {{ country.code }} (+{{ country.dialCode }})
                                  </span>
                                </button>
                              </div>
                            </Teleport>
                            <div class="input-icon-wrap">
                              <span class="phone-dial-prefix">
                                {{ selectedPhoneDialPrefix }}
                              </span>
                              <input
                                type="tel"
                                v-model="formData.phone"
                                :placeholder="phonePlaceholder"
                                class="form-input form-input--phone"
                                @input="onPhoneInput"
                              />
                              <span
                                class="material-symbols-outlined state-icon"
                                >{{
                                  getFieldIcon("phone", formData.phone)
                                }}</span
                              >
                            </div>
                          </div>
                          <p v-if="phoneValidationMessage" class="form-error">
                            {{ phoneValidationMessage }}
                          </p>
                        </div>
                        <!-- Email (Locked) -->
                        <div class="form-group">
                          <div class="form-label-row">
                            <label class="form-label">{{
                              t("profilePage.labels.emailAddress")
                            }}</label>
                            <span class="badge-verified">{{
                              t("profilePage.labels.verified")
                            }}</span>
                          </div>
                          <div class="input-icon-wrap">
                            <input
                              type="email"
                              :value="currentProfile?.email"
                              disabled
                              class="form-input form-input--disabled"
                            />
                            <span class="material-symbols-outlined input-icon"
                              >lock</span
                            >
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  <!-- Identification Section -->
                  <section class="settings-section">
                    <div class="settings-section__header">
                      <span class="material-symbols-outlined section-icon"
                        >badge</span
                      >
                      <h2 class="settings-section__title">
                        {{ t("profilePage.sections.identification") }}
                      </h2>
                    </div>
                    <div class="settings-section__body">
                      <div class="form-row">
                        <!-- Passport -->
                        <div
                          class="form-group"
                          :class="
                            getFieldState(
                              'passportNumber',
                              formData.passportNumber,
                            )
                          "
                        >
                          <div class="form-label-row">
                            <label class="form-label">{{
                              t("profilePage.labels.passportNumber")
                            }}</label>
                            <span class="field-status-text">{{
                              getFieldStatusText(
                                "passportNumber",
                                formData.passportNumber,
                              )
                            }}</span>
                          </div>
                          <div class="input-icon-wrap">
                            <input
                              type="text"
                              v-model="formData.passportNumber"
                              class="form-input"
                              :placeholder="t('profilePage.placeholders.passport')"
                              maxlength="9"
                              autocapitalize="characters"
                              spellcheck="false"
                              @input="onPassportInput"
                            />
                            <span
                              class="material-symbols-outlined state-icon"
                              >{{
                                getFieldIcon(
                                  "passportNumber",
                                  formData.passportNumber,
                                )
                              }}</span
                            >
                          </div>
                          <p v-if="passportValidationMessage" class="form-error">
                            {{ passportValidationMessage }}
                          </p>
                        </div>
                        <div class="form-group"></div>
                      </div>
                    </div>
                  </section>

                  <div class="form-actions">
                    <button
                      type="submit"
                      :disabled="loading || !hasProfileChanges"
                      class="btn-update"
                    >
                      {{
                        loading
                          ? t("profilePage.actions.updating")
                          : t("profilePage.actions.updateProfile")
                      }}
                    </button>
                  </div>
                </form>
              </div>

              <!-- Travel Preferences Tab -->
              <div v-if="activeTab === 'travel'" class="tab-pane">
                <form @submit.prevent="saveProfile" class="profile-form">
                  <!-- Bio Section -->
                  <section class="settings-section">
                    <div class="settings-section__header">
                      <span class="material-symbols-outlined section-icon"
                        >description</span
                      >
                      <h2 class="settings-section__title">
                        {{ t("profilePage.sections.bio") }}
                      </h2>
                    </div>
                    <div class="settings-section__body">
                      <div
                        class="form-group"
                        :class="getFieldState('bio', formData.bio)"
                      >
                        <div class="form-label-row">
                          <label class="form-label">{{
                            t("profilePage.labels.bio")
                          }}</label>
                          <span class="field-status-text">{{
                            getFieldStatusText("bio", formData.bio)
                          }}</span>
                        </div>
                        <textarea
                          v-model="formData.bio"
                          class="form-input form-input--textarea"
                          :placeholder="t('profilePage.placeholders.bio')"
                          rows="4"
                        ></textarea>
                      </div>
                    </div>
                  </section>

                  <!-- Travel Interests Section -->
                  <section class="settings-section">
                    <div class="settings-section__header">
                      <span class="material-symbols-outlined section-icon"
                        >explore</span
                      >
                      <h2 class="settings-section__title">
                        {{ t("profilePage.sections.travelStyles") }}
                      </h2>
                    </div>
                    <div class="settings-section__body">
                      <div
                        class="form-group"
                        :class="
                          getFieldState(
                            'preferredDestinations',
                            formData.preferredDestinations,
                          )
                        "
                      >
                        <div class="form-label-row">
                          <label class="form-label">{{
                            t("profilePage.labels.preferredDestinations")
                          }}</label>
                          <span class="field-status-text">{{
                            getFieldStatusText(
                              "preferredDestinations",
                              formData.preferredDestinations,
                            )
                          }}</span>
                        </div>
                        <input
                          type="text"
                          :value="formData.preferredDestinations.join(', ')"
                          @input="
                            formData.preferredDestinations = (
                              $event.target as HTMLInputElement
                            ).value
                              .split(',')
                              .map((s) => s.trim())
                              .filter(Boolean)
                          "
                          class="form-input"
                          :placeholder="t('profilePage.placeholders.destinations')"
                        />
                      </div>

                      <div class="form-group">
                        <label class="form-label">{{
                          t("profilePage.labels.travelStyle")
                        }}</label>
                        <div class="travel-prefs">
                          <label
                            v-for="pref in travelPrefOptions"
                            :key="pref.value"
                            class="pref-chip"
                            :class="
                              formData.travelPreferences.includes(pref.value)
                                ? 'pref-chip--active'
                                : ''
                            "
                          >
                            <input
                              type="checkbox"
                              :value="pref.value"
                              v-model="formData.travelPreferences"
                              class="sr-only"
                            />
                            {{ pref.label }}
                          </label>
                        </div>
                      </div>
                    </div>
                  </section>

                  <div class="form-actions">
                    <button
                      type="submit"
                      :disabled="loading || !hasProfileChanges"
                      class="btn-update"
                    >
                      {{ t("profilePage.actions.updatePreferences") }}
                    </button>
                  </div>
                </form>
              </div>

              <!-- Billing Tab -->
              <div v-if="activeTab === 'billing'" class="tab-pane">
                <section class="settings-section">
                  <div class="settings-section__header">
                    <span class="material-symbols-outlined section-icon"
                      >payments</span
                    >
                    <h2 class="settings-section__title">
                      {{ t("profilePage.sections.paymentMethods") }}
                    </h2>
                  </div>
                  <div class="settings-section__body">
                    <div class="billing-toolbar">
                      <div>
                        <h3 class="billing-title">
                          {{ t("profilePage.billing.title") }}
                        </h3>
                        <p class="billing-subtitle">
                          {{ t("profilePage.billing.subtitle") }}
                        </p>
                      </div>
                      <button
                        type="button"
                        class="btn-update"
                        :disabled="loading || paymentSetupLoading"
                        @click="startStripePaymentMethodSetup()"
                      >
                        <span class="material-symbols-outlined">add</span>
                        {{
                          paymentMethods.length
                            ? t("profilePage.actions.addPaymentMethod")
                            : t("profilePage.actions.addFirstCard")
                        }}
                      </button>
                    </div>
                    <p
                      v-if="paymentSetupFeedback.message"
                      :class="[
                        'payment-setup-feedback',
                        paymentSetupFeedback.type === 'error'
                          ? 'payment-setup-feedback--error'
                          : 'payment-setup-feedback--success',
                      ]"
                    >
                      {{ paymentSetupFeedback.message }}
                    </p>

                    <div
                      v-if="paymentMethods.length"
                      class="payment-methods-list"
                    >
                      <article
                        v-for="method in paymentMethods"
                        :key="method.id"
                        class="payment-card"
                        :class="{ 'payment-card--default': method.isDefault }"
                      >
                        <div class="payment-card__header">
                          <div>
                            <div class="payment-card__brand">
                              {{ formatCardBrand(method.brand) }}
                            </div>
                            <div class="payment-card__number">
                              •••• {{ method.last4 }}
                            </div>
                          </div>
                          <span
                            v-if="method.isDefault"
                            class="payment-card__badge"
                          >
                            {{ t("profilePage.labels.default") }}
                          </span>
                        </div>

                        <div class="payment-card__meta">
                          <span>
                            {{ t("profilePage.labels.expires") }}
                            {{ String(method.expiryMonth).padStart(2, "0") }}/{{
                              method.expiryYear
                            }}
                          </span>
                        </div>

                        <div class="payment-card__actions">
                          <button
                            v-if="!method.isDefault"
                            type="button"
                            class="payment-card__action"
                            :disabled="loading"
                            @click="setDefaultPaymentMethod(method.id)"
                          >
                            {{ t("profilePage.actions.setDefault") }}
                          </button>
                          <button
                            type="button"
                            class="payment-card__action payment-card__action--danger"
                            :disabled="loading"
                            @click="deletePaymentMethod(method.id)"
                          >
                            {{ t("profilePage.actions.remove") }}
                          </button>
                        </div>
                      </article>
                    </div>

                    <div v-else class="payment-methods-empty">
                      <div class="empty-vault">
                        <div class="empty-vault__icon">
                          <span class="material-symbols-outlined"
                            >credit_card_off</span
                          >
                        </div>
                        <h3 class="empty-vault__title">
                          {{ t("profilePage.billing.emptyTitle") }}
                        </h3>
                        <p class="empty-vault__sub">
                          {{ t("profilePage.billing.emptyDescription") }}
                        </p>
                        <button
                          type="button"
                          class="btn-update"
                          :disabled="loading || paymentSetupLoading"
                          @click="startStripePaymentMethodSetup()"
                        >
                          <span class="material-symbols-outlined">add</span>
                          {{ t("profilePage.actions.addPaymentMethod") }}
                        </button>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              <!-- Notifications Tab -->
              <div v-if="activeTab === 'notifications'" class="tab-pane">
                <section class="settings-section">
                  <div class="settings-section__header">
                    <span class="material-symbols-outlined section-icon"
                      >notifications</span
                    >
                    <h2 class="settings-section__title">
                      {{ t("profilePage.sections.notificationSettings") }}
                    </h2>
                  </div>
                  <div class="settings-section__body">
                    <div class="toggle-list">
                      <label class="toggle-row">
                        <div class="toggle-info">
                          <span class="toggle-title">{{
                            t("profilePage.labels.reservationUpdates")
                          }}</span>
                          <span class="toggle-sub">{{
                            t("profilePage.labels.reservationUpdatesDesc")
                          }}</span>
                        </div>
                        <div class="toggle-wrap">
                          <input
                            type="checkbox"
                            v-model="notificationSettings.reservation"
                            class="sr-only peer"
                          />
                          <div class="toggle-track"></div>
                        </div>
                      </label>

                      <label class="toggle-row">
                        <div class="toggle-info">
                          <span class="toggle-title">{{
                            t("profilePage.labels.exclusiveOffers")
                          }}</span>
                          <span class="toggle-sub">{{
                            t("profilePage.labels.exclusiveOffersDesc")
                          }}</span>
                        </div>
                        <div class="toggle-wrap">
                          <input
                            type="checkbox"
                            v-model="notificationSettings.promotion"
                            class="sr-only peer"
                          />
                          <div class="toggle-track"></div>
                        </div>
                      </label>
                    </div>

                    <div class="form-actions">
                      <button
                        @click="updateNotifications"
                        :disabled="loading"
                        class="btn-update"
                      >
                        <span class="material-symbols-outlined">save</span>
                        {{
                          loading
                            ? t("profilePage.actions.saving")
                            : t("profilePage.actions.savePreferences")
                        }}
                      </button>
                    </div>
                  </div>
                </section>
              </div>

              <!-- Empty Tabs for now -->
              <div
                v-if="['documents'].includes(activeTab)"
                class="tab-pane tab-pane--empty"
              >
                <div class="empty-state">
                  <span class="material-symbols-outlined">construction</span>
                  <p>
                    {{
                      t("profilePage.actions.documentsComingSoon", {
                        tab: activeTabLabel,
                      })
                    }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: "auth" });
import {
  ref,
  watch,
  computed,
  onMounted,
  onBeforeUnmount,
  nextTick,
} from "vue";
import { useRoute, useRouter } from "vue-router";
import type { PaymentMethod } from "~/types/models";
import { useAuth } from "~/composables/useAuth";
import { useAppToast } from "~/composables/useAppToast";
import {
  getCountries,
  getCountryCallingCode,
  isValidPhoneNumber,
  parsePhoneNumberFromString,
  validatePhoneNumberLength,
  type CountryCode,
} from "libphonenumber-js";
import phoneExamplesData from "libphonenumber-js/examples.mobile";

const route = useRoute();
const router = useRouter();
const { t, currentLocale } = useAppI18n();
const {
  currentProfile,
  updateProfile,
  createPaymentMethod,
  confirmPaymentMethodSession,
  updatePaymentMethod,
  removePaymentMethod,
  loading,
} = useAuth();
const { success: toastSuccess, error: toastError, warn: toastWarn } = useAppToast();

type ProfileTabId =
  | "account"
  | "travel"
  | "documents"
  | "billing"
  | "notifications";

const legacyTabMap: Record<string, ProfileTabId> = {
  account: "account",
  "account settings": "account",
  travel: "travel",
  "travel preferences": "travel",
  documents: "documents",
  billing: "billing",
  notifications: "notifications",
};

const activeTab = ref<ProfileTabId>("account");
const defaultPhoneCountry: CountryCode = "TN";
const phoneExamples = phoneExamplesData as Record<string, string>;

type PhoneCountry = {
  code: CountryCode;
  dialCode: string;
  name: string;
  flagUrl: string;
};

const DisplayNamesCtor = (Intl as any).DisplayNames as
  | (new (
      locales?: string | string[],
      options?: { type: "region" },
    ) => { of: (code: string) => string | undefined })
  | undefined;
const tabItems = computed(() => [
  { id: "account" as const, label: t("profilePage.tabs.account") },
  { id: "travel" as const, label: t("profilePage.tabs.travel") },
  { id: "documents" as const, label: t("profilePage.tabs.documents") },
  { id: "billing" as const, label: t("profilePage.tabs.billing") },
  {
    id: "notifications" as const,
    label: t("profilePage.tabs.notifications"),
  },
]);
const activeTabLabel = computed(
  () => tabItems.value.find((tab) => tab.id === activeTab.value)?.label ?? "",
);
const phoneCountries = computed<PhoneCountry[]>(() => {
  const regionNameFormatter = DisplayNamesCtor
    ? new DisplayNamesCtor([currentLocale.value.intlLocale], {
        type: "region",
      })
    : null;

  return getCountries()
    .map((code) => {
      const countryCode = code as CountryCode;
      return {
        code: countryCode,
        dialCode: getCountryCallingCode(countryCode),
        name: regionNameFormatter?.of(countryCode) || countryCode,
        flagUrl: `https://flagcdn.com/24x18/${countryCode.toLowerCase()}.png`,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
});

const selectedPhoneCountry = ref<CountryCode>(defaultPhoneCountry);
const phoneCountryPickerRef = ref<HTMLElement | null>(null);
const phoneCountryMenuRef = ref<HTMLElement | null>(null);
const isPhoneCountryMenuOpen = ref(false);
const phoneCountryMenuStyle = ref<Record<string, string>>({});
const selectedPhoneCountryData = computed(
  () =>
    phoneCountries.value.find(
      (country) => country.code === selectedPhoneCountry.value,
    ) ||
    phoneCountries.value.find(
      (country) => country.code === defaultPhoneCountry,
    ) ||
    null,
);
const selectedPhoneDialPrefix = computed(() => {
  const country = selectedPhoneCountryData.value;
  return country ? `+${country.dialCode}` : "";
});
const selectedPhoneLengthInfo = computed(() => {
  const country = selectedPhoneCountry.value;
  const validLengths: number[] = [];

  for (let length = 2; length <= 15; length += 1) {
    const probe = "9".repeat(length);
    const status = validatePhoneNumberLength(probe, country);
    if (status === undefined) {
      validLengths.push(length);
    }
  }

  if (validLengths.length === 0) {
    return {
      label: t("profilePage.validation.digitsRequired"),
      example: "",
    };
  }

  const min = Math.min(...validLengths);
  const max = Math.max(...validLengths);
  const label =
    min === max
      ? t("profilePage.validation.digits", { count: min })
      : t("profilePage.validation.digitRange", { min, max });
  const example = "0".repeat(min);

  return { label, example };
});
const phonePlaceholder = computed(() => {
  if (!selectedPhoneCountry.value) return "";
  return phoneExamples[selectedPhoneCountry.value] || "";
});

function normalizeSingleTabQuery(
  query: Record<string, any>,
): Record<string, any> {
  const nextQuery = { ...query };
  const rawTab = nextQuery.tab;
  if (Array.isArray(rawTab)) {
    const firstValid = rawTab.find(
      (value) => typeof value === "string" && value.trim().length > 0,
    );
    if (firstValid) {
      nextQuery.tab = firstValid;
    } else {
      delete nextQuery.tab;
    }
  }
  return nextQuery;
}

function normalizeTab(
  value: string | null | undefined,
): ProfileTabId {
  const key = value?.trim().toLowerCase();
  return (key && legacyTabMap[key]) || "account";
}

useHead(() => ({
  title: t("profilePage.metaTitle"),
  meta: [
    {
      name: "description",
      content: t("profilePage.metaDescription"),
    },
  ],
}));

// Handle query param for tabs
onMounted(() => {
  const tabParamRaw = route.query.tab;
  const tabParam = Array.isArray(tabParamRaw)
    ? tabParamRaw[0]?.toString()
    : tabParamRaw?.toString();
  if (tabParam) {
    activeTab.value = normalizeTab(tabParam);
  }

  document.addEventListener("mousedown", handlePhoneCountryOutsideClick);
  void handlePaymentSetupReturn();
});

onBeforeUnmount(() => {
  document.removeEventListener("mousedown", handlePhoneCountryOutsideClick);
  window.removeEventListener("resize", updatePhoneCountryMenuPosition);
  window.removeEventListener("scroll", updatePhoneCountryMenuPosition, true);
});

watch(
  () => route.query.tab,
  (newTab) => {
    if (Array.isArray(newTab)) {
      const nextQuery = normalizeSingleTabQuery(route.query);
      void router.replace({ query: nextQuery });
      if (newTab[0]) {
        activeTab.value = normalizeTab(newTab[0].toString());
      }
      return;
    }
    if (newTab) {
      activeTab.value = normalizeTab(newTab.toString());
    }
  },
);

watch(selectedPhoneCountry, () => {
  let digits = formData.value.phone.replace(/\D/g, "");
  while (
    digits &&
    validatePhoneNumberLength(digits, selectedPhoneCountry.value) === "TOO_LONG"
  ) {
    digits = digits.slice(0, -1);
  }
  formData.value.phone = digits;
  isPhoneCountryMenuOpen.value = false;
});

watch(isPhoneCountryMenuOpen, async (isOpen) => {
  if (isOpen) {
    await nextTick();
    updatePhoneCountryMenuPosition();
    window.addEventListener("resize", updatePhoneCountryMenuPosition);
    window.addEventListener("scroll", updatePhoneCountryMenuPosition, true);
    return;
  }

  window.removeEventListener("resize", updatePhoneCountryMenuPosition);
  window.removeEventListener("scroll", updatePhoneCountryMenuPosition, true);
});

const notificationSettings = ref({ reservation: true, promotion: false });

const travelPrefOptions = computed(() => [
  {
    value: "Luxury",
    label: t("profilePage.travelStyles.luxury"),
  },
  {
    value: "Adventure",
    label: t("profilePage.travelStyles.adventure"),
  },
  {
    value: "Beach",
    label: t("profilePage.travelStyles.beach"),
  },
  {
    value: "City Break",
    label: t("profilePage.travelStyles.cityBreak"),
  },
  {
    value: "Cultural",
    label: t("profilePage.travelStyles.cultural"),
  },
  {
    value: "Eco Travel",
    label: t("profilePage.travelStyles.ecoTravel"),
  },
  {
    value: "Family",
    label: t("profilePage.travelStyles.family"),
  },
  {
    value: "Solo",
    label: t("profilePage.travelStyles.solo"),
  },
  {
    value: "Wellness",
    label: t("profilePage.travelStyles.wellness"),
  },
  {
    value: "Ski",
    label: t("profilePage.travelStyles.ski"),
  },
]);

const formData = ref({
  firstName: "",
  lastName: "",
  phone: "",
  photo: "",
  dateOfBirth: "",
  passportNumber: "",
  bio: "",
  preferredDestinations: [] as string[],
  travelPreferences: [] as string[],
});
const initialProfileSignature = ref("");
const PASSPORT_MIN_LENGTH = 6;
const PASSPORT_MAX_LENGTH = 9;

function sanitizePassportInput(value: string) {
  return value
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, PASSPORT_MAX_LENGTH);
}

function normalizeProfileDraft() {
  const firstName = formData.value.firstName.trim();
  const lastName = formData.value.lastName.trim();
  const phone = normalizePhoneForSave(formData.value.phone);
  const dateOfBirth = formData.value.dateOfBirth.trim();
  const passportNumber = sanitizePassportInput(formData.value.passportNumber.trim());
  const bio = formData.value.bio.trim();
  const preferredDestinations = formData.value.preferredDestinations
    .map((city) => city.trim())
    .filter(Boolean);
  const travelPreferences = formData.value.travelPreferences
    .map((pref) => pref.trim())
    .filter(Boolean);

  return {
    firstName,
    lastName,
    phone,
    dateOfBirth,
    passportNumber,
    bio,
    preferredDestinations,
    travelPreferences,
  };
}

function buildProfileUpdatePayload() {
  const normalized = normalizeProfileDraft();

  return {
    firstName: normalized.firstName,
    lastName: normalized.lastName,
    ...(normalized.phone ? { phone: normalized.phone } : {}),
    ...(normalized.dateOfBirth ? { dateOfBirth: normalized.dateOfBirth } : {}),
    ...(normalized.passportNumber
      ? { passportNumber: normalized.passportNumber }
      : {}),
    ...(normalized.bio ? { bio: normalized.bio } : {}),
    preferredDestinations: normalized.preferredDestinations,
    travelPreferences: normalized.travelPreferences,
  };
}

function profileSignatureFromDraft() {
  return JSON.stringify(normalizeProfileDraft());
}

const hasProfileChanges = computed(
  () => profileSignatureFromDraft() !== initialProfileSignature.value,
);

const phoneValidationMessage = computed(() => {
  const digits = formData.value.phone.replace(/\D/g, "");
  if (!digits) {
    return "";
  }

  const currentCountry = selectedPhoneCountry.value;
  const lengthStatus = validatePhoneNumberLength(digits, currentCountry);
  const countryName =
    selectedPhoneCountryData.value?.name ||
    t("profilePage.validation.selectedCountry");

  if (lengthStatus === "TOO_SHORT") {
    return t("profilePage.validation.numberTooShort", {
      country: countryName,
    });
  }

  if (lengthStatus === "TOO_LONG") {
    return t("profilePage.validation.numberTooLong", {
      country: countryName,
    });
  }

  if (lengthStatus === "INVALID_LENGTH") {
    return t("profilePage.validation.invalidNumberLength", {
      country: countryName,
    });
  }

  const fullNumber = `+${getCountryCallingCode(currentCountry)}${digits}`;
  if (!isValidPhoneNumber(fullNumber)) {
    return t("profilePage.validation.invalidPhone", {
      country: countryName,
    });
  }

  return "";
});
const passportValidationMessage = computed(() => {
  const passport = sanitizePassportInput(formData.value.passportNumber.trim());
  if (!passport) {
    return "";
  }

  if (passport.length < PASSPORT_MIN_LENGTH || passport.length > PASSPORT_MAX_LENGTH) {
    return t("profilePage.validation.passportLength", {
      min: PASSPORT_MIN_LENGTH,
      max: PASSPORT_MAX_LENGTH,
    });
  }

  const hasLetter = /[A-Z]/.test(passport);
  const hasDigit = /\d/.test(passport);
  if (!hasLetter || !hasDigit) {
    return t("profilePage.validation.passportFormat");
  }

  return "";
});
const paymentSetupLoading = ref(false);
const paymentSetupFeedback = ref<{ type: "success" | "error"; message: string }>({
  type: "success",
  message: "",
});
const paymentMethods = computed(
  () => currentProfile.value?.paymentMethods ?? [],
);

watch(
  currentProfile,
  (profile) => {
    if (profile) {
      const phoneData = normalizePhoneInput(profile.phone || "");
      formData.value = {
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        phone: phoneData.national,
        dateOfBirth: profile.dateOfBirth || "",
        passportNumber: sanitizePassportInput(profile.passportNumber || ""),
        bio: profile.bio || "",
        preferredDestinations: profile.preferredDestinations || [],
        travelPreferences: profile.travelPreferences || [],
      };
      selectedPhoneCountry.value = phoneData.country;
      notificationSettings.value = {
        reservation: profile.notificationsReservation,
        promotion: profile.notificationsPromotion,
      };
      initialProfileSignature.value = profileSignatureFromDraft();
    }
  },
  { immediate: true },
);

async function saveProfile() {
  if (!hasProfileChanges.value) {
    return;
  }

  if (formData.value.phone && phoneValidationMessage.value) {
    toastWarn(phoneValidationMessage.value);
    return;
  }
  if (formData.value.passportNumber && passportValidationMessage.value) {
    toastWarn(passportValidationMessage.value);
    return;
  }

  const success = await updateProfile(buildProfileUpdatePayload());
  if (success) {
    initialProfileSignature.value = profileSignatureFromDraft();
    toastSuccess(t("profilePage.feedback.profileUpdated"));
  } else {
    toastError(t("profilePage.feedback.profileUpdateFailed"));
  }
}

async function updateNotifications() {
  const success = await updateProfile({
    notificationsReservation: notificationSettings.value.reservation,
    notificationsPromotion: notificationSettings.value.promotion,
  });
  if (success) {
    toastSuccess(t("profilePage.feedback.notificationsUpdated"));
  } else {
    toastError(t("profilePage.feedback.preferencesUpdateFailed"));
  }
}

// ─── Field State Logic ───

async function startStripePaymentMethodSetup() {
  paymentSetupFeedback.value = { type: "success", message: "" };
  paymentSetupLoading.value = true;
  try {
    const session = await createPaymentMethod({
      isDefault: paymentMethods.value.length === 0,
    });
    if (!session?.url) {
      paymentSetupFeedback.value = {
        type: "error",
        message: t("profilePage.feedback.unableOpenStripe"),
      };
      return;
    }

    if (import.meta.client) {
      window.location.href = session.url;
    }
  } finally {
    paymentSetupLoading.value = false;
  }
}

async function handlePaymentSetupReturn() {
  const setupStatus = route.query.setup?.toString();
  const sessionId = route.query.session_id?.toString();

  if (setupStatus === "cancel") {
    paymentSetupFeedback.value = {
      type: "error",
      message: t("profilePage.feedback.cardSetupCancelled"),
    };
    const nextQuery = normalizeSingleTabQuery(route.query);
    delete nextQuery.setup;
    await router.replace({ query: nextQuery });
    return;
  }

  if (!sessionId) {
    return;
  }

  paymentSetupLoading.value = true;
  const success = await confirmPaymentMethodSession(sessionId);
  paymentSetupLoading.value = false;

  paymentSetupFeedback.value = success
    ? {
        type: "success",
        message: t("profilePage.feedback.paymentMethodAdded"),
      }
    : {
        type: "error",
        message: t("profilePage.feedback.paymentMethodConfirmFailed"),
      };

  const nextQuery = normalizeSingleTabQuery(route.query);
  delete nextQuery.session_id;
  delete nextQuery.setup;
  await router.replace({ query: nextQuery });
}

async function setDefaultPaymentMethod(paymentMethodId: number) {
  const success = await updatePaymentMethod(paymentMethodId, {
    isDefault: true,
  });
  if (!success) {
    toastError(t("profilePage.feedback.paymentMethodUpdateFailed"));
    return;
  }
  toastSuccess(t("profilePage.feedback.paymentMethodUpdated"));
}

async function deletePaymentMethod(paymentMethodId: number) {
  const success = await removePaymentMethod(paymentMethodId);
  if (!success) {
    toastError(t("profilePage.feedback.paymentMethodRemoveFailed"));
    return;
  }
  toastSuccess(t("profilePage.feedback.paymentMethodRemoved"));
}

function hasValue(val: any) {
  if (val === null || val === undefined) return false;
  if (typeof val === "string") return val.trim().length > 0;
  if (Array.isArray(val)) return val.length > 0;
  return Boolean(val);
}

function getFieldState(key: string, value: any) {
  if (key === "phone") {
    if (!hasValue(value)) return "form-group--incomplete";
    return phoneValidationMessage.value
      ? "form-group--incomplete"
      : "form-group--completed";
  }
  if (key === "passportNumber") {
    if (!hasValue(value)) return "form-group--incomplete";
    return passportValidationMessage.value
      ? "form-group--incomplete"
      : "form-group--completed";
  }
  if (hasValue(value)) return "form-group--completed";
  return "form-group--incomplete";
}

function getFieldStatusText(key: string, value: any) {
  if (key === "phone") {
    if (!hasValue(value)) return t("profilePage.states.missingInformation");
    return phoneValidationMessage.value
      ? t("profilePage.states.invalidNumber")
      : t("profilePage.states.completed");
  }
  if (key === "passportNumber") {
    if (!hasValue(value)) return t("profilePage.states.missingInformation");
    return passportValidationMessage.value
      ? t("profilePage.states.invalidFormat")
      : t("profilePage.states.completed");
  }
  if (hasValue(value)) return t("profilePage.states.completed");
  return t("profilePage.states.missingInformation");
}

function getFieldIcon(key: string, value: any) {
  if (key === "phone") {
    if (hasValue(value) && !phoneValidationMessage.value) return "check_circle";
    return "error";
  }
  if (key === "passportNumber") {
    if (hasValue(value) && !passportValidationMessage.value) return "check_circle";
    return "error";
  }
  if (hasValue(value)) return "check_circle";
  return "error";
}

function onPhoneInput(event: Event) {
  const input = event.target as HTMLInputElement;
  let digits = input.value.replace(/\D/g, "");
  while (
    digits &&
    validatePhoneNumberLength(digits, selectedPhoneCountry.value) === "TOO_LONG"
  ) {
    digits = digits.slice(0, -1);
  }
  formData.value.phone = digits;
}

function onPassportInput(event: Event) {
  const input = event.target as HTMLInputElement;
  const sanitized = sanitizePassportInput(input.value || "");
  formData.value.passportNumber = sanitized;
}

function togglePhoneCountryMenu() {
  isPhoneCountryMenuOpen.value = !isPhoneCountryMenuOpen.value;
}

function selectPhoneCountry(countryCode: CountryCode) {
  selectedPhoneCountry.value = countryCode;
  isPhoneCountryMenuOpen.value = false;
}

function handlePhoneCountryOutsideClick(event: MouseEvent) {
  if (!isPhoneCountryMenuOpen.value || !phoneCountryPickerRef.value) {
    return;
  }

  const target = event.target as Node | null;
  const clickedInsidePicker =
    !!target && phoneCountryPickerRef.value.contains(target);
  const clickedInsideMenu =
    !!target && !!phoneCountryMenuRef.value?.contains(target);
  if (!clickedInsidePicker && !clickedInsideMenu) {
    isPhoneCountryMenuOpen.value = false;
  }
}

function updatePhoneCountryMenuPosition() {
  const anchor = phoneCountryPickerRef.value;
  if (!anchor) {
    return;
  }

  const rect = anchor.getBoundingClientRect();
  phoneCountryMenuStyle.value = {
    left: `${rect.left}px`,
    top: `${rect.bottom + 6}px`,
    width: `${rect.width}px`,
  };
}

function normalizePhoneInput(phone: string): {
  country: CountryCode;
  national: string;
} {
  const trimmed = phone.trim();
  if (!trimmed) {
    return { country: defaultPhoneCountry, national: "" };
  }

  const parsed = parsePhoneNumberFromString(trimmed);
  if (parsed?.country) {
    return {
      country: parsed.country as CountryCode,
      national: parsed.nationalNumber,
    };
  }

  return {
    country: selectedPhoneCountry.value || defaultPhoneCountry,
    national: trimmed.replace(/\D/g, ""),
  };
}

function normalizePhoneForSave(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "";
  return `+${getCountryCallingCode(selectedPhoneCountry.value)}${digits}`;
}

function formatCardBrand(brand: PaymentMethod["brand"]) {
  switch (brand) {
    case "visa":
      return t("profilePage.brands.visa");
    case "mastercard":
      return t("profilePage.brands.mastercard");
    case "amex":
      return t("profilePage.brands.amex");
    case "discover":
      return t("profilePage.brands.discover");
    default:
      return t("profilePage.brands.card");
  }
}
</script>

<style scoped>
/* ──────────────────────────────────────────
   Material Icons
────────────────────────────────────────── */
.material-symbols-outlined {
  font-variation-settings:
    "FILL" 0,
    "wght" 400,
    "GRAD" 0,
    "opsz" 24;
}

/* ──────────────────────────────────────────
   Page shell
────────────────────────────────────────── */
.profile-page {
  min-height: 100vh;
  background: var(--color-bg-soft);
}

.profile-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 32px 80px;
}

/* ──────────────────────────────────────────
   Body layout
────────────────────────────────────────── */
.profile-body {
  display: flex;
  gap: 32px;
  align-items: flex-start;
}
/* Sidebar styles are now in ProfileSidebar.vue */

/* Main Content Layout */

/* ──────────────────────────────────────────
   Main Settings Card & Tabs
────────────────────────────────────────── */
.profile-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.main-settings-card {
  display: flex;
  flex-direction: column;
  padding: 0;
  overflow: visible;
}

.tabs-header {
  display: flex;
  gap: 24px;
  padding: 0 32px;
  border-bottom: 1px solid var(--color-border-soft);
  background: var(--color-surface);
}

.tab-btn {
  background: none;
  border: none;
  padding: 20px 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-muted);
  cursor: pointer;
  position: relative;
  transition: color 0.2s ease;
  white-space: nowrap;
}

.tab-btn:hover {
  color: var(--color-primary-600);
}

.tab-btn--active {
  color: var(--color-primary-600);
}

.tab-btn--active::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--color-primary-600);
  border-radius: 3px 3px 0 0;
}

.tab-content {
  padding: 32px 0;
}

.tab-pane--empty {
  padding: 60px 32px;
  text-align: center;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  color: var(--color-text-muted);
}

.empty-state .material-symbols-outlined {
  font-size: 48px;
  color: var(--color-primary-200);
}

.btn-update {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 32px;
  background: var(--color-primary-600);
  color: #ffffff;
  border: none;
  border-radius: var(--radius-lg);
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 103, 104, 0.2);
}

.btn-update:hover {
  background: var(--color-primary-700);
  transform: translateY(-1px);
}

.btn-update:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-update .material-symbols-outlined {
  font-size: 18px;
}

/* ──────────────────────────────────────────
   Settings Sections (Divided Blocks)
────────────────────────────────────────── */
.settings-section {
  background: var(--color-surface);
  border: 1px solid var(--color-border-soft);
  border-radius: var(--radius-xl);
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.settings-section--allow-overflow {
  overflow: visible;
}

.settings-section:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

.settings-section__header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  background: var(--color-bg-soft);
  border-bottom: 1px solid var(--color-border-soft);
}

.section-icon {
  font-size: 20px;
  color: var(--color-primary-600);
}

.settings-section__title {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-heading);
  margin: 0;
}

.settings-section__body {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Form Styles */
.profile-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-label {
  font-size: 11px;
  font-weight: 800;
  color: var(--color-heading);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.form-input {
  width: 100%;
  padding: 14px 18px;
  background: var(--color-bg-soft);
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-xl);
  font-size: 14px;
  color: var(--color-text);
  transition: all 0.2s ease;
  outline: none;
}

.form-input:focus {
  background: var(--color-surface);
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px rgba(0, 103, 104, 0.12);
}

.form-input--disabled {
  color: var(--color-text-muted);
  cursor: not-allowed;
  opacity: 0.7;
  padding-right: 44px;
}

.form-input--prefix {
  padding-left: 52px;
}
.phone-input-group {
  display: flex;
  align-items: stretch;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-xl);
  background: var(--color-bg-soft);
  overflow: hidden;
  transition: all 0.2s ease;
}

.phone-input-group:focus-within {
  background: var(--color-surface);
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px rgba(0, 103, 104, 0.12);
}

.phone-country-picker {
  background-color: var(--color-surface) !important;
  position: relative;
  flex: 0 0 62px;
  z-index: 30;
}

.phone-country-trigger {
  width: 100%;
  min-height: 52px;
  padding: 8px 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: transparent;
  border: 1.5px solid transparent;
  border-radius: 0;
  font-size: 11px;
  color: var(--color-text);
  outline: none;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s ease;
  .material-symbols-outlined {
    font-size: 20px !important;
  }
}

.phone-country-trigger:hover {
  background: transparent;
  border-color: var(--color-border);
}

.phone-country-trigger:focus {
  background: var(--color-surface);
  box-shadow: none;
}

.phone-country-trigger__text {
  flex: 0 0 auto;
  min-width: 0;
  font-weight: 800;
  letter-spacing: 0.04em;
}

.phone-country-menu {
  position: fixed;
  min-width: 220px;
  max-height: 280px;
  overflow: auto;
  z-index: 4000;
  background: var(--color-surface);
  border: 1px solid var(--color-border-soft);
  border-radius: var(--radius-xl);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.12);
  padding: 6px;
}

.phone-country-option {
  width: 100%;
  border: none;
  background: transparent;
  border-radius: 10px;
  padding: 8px 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: var(--color-text);
  cursor: pointer;
  text-align: left;
}

.phone-country-option:hover {
  background: var(--color-bg-soft);
}

.phone-country-flag {
  width: 20px;
  height: 15px;
  border-radius: 2px;
  object-fit: cover;
  flex-shrink: 0;
}

.phone-country-flag--trigger {
  width: 28px;
  height: 20px;
}
.input-icon-wrap {
  position: relative;
}

.phone-input-group .input-icon-wrap {
  flex: 1;
}

.form-input--phone {
  min-height: 52px;
  border: none;
  border-radius: 0;
  background: transparent;
  padding-left: 72px;
  padding-right: 46px;
  font-size: 14px;
}

.form-input--phone:focus {
  border: none;
  background: transparent;
  box-shadow: none;
}

.form-input--phone::placeholder {
  font-size: 13px;
}

.form-group--completed .form-input--phone,
.form-group--incomplete .form-input--phone {
  border: none;
  background: transparent;
}

.phone-dial-prefix {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 13px;
  font-weight: 800;
  color: var(--color-text-muted);
  pointer-events: none;
  z-index: 2;
}
.input-prefix {
  position: absolute;
  left: 18px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  font-weight: 700;
  color: var(--color-text-muted);
  z-index: 1;
}

.input-icon {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 20px;
  color: var(--color-text-muted);
  pointer-events: none;
  z-index: 2;
}

.field-status-text {
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.form-group--completed .field-status-text {
  color: var(--color-success-400);
  opacity: 1;
}
.form-group--incomplete .field-status-text {
  color: var(--color-warning-600);
  opacity: 1;
}

.state-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 18px;
  pointer-events: none;
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform: translateY(-50%) scale(0.5);
  z-index: 2;
}

input[type="date"] ~ .state-icon {
  right: 36px;
}

.form-group--completed .state-icon,
.form-group--incomplete .state-icon {
  opacity: 1;
  transform: translateY(-50%) scale(1);
}

.form-group--completed .state-icon {
  color: var(--color-success-600);
}
.form-group--incomplete .state-icon {
  color: var(--color-warning-600);
}

.form-group--completed .form-input {
  border-color: #10b981;
  background: var(--color-success-25);
}
.form-group--incomplete .form-input {
  border-color: #f59e0b;
  background: var(--color-warning-25);
}

.form-actions {
  border-top: 1px solid var(--color-border-soft);
  display: flex;
  justify-content: flex-end;
}

/* ──────────────────────────────────────────
   Billing Styles (Empty Vault)
────────────────────────────────────────── */
.form-row--compact {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.billing-toolbar {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.billing-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-heading);
}

.billing-subtitle {
  margin: 6px 0 0;
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

.payment-methods-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.payment-card {
  border: 1px solid var(--color-border-soft);
  border-radius: var(--radius-xl);
  background: linear-gradient(
    180deg,
    var(--color-surface) 0%,
    var(--color-bg-soft) 100%
  );
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.payment-card--default {
  border-color: color-mix(in srgb, var(--color-primary-500) 40%, white 60%);
  box-shadow: 0 10px 24px rgba(0, 103, 104, 0.08);
}

.payment-card__header,
.payment-card__actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.payment-card__meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
  color: var(--color-text-muted);
  font-size: 0.875rem;
}

.payment-card__brand {
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-primary-700);
}

.payment-card__number {
  margin-top: 6px;
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-heading);
}

.payment-card__badge {
  display: inline-flex;
  align-items: center;
  border-radius: var(--radius-full);
  padding: 6px 10px;
  background: var(--color-primary-25);
  color: var(--color-primary-700);
  font-size: 0.75rem;
  font-weight: 700;
}

.payment-card__action {
  border: none;
  background: transparent;
  padding: 0;
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--color-primary-700);
  cursor: pointer;
}

.payment-card__action--danger {
  color: var(--color-danger-600);
}

.payment-form {
  border-top: 1px solid var(--color-border-soft);
  padding-top: 8px;
}

.checkbox-row {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--color-text);
  font-size: 0.9rem;
  font-weight: 600;
}

.form-error {
  margin: 0;
  color: var(--color-danger-600);
  font-size: 0.875rem;
  font-weight: 600;
}

.payment-setup-feedback {
  margin: 4px 0 0;
  font-size: 0.875rem;
  font-weight: 600;
}

.payment-setup-feedback--success {
  color: var(--color-success-600);
}

.payment-setup-feedback--error {
  color: var(--color-danger-600);
}

.empty-vault {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 56px 24px;
  text-align: center;
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-xl);
  background: var(--color-bg-soft);
  gap: 16px;
}

.empty-vault__icon {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-full);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted);
}

.empty-vault__icon .material-symbols-outlined {
  font-size: 28px;
}

.empty-vault__title {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-heading);
  margin: 0;
}

.empty-vault__sub {
  font-size: 12px;
  color: var(--color-text-muted);
  max-width: 280px;
  margin: 0;
}

/* ──────────────────────────────────────────
   Toggle Styles
────────────────────────────────────────── */
.toggle-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.profile-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
}

.profile-header__title {
  display: inline-block;
  padding: 4px 12px;
  background: var(--color-primary-25);
  color: var(--color-primary-700);
  border-radius: var(--radius-full);
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin-bottom: 12px;
}

.toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 24px;
  border-radius: var(--radius-xl);
  background: var(--color-bg-soft);
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
}

.toggle-row:hover {
  background: var(--color-surface);
  border-color: var(--color-border);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}

.toggle-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.toggle-title {
  font-size: 12px;
  font-weight: 700;
  color: var(--color-heading);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.toggle-sub {
  font-size: 11px;
  color: var(--color-text-muted);
}

.toggle-wrap {
  position: relative;
  flex-shrink: 0;
}

.toggle-track {
  width: 44px;
  height: 24px;
  background: var(--color-gray-200);
  border-radius: 20px;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toggle-track::after {
  content: "";
  position: absolute;
  top: 3px;
  left: 3px;
  width: 18px;
  height: 18px;
  background: var(--color-surface);
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.peer:checked + .toggle-track {
  background: var(--color-primary-600);
}

.peer:checked + .toggle-track::after {
  transform: translateX(20px);
}

/* Chips */
.travel-prefs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.pref-chip {
  display: inline-flex;
  align-items: center;
  padding: 7px 14px;
  border-radius: var(--radius-pill);
  border: 1.5px solid var(--color-border);
  background: var(--color-bg-soft);
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
}
.pref-chip--active {
  background: var(--color-success-600);
  border-color: var(--color-success-600);
  color: #ffffff;
}

.badge-verified {
  font-size: 10px;
  font-weight: 700;
  color: var(--color-success-600);
  text-transform: uppercase;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

@media (max-width: 900px) {
  .profile-body {
    flex-direction: column;
  }
  .profile-sidebar {
    width: 100%;
    position: static;
  }
}

@media (max-width: 600px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  .phone-input-group {
    flex-direction: row;
  }
  .phone-country-picker {
    flex-basis: 86px;
  }
  .tabs-header {
    overflow-x: auto;
    padding: 0 16px;
    gap: 16px;
  }
}
</style>
