<template>
  <div class="profile-page">
    <Head>
      <title>My Profile — VoyageHub</title>
      <meta
        name="description"
        content="Manage your VoyageHub profile and preferences."
      />
    </Head>

    <div class="profile-container">
      <!-- Page Header -->
      <header class="profile-header">
        <span class="profile-header__title">My Profile</span>
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
                v-for="tab in [
                  'Account Settings',
                  'Travel Preferences',
                  'Documents',
                  'Billing',
                  'Notifications',
                ]"
                :key="tab"
                class="tab-btn"
                :class="{ 'tab-btn--active': activeTab === tab }"
                @click="activeTab = tab"
              >
                {{ tab }}
              </button>
            </div>

            <!-- Tab Content -->
            <div class="tab-content">
              <!-- Account Settings Tab -->
              <div v-if="activeTab === 'Account Settings'" class="tab-pane">
                <form @submit.prevent="saveProfile" class="profile-form">
                  <!-- Personal Details Section -->
                  <section
                    class="settings-section settings-section--allow-overflow"
                  >
                    <div class="settings-section__header">
                      <span class="material-symbols-outlined section-icon"
                        >account_circle</span
                      >
                      <h2 class="settings-section__title">Personal Details</h2>
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
                            <label class="form-label">First Name</label>
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
                              placeholder="Nathaniel"
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
                            <label class="form-label">Last Name</label>
                            <span class="field-status-text">{{
                              getFieldStatusText("lastName", formData.lastName)
                            }}</span>
                          </div>
                          <div class="input-icon-wrap">
                            <input
                              type="text"
                              v-model="formData.lastName"
                              class="form-input"
                              placeholder="Poole"
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
                            <label class="form-label">Date of Birth</label>
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
                        Contact Information
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
                            <label class="form-label">Phone Number</label>
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
                                  class="phone-country-flag"
                                  loading="lazy"
                                />
                                <span class="phone-country-trigger__text">
                                  {{ selectedPhoneCountryLabel }}
                                </span>
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
                            <label class="form-label">Email Address</label>
                            <span class="badge-verified">Verified</span>
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
                      <h2 class="settings-section__title">Identification</h2>
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
                            <label class="form-label">Passport Number</label>
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
                              placeholder="e.g. AB123456"
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
                        </div>
                        <div class="form-group"></div>
                      </div>
                    </div>
                  </section>

                  <div class="form-actions">
                    <button
                      type="submit"
                      :disabled="loading"
                      class="btn-update"
                    >
                      {{ loading ? "Updating..." : "Update Profile" }}
                    </button>
                  </div>
                </form>
              </div>

              <!-- Travel Preferences Tab -->
              <div v-if="activeTab === 'Travel Preferences'" class="tab-pane">
                <form @submit.prevent="saveProfile" class="profile-form">
                  <!-- Bio Section -->
                  <section class="settings-section">
                    <div class="settings-section__header">
                      <span class="material-symbols-outlined section-icon"
                        >description</span
                      >
                      <h2 class="settings-section__title">Bio & About Me</h2>
                    </div>
                    <div class="settings-section__body">
                      <div
                        class="form-group"
                        :class="getFieldState('bio', formData.bio)"
                      >
                        <div class="form-label-row">
                          <label class="form-label">Bio / About Me</label>
                          <span class="field-status-text">{{
                            getFieldStatusText("bio", formData.bio)
                          }}</span>
                        </div>
                        <textarea
                          v-model="formData.bio"
                          class="form-input form-input--textarea"
                          placeholder="Tell fellow travellers about yourself..."
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
                        Travel Styles & Interests
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
                          <label class="form-label"
                            >Preferred Destinations</label
                          >
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
                          placeholder="Paris, Bali, New York..."
                        />
                      </div>

                      <div class="form-group">
                        <label class="form-label">Travel Style</label>
                        <div class="travel-prefs">
                          <label
                            v-for="pref in travelPrefOptions"
                            :key="pref"
                            class="pref-chip"
                            :class="
                              formData.travelPreferences.includes(pref)
                                ? 'pref-chip--active'
                                : ''
                            "
                          >
                            <input
                              type="checkbox"
                              :value="pref"
                              v-model="formData.travelPreferences"
                              class="sr-only"
                            />
                            {{ pref }}
                          </label>
                        </div>
                      </div>
                    </div>
                  </section>

                  <div class="form-actions">
                    <button
                      type="submit"
                      :disabled="loading"
                      class="btn-update"
                    >
                      Update Preferences
                    </button>
                  </div>
                </form>
              </div>

              <!-- Billing Tab -->
              <div v-if="activeTab === 'Billing'" class="tab-pane">
                <section class="settings-section">
                  <div class="settings-section__header">
                    <span class="material-symbols-outlined section-icon"
                      >payments</span
                    >
                    <h2 class="settings-section__title">Payment Methods</h2>
                  </div>
                  <div class="settings-section__body">
                    <div class="billing-toolbar">
                      <div>
                        <h3 class="billing-title">Saved cards</h3>
                        <p class="billing-subtitle">
                          Add at least one payment method to complete your
                          account and speed up checkout.
                        </p>
                      </div>
                      <button
                        type="button"
                        class="btn-update"
                        @click="showPaymentForm = !showPaymentForm"
                      >
                        <span class="material-symbols-outlined">{{
                          showPaymentForm ? "close" : "add"
                        }}</span>
                        {{
                          showPaymentForm
                            ? "Cancel"
                            : paymentMethods.length
                              ? "Add Payment Method"
                              : "Add Your First Card"
                        }}
                      </button>
                    </div>

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
                            Default
                          </span>
                        </div>

                        <div class="payment-card__meta">
                          <span>{{ method.cardholderName }}</span>
                          <span>
                            Expires
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
                            Set default
                          </button>
                          <button
                            type="button"
                            class="payment-card__action payment-card__action--danger"
                            :disabled="loading"
                            @click="deletePaymentMethod(method.id)"
                          >
                            Remove
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
                          No payment methods added yet
                        </h3>
                        <p class="empty-vault__sub">
                          Securely manage your payment options for faster
                          bookings.
                        </p>
                        <button
                          type="button"
                          class="btn-update"
                          @click="showPaymentForm = true"
                        >
                          <span class="material-symbols-outlined">add</span>
                          Add Payment Method
                        </button>
                      </div>
                    </div>

                    <form
                      v-if="showPaymentForm"
                      class="payment-form"
                      @submit.prevent="savePaymentMethod"
                    >
                      <div class="form-row">
                        <div class="form-group">
                          <label class="form-label">Cardholder Name</label>
                          <input
                            v-model="paymentForm.cardholderName"
                            type="text"
                            class="form-input"
                            placeholder="Mohamed Amin"
                          />
                        </div>
                        <div class="form-group">
                          <label class="form-label">Card Brand</label>
                          <select
                            v-model="paymentForm.brand"
                            class="form-input"
                          >
                            <option
                              v-for="brand in paymentBrands"
                              :key="brand.value"
                              :value="brand.value"
                            >
                              {{ brand.label }}
                            </option>
                          </select>
                        </div>
                      </div>

                      <div class="form-row">
                        <div class="form-group">
                          <label class="form-label">Card Number</label>
                          <input
                            v-model="paymentForm.cardNumber"
                            type="text"
                            inputmode="numeric"
                            class="form-input"
                            placeholder="4242424242424242"
                          />
                        </div>
                        <div class="form-row form-row--compact">
                          <div class="form-group">
                            <label class="form-label">Expiry Month</label>
                            <input
                              v-model="paymentForm.expiryMonth"
                              type="number"
                              min="1"
                              max="12"
                              class="form-input"
                              placeholder="08"
                            />
                          </div>
                          <div class="form-group">
                            <label class="form-label">Expiry Year</label>
                            <input
                              v-model="paymentForm.expiryYear"
                              type="number"
                              :min="currentYear"
                              :max="currentYear + 25"
                              class="form-input"
                              placeholder="2030"
                            />
                          </div>
                        </div>
                      </div>

                      <label class="checkbox-row">
                        <input
                          v-model="paymentForm.isDefault"
                          type="checkbox"
                        />
                        <span>Set as default payment method</span>
                      </label>

                      <p v-if="paymentFormError" class="form-error">
                        {{ paymentFormError }}
                      </p>

                      <div class="form-actions">
                        <button
                          type="submit"
                          class="btn-update"
                          :disabled="loading"
                        >
                          {{ loading ? "Saving..." : "Save Payment Method" }}
                        </button>
                      </div>
                    </form>
                  </div>
                </section>
              </div>

              <!-- Notifications Tab -->
              <div v-if="activeTab === 'Notifications'" class="tab-pane">
                <section class="settings-section">
                  <div class="settings-section__header">
                    <span class="material-symbols-outlined section-icon"
                      >notifications</span
                    >
                    <h2 class="settings-section__title">
                      Notification Settings
                    </h2>
                  </div>
                  <div class="settings-section__body">
                    <div class="toggle-list">
                      <label class="toggle-row">
                        <div class="toggle-info">
                          <span class="toggle-title">Reservation Updates</span>
                          <span class="toggle-sub"
                            >Real-time confirmation of changes and
                            cancellations.</span
                          >
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
                          <span class="toggle-title">Exclusive Offers</span>
                          <span class="toggle-sub"
                            >Invitations to new collections and seasonal
                            deals.</span
                          >
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
                        {{ loading ? "Saving..." : "Save Preferences" }}
                      </button>
                    </div>
                  </div>
                </section>
              </div>

              <!-- Empty Tabs for now -->
              <div
                v-if="['Documents'].includes(activeTab)"
                class="tab-pane tab-pane--empty"
              >
                <div class="empty-state">
                  <span class="material-symbols-outlined">construction</span>
                  <p>
                    The <strong>{{ activeTab }}</strong> module is coming soon
                    to VoyageHub.
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
import { useRoute } from "vue-router";
import type { PaymentMethod } from "~/types/models";
import { useAuth } from "~/composables/useAuth";
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
const {
  currentProfile,
  updateProfile,
  createPaymentMethod,
  updatePaymentMethod,
  removePaymentMethod,
  loading,
} = useAuth();
const activeTab = ref("Account Settings");
const currentYear = new Date().getFullYear();
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
const regionNameFormatter = DisplayNamesCtor
  ? new DisplayNamesCtor(["en"], { type: "region" })
  : null;

const phoneCountries: PhoneCountry[] = getCountries()
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

const selectedPhoneCountry = ref<CountryCode>(defaultPhoneCountry);
const phoneCountryPickerRef = ref<HTMLElement | null>(null);
const phoneCountryMenuRef = ref<HTMLElement | null>(null);
const isPhoneCountryMenuOpen = ref(false);
const phoneCountryMenuStyle = ref<Record<string, string>>({});
const selectedPhoneCountryData = computed(
  () =>
    phoneCountries.find(
      (country) => country.code === selectedPhoneCountry.value,
    ) ||
    phoneCountries.find((country) => country.code === defaultPhoneCountry) ||
    null,
);
const selectedPhoneCountryLabel = computed(() => {
  const country = selectedPhoneCountryData.value;
  if (!country) return "";
  return country.code;
});
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
    return { label: "digits required", example: "" };
  }

  const min = Math.min(...validLengths);
  const max = Math.max(...validLengths);
  const label = min === max ? `${min} digits` : `${min}-${max} digits`;
  const example = "0".repeat(min);

  return { label, example };
});
const phonePlaceholder = computed(() => {
  if (!selectedPhoneCountry.value) return "";
  return phoneExamples[selectedPhoneCountry.value] || "";
});

// Handle query param for tabs
onMounted(() => {
  const tabParam = route.query.tab?.toString();
  if (tabParam) {
    activeTab.value = tabParam;
  }

  document.addEventListener("mousedown", handlePhoneCountryOutsideClick);
});

onBeforeUnmount(() => {
  document.removeEventListener("mousedown", handlePhoneCountryOutsideClick);
  window.removeEventListener("resize", updatePhoneCountryMenuPosition);
  window.removeEventListener("scroll", updatePhoneCountryMenuPosition, true);
});

watch(
  () => route.query.tab,
  (newTab) => {
    if (newTab) {
      activeTab.value = newTab.toString();
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

const travelPrefOptions = [
  "Luxury",
  "Adventure",
  "Beach",
  "City Break",
  "Cultural",
  "Eco Travel",
  "Family",
  "Solo",
  "Wellness",
  "Ski",
];

const paymentBrands: { value: PaymentMethod["brand"]; label: string }[] = [
  { value: "visa", label: "Visa" },
  { value: "mastercard", label: "Mastercard" },
  { value: "amex", label: "American Express" },
  { value: "discover", label: "Discover" },
  { value: "other", label: "Other" },
];

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
const phoneValidationMessage = computed(() => {
  const digits = formData.value.phone.replace(/\D/g, "");
  if (!digits) {
    return "";
  }

  const currentCountry = selectedPhoneCountry.value;
  const lengthStatus = validatePhoneNumberLength(digits, currentCountry);
  const countryName =
    selectedPhoneCountryData.value?.name || "selected country";

  if (lengthStatus === "TOO_SHORT") {
    return `Number is too short for ${countryName}.`;
  }

  if (lengthStatus === "TOO_LONG") {
    return `Number is too long for ${countryName}.`;
  }

  if (lengthStatus === "INVALID_LENGTH") {
    return `Invalid number length for ${countryName}.`;
  }

  const fullNumber = `+${getCountryCallingCode(currentCountry)}${digits}`;
  if (!isValidPhoneNumber(fullNumber)) {
    return `Invalid phone number for ${countryName}.`;
  }

  return "";
});
const paymentForm = ref({
  cardholderName: "",
  brand: "visa" as PaymentMethod["brand"],
  cardNumber: "",
  expiryMonth: "",
  expiryYear: "",
  isDefault: true,
});
const paymentFormError = ref("");
const showPaymentForm = ref(false);
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
        passportNumber: profile.passportNumber || "",
        bio: profile.bio || "",
        preferredDestinations: profile.preferredDestinations || [],
        travelPreferences: profile.travelPreferences || [],
      };
      selectedPhoneCountry.value = phoneData.country;
      notificationSettings.value = {
        reservation: profile.notificationsReservation,
        promotion: profile.notificationsPromotion,
      };
    }
  },
  { immediate: true },
);

async function saveProfile() {
  if (formData.value.phone && phoneValidationMessage.value) {
    alert(phoneValidationMessage.value);
    return;
  }

  const success = await updateProfile({
    ...formData.value,
    phone: normalizePhoneForSave(formData.value.phone),
    firstName: formData.value.firstName.trim(),
    lastName: formData.value.lastName.trim(),
    passportNumber: formData.value.passportNumber.trim(),
    bio: formData.value.bio.trim(),
    preferredDestinations: formData.value.preferredDestinations
      .map((city) => city.trim())
      .filter(Boolean),
  });
  if (success) {
    alert("Profile updated successfully!");
  } else {
    alert("Failed to update profile. Please try again.");
  }
}

async function updateNotifications() {
  const success = await updateProfile({
    notificationsReservation: notificationSettings.value.reservation,
    notificationsPromotion: notificationSettings.value.promotion,
  });
  if (success) {
    alert("Notification preferences updated successfully!");
  } else {
    alert("Failed to update preferences. Please try again.");
  }
}

// ─── Field State Logic ───

async function savePaymentMethod() {
  paymentFormError.value = "";

  const digitsOnly = paymentForm.value.cardNumber.replace(/\D/g, "");
  const expiryMonth = Number(paymentForm.value.expiryMonth);
  const expiryYear = Number(paymentForm.value.expiryYear);

  if (!paymentForm.value.cardholderName.trim()) {
    paymentFormError.value = "Cardholder name is required.";
    return;
  }

  if (digitsOnly.length < 12) {
    paymentFormError.value = "Enter a valid card number.";
    return;
  }

  if (!Number.isInteger(expiryMonth) || expiryMonth < 1 || expiryMonth > 12) {
    paymentFormError.value = "Expiry month must be between 1 and 12.";
    return;
  }

  if (!Number.isInteger(expiryYear) || expiryYear < currentYear) {
    paymentFormError.value = "Enter a valid expiry year.";
    return;
  }

  const success = await createPaymentMethod({
    cardholderName: paymentForm.value.cardholderName.trim(),
    brand: paymentForm.value.brand,
    cardNumber: digitsOnly,
    expiryMonth,
    expiryYear,
    isDefault:
      paymentMethods.value.length === 0 ? true : paymentForm.value.isDefault,
  });

  if (success) {
    paymentForm.value = {
      cardholderName: "",
      brand: "visa",
      cardNumber: "",
      expiryMonth: "",
      expiryYear: "",
      isDefault: paymentMethods.value.length === 0,
    };
    showPaymentForm.value = false;
    alert("Payment method saved successfully!");
  } else {
    paymentFormError.value = "Failed to save payment method. Please try again.";
  }
}

async function setDefaultPaymentMethod(paymentMethodId: number) {
  const success = await updatePaymentMethod(paymentMethodId, {
    isDefault: true,
  });
  if (!success) {
    alert("Failed to update payment method.");
  }
}

async function deletePaymentMethod(paymentMethodId: number) {
  const success = await removePaymentMethod(paymentMethodId);
  if (!success) {
    alert("Failed to remove payment method.");
  }
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
  if (hasValue(value)) return "form-group--completed";
  return "form-group--incomplete";
}

function getFieldStatusText(key: string, value: any) {
  if (key === "phone") {
    if (!hasValue(value)) return "Missing information";
    return phoneValidationMessage.value ? "Invalid number" : "Completed";
  }
  if (hasValue(value)) return "Completed";
  return "Missing information";
}

function getFieldIcon(key: string, value: any) {
  if (key === "phone") {
    if (hasValue(value) && !phoneValidationMessage.value) return "check_circle";
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
  const item = paymentBrands.find((entry) => entry.value === brand);
  return item?.label ?? brand.toUpperCase();
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
  background: #ffffff;
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

.btn-update .material-symbols-outlined {
  font-size: 18px;
}

/* ──────────────────────────────────────────
   Settings Sections (Divided Blocks)
────────────────────────────────────────── */
.settings-section {
  background: #ffffff;
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
  gap: 24px;
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
  background: #ffffff;
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
  background: #ffffff;
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px rgba(0, 103, 104, 0.12);
}

.phone-country-picker {
  position: relative;
  flex: 0 0 76px;
  z-index: 30;
  border-right: 1.5px solid var(--color-border);
}

.phone-country-trigger {
  width: 100%;
  min-height: 52px;
  padding: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  background: transparent;
  border: none;
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
  background: #ffffff;
}

.phone-country-trigger:focus {
  background: #ffffff;
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
  background: #ffffff;
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
  font-size: 18px;
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
  font-size: 15px;
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
  padding-top: 24px;
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
  background: linear-gradient(180deg, #ffffff 0%, var(--color-bg-soft) 100%);
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
  background: #ffffff;
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
  background: #ffffff;
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
  background: #ffffff;
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
