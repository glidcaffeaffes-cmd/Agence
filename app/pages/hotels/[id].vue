<template>
  <div class="hotel-detail">
    <div v-if="loading" class="loading-state">
      <span class="material-symbols-outlined rotating">progress_activity</span>
      <p>Loading hotel details...</p>
    </div>

    <template v-else-if="hotel">
      <!-- Top Navigation -->
      <nav class="detail-nav">
        <div class="breadcrumbs">
          <NuxtLink to="/">Home</NuxtLink>
          <span class="material-symbols-outlined separator">chevron_right</span>
          <NuxtLink to="/hotels">Hotels</NuxtLink>
          <span class="material-symbols-outlined separator">chevron_right</span>
          <span class="active">{{ hotel.name }}</span>
        </div>
        <div class="nav-actions">
          <button class="action-btn">
            <span class="material-symbols-outlined">ios_share</span> Share
          </button>
          <button class="action-btn">
            <span class="material-symbols-outlined">favorite</span> Save
          </button>
        </div>
      </nav>

      <!-- Header Section -->
      <header class="detail-header">
        <div class="header-main">
          <div class="title-wrap">
            <h1 class="hotel-title">{{ hotel.name }}</h1>
            <div class="stars">
              <span
                v-for="i in 5"
                :key="i"
                class="material-symbols-outlined"
                :class="{ active: i <= hotel.stars }"
                >star</span
              >
            </div>
          </div>
          <div class="header-meta">
            <div class="location-badge">
              <span class="material-symbols-outlined">location_on</span>
              <span>{{ hotel.city }}, {{ hotel.country }}</span>
              <a href="#map" class="map-link">View on map</a>
            </div>
          </div>
        </div>
      </header>

      <!-- Custom Simple Grid Gallery -->
      <section class="advanced-gallery">
        <div
          class="gallery-grid"
          v-if="hotel.images && hotel.images.length >= 3"
        >
          <div class="main-photo">
            <img :src="hotel.images[0]" :alt="hotel.name" />
          </div>
          <div class="side-photos">
            <div class="photo-wrap">
              <img :src="hotel.images[1]" alt="Interior" />
            </div>
            <div class="photo-wrap relative">
              <img :src="hotel.images[2]" alt="Exterior" />
              <div v-if="hotel.images.length > 3" class="more-photos-overlay">
                <span class="material-symbols-outlined">photo_library</span>
                <span>+{{ hotel.images.length - 3 }} photos</span>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="fallback-gallery">
          <img
            v-if="hotel.images && hotel.images.length > 0"
            :src="hotel.images[0]"
            :alt="hotel.name"
          />
          <span v-else class="material-symbols-outlined"
            >image_not_supported</span
          >
        </div>
      </section>

      <!-- Main Layout -->
      <div class="content-layout">
        <main class="main-content">
          <!-- Overview -->
          <section class="content-section">
            <h2 class="section-title">About this property</h2>
            <p class="hotel-description">{{ hotel.description }}</p>

            <h3 class="subsection-title">Amenities & Services</h3>
            <div class="amenities-grid">
              <div
                class="amenity-item"
                v-for="amenity in hotel?.amenities ||
                defaultAmenities.map((a) => a.label)"
                :key="amenity"
              >
                <span class="material-symbols-outlined">{{
                  getAmenityIcon(amenity)
                }}</span>
                <span>{{ amenity }}</span>
              </div>
            </div>
          </section>

          <!-- Rooms -->
          <section class="content-section">
            <h2 class="section-title" id="rooms">Rooms & Availability</h2>
            <div class="rooms-list">
              <div
                v-for="room in rooms"
                :key="room.id"
                class="premium-room-card"
              >
                <div class="room-image">
                  <img
                    :src="
                      room.image ||
                      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=400&q=80'
                    "
                    alt="Room"
                  />
                </div>
                <div class="room-content">
                  <div class="room-header">
                    <h3>{{ room.type }}</h3>
                    <div class="room-features">
                      <span
                        ><span class="material-symbols-outlined">person</span>Up
                        to {{ room.capacity }} guests</span
                      >
                      <span
                        ><span class="material-symbols-outlined">king_bed</span
                        >1 King Size Bed</span
                      >
                      <span
                        ><span class="material-symbols-outlined"
                          >aspect_ratio</span
                        >32 m²</span
                      >
                    </div>
                  </div>
                  <div class="room-footer">
                    <div class="price-block">
                      <span class="price-val">{{ room.pricePerNight }}€</span>
                      <span class="price-unit">/ night</span>
                    </div>
                    <button
                      v-if="room.status === 'AVAILABLE'"
                      class="book-btn-outline"
                    >
                      Select
                    </button>
                    <button v-else class="book-btn-outline disabled">
                      Unavailable
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Reviews -->
          <section class="content-section no-border border-0">
            <div class="reviews-header-advanced">
              <div>
                <h2 class="section-title m-0">Guest Reviews</h2>
                <p class="reviews-subtitle">
                  Average based on {{ reviews.length }} verified reviews
                </p>
              </div>
              <div class="global-rating-block">
                <span class="rating-score">{{
                  (
                    reviews.reduce((sum, r) => sum + r.rating, 0) /
                      reviews.length || 0
                  ).toFixed(1)
                }}</span>
                <div class="rating-context">
                  <div class="stars-gold">
                    <span v-for="i in 5" class="material-symbols-outlined"
                      >star</span
                    >
                  </div>
                  <span>Excellent</span>
                </div>
              </div>
            </div>

            <!-- Write a Review Form -->
            <div class="feedback-form-container">
              <h3 class="subsection-title">Write a Review</h3>
              <div class="feedback-card">
                <div class="rating-selector mb-3">
                  <span class="rating-label">Your rating:</span>
                  <div class="stars-interactive">
                    <span
                      v-for="i in 5"
                      :key="'star-' + i"
                      class="material-symbols-outlined star-btn"
                      :class="{ active: i <= newReviewRating }"
                      @click="newReviewRating = i"
                      >star</span
                    >
                  </div>
                </div>
                <textarea
                  v-model="newReviewText"
                  class="feedback-textarea"
                  placeholder="Share your experience at this property..."
                  rows="4"
                ></textarea>
                <div class="feedback-actions">
                  <p v-if="submitSuccess" class="submit-success-msg">
                    <span class="material-symbols-outlined">check_circle</span>
                    Your review was submitted!
                  </p>
                  <button
                    class="submit-review-btn"
                    @click="handleSubmitReview"
                    :disabled="!newReviewText.trim() || submitting"
                  >
                    {{ submitting ? "Submitting..." : "Submit Review" }}
                  </button>
                </div>
              </div>
            </div>

            <!-- All Reviews List -->
            <div class="all-reviews-section" v-if="reviews.length > 0">
              <h3 class="subsection-title">
                All Reviews ({{ reviews.length }})
              </h3>
              <div class="reviews-list">
                <div
                  class="review-card"
                  v-for="review in reviews"
                  :key="review.id"
                >
                  <div class="reviewer-prof">
                    <div class="avatar-circle">
                      {{
                        (review.authorName || String(review.accountId))
                          .charAt(0)
                          .toUpperCase()
                      }}
                    </div>
                    <div class="reviewer-meta">
                      <strong>{{
                        review.authorName || `Guest #${review.accountId}`
                      }}</strong>
                      <span>{{
                        new Date(review.publicationDate).toLocaleDateString(
                          "en-US",
                          { year: "numeric", month: "long", day: "numeric" },
                        )
                      }}</span>
                    </div>
                  </div>
                  <div class="review-stars-small">
                    <span
                      v-for="s in 5"
                      :key="s"
                      class="material-symbols-outlined"
                      :class="{ active: s <= review.rating }"
                      >star</span
                    >
                    <span class="review-rating-text"
                      >{{ review.rating }}/5</span
                    >
                  </div>
                  <p class="review-body">{{ review.comment }}</p>
                </div>
              </div>
            </div>
            <div v-else class="no-reviews-msg">
              <span class="material-symbols-outlined">rate_review</span>
              <p>No reviews yet. Be the first to share your experience!</p>
            </div>
          </section>
        </main>

        <!-- Sticky Sidebar -->
        <aside class="sidebar-wrapper">
          <div class="sticky-booking-widget">
            <div class="widget-header">
              <span class="price-display"
                >From <strong>{{ formatEuro(fromPricePerNight) }}</strong>
                <span>/ night</span></span
              >
              <div class="rating-small">
                <span class="material-symbols-outlined">star</span>
                {{ averageRatingDisplay }}
              </div>
            </div>

            <div
              ref="bookingPanelRef"
              class="booking-inputs sidebar-booking-inputs"
            >
              <div class="date-picker-mock booking-date-grid">
                <div class="date-field border-right booking-date-field">
                  <label>CHECK-IN</label>
                  <DatePicker
                    v-model="checkInDate"
                    :manualInput="false"
                    :minDate="today"
                    appendTo="self"
                    placeholder="Select check-in"
                    dateFormat="M d, yy"
                    class="booking-date-picker"
                  />
                </div>
                <div class="date-field booking-date-field">
                  <label>CHECK-OUT</label>
                  <DatePicker
                    v-model="checkOutDate"
                    :manualInput="false"
                    :minDate="checkOutMinDate"
                    appendTo="self"
                    placeholder="Select check-out"
                    dateFormat="M d, yy"
                    class="booking-date-picker"
                  />
                </div>
              </div>
              <div class="guest-picker-mock booking-guest-block">
                <label>GUESTS</label>
                <button
                  type="button"
                  class="guest-trigger"
                  :class="{ 'guest-trigger--open': isGuestPanelOpen }"
                  @click="isGuestPanelOpen = !isGuestPanelOpen"
                >
                  <span class="material-symbols-outlined guest-trigger__icon"
                    >person</span
                  >
                  <span class="guest-trigger__copy">
                    <strong>{{ guestSummary }}</strong>
                    <span>Adults, children</span>
                  </span>
                  <span class="material-symbols-outlined guest-trigger__chevron"
                    >expand_more</span
                  >
                </button>

                <div v-if="isGuestPanelOpen" class="guest-panel">
                  <div class="guest-counter-row">
                    <div class="guest-counter-copy">
                      <strong>Adults</strong>
                      <span>Ages 18 or above</span>
                    </div>
                    <div class="guest-counter-control">
                      <button
                        type="button"
                        class="guest-counter-btn"
                        :disabled="adults <= 1"
                        @click="updateGuestCount('adults', -1)"
                      >
                        −
                      </button>
                      <span>{{ adults }}</span>
                      <button
                        type="button"
                        class="guest-counter-btn"
                        @click="updateGuestCount('adults', 1)"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div class="guest-counter-row">
                    <div class="guest-counter-copy">
                      <strong>Children</strong>
                      <span>Age 0 to 17 years</span>
                    </div>
                    <div class="guest-counter-control">
                      <button
                        type="button"
                        class="guest-counter-btn"
                        :disabled="children <= 0"
                        @click="updateGuestCount('children', -1)"
                      >
                        −
                      </button>
                      <span>{{ children }}</span>
                      <button
                        type="button"
                        class="guest-counter-btn"
                        @click="updateGuestCount('children', 1)"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    class="guest-done-button"
                    @click="isGuestPanelOpen = false"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>

            <button
              class="primary-checkout-btn"
              :disabled="!canCheckAvailability || availabilityLoading"
              @click="handleCheckAvailability"
            >
              {{ availabilityLoading ? "Checking..." : "Check Availability" }}
            </button>
            <p class="no-charge-text">You won't be charged at this point</p>

            <div class="price-breakdown">
              <div class="breakdown-row">
                <span
                  >{{ formatEuro(priceSummary.pricePerNight) }} x
                  {{ priceSummary.nights }} nights</span
                >
                <span>{{ formatEuro(priceSummary.basePrice) }}</span>
              </div>
              <div class="breakdown-row">
                <span>City tax</span>
                <span>{{ formatEuro(priceSummary.cityTax) }}</span>
              </div>
              <div class="breakdown-row total">
                <span>Total</span>
                <span>{{ formatEuro(priceSummary.total) }}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <Teleport to="body">
        <transition name="availability-drawer">
          <div
            v-if="showRoomsDrawer"
            class="availability-overlay"
            @click="closeRoomsDrawer"
          >
            <section class="availability-drawer" @click.stop>
              <header class="availability-drawer-header">
                <div>
                  <h3>Available rooms</h3>
                  <p>{{ selectedDateRangeLabel }} • {{ guestSummary }}</p>
                </div>
                <button
                  type="button"
                  class="availability-close-btn"
                  @click="closeRoomsDrawer"
                >
                  <span class="material-symbols-outlined">close</span>
                </button>
              </header>

              <div v-if="availabilityLoading" class="availability-loading">
                <span class="material-symbols-outlined rotating"
                  >progress_activity</span
                >
                <p>Checking room availability...</p>
              </div>

              <template v-else>
                <div
                  v-if="availability?.available && availability.rooms.length"
                  class="availability-room-list"
                >
                  <article
                    v-for="room in availability.rooms"
                    :key="room.id"
                    class="availability-room-card"
                  >
                    <div class="availability-room-image">
                      <img :src="room.image" :alt="room.title" />
                    </div>
                    <div class="availability-room-content">
                      <h4>{{ room.title }}</h4>
                      <div class="availability-room-meta">
                        <span
                          ><span class="material-symbols-outlined">person</span
                          >Up to {{ room.maxGuests }} guests</span
                        >
                        <span
                          ><span class="material-symbols-outlined"
                            >king_bed</span
                          >{{ room.bedType }}</span
                        >
                        <span
                          ><span class="material-symbols-outlined"
                            >aspect_ratio</span
                          >{{ room.roomSize }} m²</span
                        >
                      </div>
                      <div class="availability-room-footer">
                        <div class="price-block">
                          <span class="price-val">{{
                            formatEuro(room.pricePerNight)
                          }}</span>
                          <span class="price-unit">/ night</span>
                        </div>
                        <button
                          type="button"
                          class="book-btn-outline"
                          @click="handleReserveNow(room)"
                        >
                          Reserve Now
                        </button>
                      </div>
                    </div>
                  </article>
                </div>

                <div v-else class="availability-empty-card">
                  <h4>No rooms available for your selected dates</h4>
                  <p>
                    Unfortunately, we couldn't find available rooms for
                    {{ selectedDateRangeLabel }} for {{ adults }} adult<span
                      v-if="adults > 1"
                      >s</span
                    ><span v-if="children > 0">
                      and {{ children }} child<span v-if="children > 1"
                        >ren</span
                      ></span
                    >. Try changing dates, reducing guests, or viewing similar
                    rooms.
                  </p>
                  <div class="availability-empty-actions">
                    <button
                      type="button"
                      class="book-btn-outline"
                      @click="closeRoomsDrawer"
                    >
                      Modify Search
                    </button>
                    <button
                      type="button"
                      class="primary-checkout-btn view-similar-btn"
                      @click="viewSimilarRooms"
                    >
                      View Similar Rooms
                    </button>
                  </div>
                </div>
              </template>
            </section>
          </div>
        </transition>

        <transition name="availability-drawer">
          <div
            v-if="showBookingDrawer"
            class="availability-overlay"
            @click="closeBookingDrawer"
          >
            <section class="availability-drawer booking-confirm-drawer" @click.stop>
              <header class="availability-drawer-header">
                <div>
                  <h3>Confirm your reservation</h3>
                  <p>{{ selectedDateRangeLabel }} • {{ bookingGuestsLabel }}</p>
                </div>
                <button
                  type="button"
                  class="availability-close-btn"
                  @click="closeBookingDrawer"
                >
                  <span class="material-symbols-outlined">close</span>
                </button>
              </header>

              <div class="booking-confirm-content">
                <article v-if="selectedBookingRoom" class="booking-summary-card">
                  <div class="booking-summary-image">
                    <img :src="selectedBookingRoom.image" :alt="selectedBookingRoom.title" />
                  </div>
                  <div class="booking-summary-info">
                    <h4>{{ selectedBookingRoom.title }}</h4>
                    <p>{{ selectedDateRangeLabel }}</p>
                    <p>{{ bookingGuestsLabel }} • {{ bookingNights }} night<span v-if="bookingNights > 1">s</span></p>
                  </div>
                </article>

                <article class="booking-price-card">
                  <h5>Price summary</h5>
                  <div class="breakdown-row">
                    <span>{{ formatEuro(selectedBookingRoom?.pricePerNight ?? 0) }} x {{ bookingNights }} nights</span>
                    <span>{{ formatEuro(bookingRoomPrice) }}</span>
                  </div>
                  <div class="breakdown-row">
                    <span>Taxes</span>
                    <span>{{ formatEuro(bookingTaxes) }}</span>
                  </div>
                  <div class="breakdown-row total">
                    <span>Total</span>
                    <span>{{ formatEuro(bookingTotal) }}</span>
                  </div>
                </article>

                <article class="booking-form-card">
                  <h5>Guest details</h5>
                  <div class="booking-form-grid">
                    <label class="booking-field">
                      <span>Full Name</span>
                      <input v-model="bookingForm.fullName" type="text" placeholder="Enter your full name" />
                    </label>
                    <label class="booking-field">
                      <span>Email</span>
                      <input v-model="bookingForm.email" type="email" placeholder="Enter your email" />
                    </label>
                    <label class="booking-field">
                      <span>Phone Number</span>
                      <input v-model="bookingForm.phone" type="tel" placeholder="Enter your phone number" />
                    </label>
                    <label class="booking-field booking-field-full">
                      <span>Special Requests (optional)</span>
                      <textarea
                        v-model="bookingForm.specialRequests"
                        rows="3"
                        placeholder="Any special requests for your stay"
                      />
                    </label>
                  </div>
                  <p v-if="bookingFormError" class="booking-error-text">
                    {{ bookingFormError }}
                  </p>
                </article>
              </div>

              <footer class="booking-confirm-footer">
                <button
                  type="button"
                  class="primary-checkout-btn"
                  :disabled="bookingLoading"
                  @click="handleConfirmReservation"
                >
                  {{ bookingLoading ? "Confirming..." : "Confirm Reservation" }}
                </button>
              </footer>
            </section>
          </div>
        </transition>

        <transition name="availability-drawer">
          <div
            v-if="showBookingSuccess && bookingConfirmation"
            class="availability-overlay"
            @click="closeSuccessModal"
          >
            <section class="availability-drawer booking-feedback-drawer" @click.stop>
              <header class="availability-drawer-header">
                <div>
                  <h3>Reservation Confirmed</h3>
                  <p>Your room has been successfully reserved. A confirmation email has been sent.</p>
                </div>
                <button
                  type="button"
                  class="availability-close-btn"
                  @click="closeSuccessModal"
                >
                  <span class="material-symbols-outlined">close</span>
                </button>
              </header>

              <div class="booking-feedback-card">
                <p><strong>Booking reference:</strong> {{ bookingConfirmation.bookingReference }}</p>
                <p><strong>Hotel:</strong> {{ bookingConfirmation.hotelName }}</p>
                <p><strong>Room:</strong> {{ bookingConfirmation.roomName }}</p>
                <p><strong>Dates:</strong> {{ selectedDateRangeLabel }}</p>
                <p><strong>Total:</strong> {{ formatEuro(bookingConfirmation.pricing.total) }}</p>
              </div>

              <div class="availability-empty-actions booking-feedback-actions">
                <button
                  type="button"
                  class="primary-checkout-btn view-similar-btn"
                  @click="navigateTo('/reservations/history')"
                >
                  View My Bookings
                </button>
                <button
                  type="button"
                  class="book-btn-outline"
                  @click="closeSuccessModal"
                >
                  Back to Hotel Page
                </button>
              </div>
            </section>
          </div>
        </transition>

        <transition name="availability-drawer">
          <div
            v-if="showRoomUnavailable"
            class="availability-overlay"
            @click="showRoomUnavailable = false"
          >
            <section class="availability-drawer booking-feedback-drawer" @click.stop>
              <header class="availability-drawer-header">
                <div>
                  <h3>This room is no longer available</h3>
                  <p>Another guest may have booked it. Please choose another available room.</p>
                </div>
                <button
                  type="button"
                  class="availability-close-btn"
                  @click="showRoomUnavailable = false"
                >
                  <span class="material-symbols-outlined">close</span>
                </button>
              </header>

              <div class="availability-empty-actions booking-feedback-actions">
                <button
                  type="button"
                  class="primary-checkout-btn view-similar-btn"
                  @click="openAvailableRoomsFromUnavailable"
                >
                  Back to Available Rooms
                </button>
              </div>
            </section>
          </div>
        </transition>
      </Teleport>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useHotels } from "~/composables/useHotels";
import { useRooms } from "~/composables/useRooms";
import { useAuth } from "~/composables/useAuth";
import { useAuthPrompt } from "~/composables/useAuthPrompt";
import { useReservations } from "~/composables/useReservations";
import type { Hotel } from "~/types/models";
import type {
  BookingConfirmation,
  HotelAvailabilitySummary,
  HotelAvailableRoomOption,
} from "~/types/interfaces";

const route = useRoute();
const { isAuthenticated, currentProfile, accountId } = useAuth();
const authPrompt = useAuthPrompt();
const { getById, checkAvailability: runCheckAvailability } = useHotels();
const { rooms, fetchByHotel } = useRooms();
const { reviews, fetchByHotel: fetchReviews, submitReview } = useReviews();
const {
  createBooking,
  loading: bookingLoading,
  error: bookingApiError,
} = useReservations();

const hotel = ref<Hotel | null>(null);
const loading = ref(true);

const newReviewText = ref("");
const newReviewRating = ref(5);
const submitting = ref(false);
const submitSuccess = ref(false);

async function handleSubmitReview() {
  if (!isAuthenticated.value) {
    authPrompt.open({
      title: "Share your experience",
      message:
        "Please sign in or create an account to leave a review for this hotel.",
      icon: "rate_review",
      eyebrow: "Review access",
      redirectTo: route.fullPath,
    });
    return;
  }

  if (!newReviewText.value.trim() || !hotel.value) return;
  const firstName = currentProfile.value?.firstName?.trim() ?? "";
  const lastName = currentProfile.value?.lastName?.trim() ?? "";
  const authorName = `${firstName} ${lastName}`.trim() || "Anonymous Guest";
  submitting.value = true;
  submitSuccess.value = false;
  await submitReview({
    hotelId: hotel.value.id,
    accountId: currentProfile.value?.accountId,
    authorName,
    rating: newReviewRating.value,
    comment: newReviewText.value,
    visible: true,
  });
  newReviewText.value = "";
  newReviewRating.value = 5;
  submitting.value = false;
  submitSuccess.value = true;
  setTimeout(() => {
    submitSuccess.value = false;
  }, 4000);
}

const today = new Date();
today.setHours(0, 0, 0, 0);

const checkInDate = ref<Date | null>(null);
const checkOutDate = ref<Date | null>(null);
const adults = ref(2);
const children = ref(0);
const isGuestPanelOpen = ref(false);
const bookingPanelRef = ref<HTMLElement | null>(null);

const availabilityLoading = ref(false);
const showRoomsDrawer = ref(false);
const availability = ref<HotelAvailabilitySummary | null>(null);
const selectedRoomId = ref<number | null>(null);
const selectedBookingRoom = ref<HotelAvailableRoomOption | null>(null);
const showBookingDrawer = ref(false);
const showBookingSuccess = ref(false);
const showRoomUnavailable = ref(false);
const bookingConfirmation = ref<BookingConfirmation | null>(null);
const bookingForm = ref({
  fullName: "",
  email: "",
  phone: "",
  specialRequests: "",
});
const bookingFormError = ref("");

function addDays(base: Date, amount: number): Date {
  const next = new Date(base);
  next.setDate(next.getDate() + amount);
  return next;
}

function differenceInNights(checkIn: Date, checkOut: Date): number {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  return Math.max(0, Math.ceil((end.getTime() - start.getTime()) / 86400000));
}

function formatDateForApi(date: Date) {
  return date.toISOString().slice(0, 10);
}

function formatDateForLabel(date: Date | null) {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatEuro(value: number) {
  return `${value}€`;
}

const fromPricePerNight = computed(() => {
  if (!rooms.value.length) return 120;
  return Math.min(...rooms.value.map((room) => room.pricePerNight));
});

const averageRatingDisplay = computed(() => {
  if (!reviews.value.length) return "4.8";
  const average =
    reviews.value.reduce((sum, review) => sum + review.rating, 0) /
    reviews.value.length;
  return average.toFixed(1);
});

const guestSummary = computed(
  () =>
    `${adults.value} adult${adults.value > 1 ? "s" : ""}, ${children.value} children`,
);

const checkOutMinDate = computed(() => {
  if (!checkInDate.value) return addDays(today, 1);
  return addDays(checkInDate.value, 1);
});

const canCheckAvailability = computed(() => {
  return Boolean(
    checkInDate.value &&
    checkOutDate.value &&
    adults.value + children.value > 0,
  );
});

const nightsCount = computed(() => {
  if (!checkInDate.value || !checkOutDate.value) return 0;
  return differenceInNights(checkInDate.value, checkOutDate.value);
});

const selectedRoom = computed(() => {
  if (!availability.value?.rooms.length || selectedRoomId.value == null)
    return null;
  return (
    availability.value.rooms.find((room) => room.id === selectedRoomId.value) ??
    null
  );
});

const selectedPricePerNight = computed(() => {
  if (selectedRoom.value) return selectedRoom.value.pricePerNight;
  if (availability.value?.selectedPricePerNight)
    return availability.value.selectedPricePerNight;
  return fromPricePerNight.value;
});

const priceSummary = computed(() => {
  if (availability.value) {
    const basePrice = selectedPricePerNight.value * availability.value.nights;
    const cityTax = availability.value.cityTax;
    return {
      nights: availability.value.nights,
      pricePerNight: selectedPricePerNight.value,
      basePrice,
      cityTax,
      total: basePrice + cityTax,
    };
  }

  const nights = nightsCount.value;
  const basePrice = selectedPricePerNight.value * nights;
  const cityTax = nights * 5;
  return {
    nights,
    pricePerNight: selectedPricePerNight.value,
    basePrice,
    cityTax,
    total: basePrice + cityTax,
  };
});

const selectedDateRangeLabel = computed(() => {
  const checkIn = formatDateForLabel(checkInDate.value);
  const checkOut = formatDateForLabel(checkOutDate.value);
  if (!checkIn || !checkOut) return "your selected dates";
  return `${checkIn} – ${checkOut}`;
});

const bookingNights = computed(() => availability.value?.nights ?? nightsCount.value);
const bookingRoomPrice = computed(
  () => (selectedBookingRoom.value?.pricePerNight ?? selectedPricePerNight.value) * bookingNights.value,
);
const bookingTaxes = computed(() => availability.value?.cityTax ?? bookingNights.value * 5);
const bookingTotal = computed(() => bookingRoomPrice.value + bookingTaxes.value);
const bookingGuestsLabel = computed(() => {
  const adultsLabel = `${adults.value} adult${adults.value > 1 ? "s" : ""}`;
  if (children.value < 1) {
    return adultsLabel;
  }
  return `${adultsLabel}, ${children.value} child${children.value > 1 ? "ren" : ""}`;
});

function updateGuestCount(type: "adults" | "children", delta: number) {
  if (type === "adults") {
    adults.value = Math.max(1, adults.value + delta);
    return;
  }
  children.value = Math.max(0, children.value + delta);
}

function closeGuestPanelOnOutside(event: MouseEvent) {
  if (!isGuestPanelOpen.value) return;
  if (!(event.target instanceof Node)) return;
  if (!bookingPanelRef.value?.contains(event.target)) {
    isGuestPanelOpen.value = false;
  }
}

function handleGlobalKeydown(event: KeyboardEvent) {
  if (event.key !== "Escape") return;
  isGuestPanelOpen.value = false;
  showRoomsDrawer.value = false;
  showBookingDrawer.value = false;
  showBookingSuccess.value = false;
  showRoomUnavailable.value = false;
}

watch(checkInDate, (value) => {
  if (!value || !checkOutDate.value) return;
  if (checkOutDate.value <= value) {
    checkOutDate.value = addDays(value, 1);
  }
});

watch([checkInDate, checkOutDate, adults, children], () => {
  availability.value = null;
  selectedRoomId.value = null;
  selectedBookingRoom.value = null;
  showBookingDrawer.value = false;
  showBookingSuccess.value = false;
  showRoomUnavailable.value = false;
});

watch(
  () => currentProfile.value,
  () => {
    if (showBookingDrawer.value) {
      prefillBookingForm();
    }
  },
);

async function handleCheckAvailability() {
  if (!hotel.value || !checkInDate.value || !checkOutDate.value) return;

  bookingFormError.value = "";
  showBookingDrawer.value = false;
  showBookingSuccess.value = false;
  showRoomUnavailable.value = false;
  availabilityLoading.value = true;
  showRoomsDrawer.value = true;

  try {
    availability.value = await runCheckAvailability(hotel.value.id, {
      checkIn: formatDateForApi(checkInDate.value),
      checkOut: formatDateForApi(checkOutDate.value),
      adults: adults.value,
      children: children.value,
    });
    selectedRoomId.value = availability.value.rooms[0]?.id ?? null;
    selectedBookingRoom.value =
      availability.value.rooms.find((room) => room.id === selectedRoomId.value) ?? null;
  } finally {
    availabilityLoading.value = false;
  }
}

function prefillBookingForm() {
  const firstName = currentProfile.value?.firstName?.trim() ?? "";
  const lastName = currentProfile.value?.lastName?.trim() ?? "";
  bookingForm.value.fullName = `${firstName} ${lastName}`.trim();
  bookingForm.value.email = currentProfile.value?.email?.trim() ?? "";
  bookingForm.value.phone = currentProfile.value?.phone?.trim() ?? "";
  bookingForm.value.specialRequests = "";
}

function handleReserveNow(room: HotelAvailableRoomOption) {
  selectedRoomId.value = room.id;
  selectedBookingRoom.value = room;
  bookingFormError.value = "";
  prefillBookingForm();
  showRoomsDrawer.value = false;
  showBookingDrawer.value = true;
}

function closeRoomsDrawer() {
  showRoomsDrawer.value = false;
}

function closeBookingDrawer() {
  showBookingDrawer.value = false;
  bookingFormError.value = "";
}

function closeSuccessModal() {
  showBookingSuccess.value = false;
}

async function openAvailableRoomsFromUnavailable() {
  showRoomUnavailable.value = false;
  await handleCheckAvailability();
}

async function handleConfirmReservation() {
  if (
    !hotel.value ||
    !selectedBookingRoom.value ||
    !checkInDate.value ||
    !checkOutDate.value
  ) {
    return;
  }

  if (!isAuthenticated.value || !accountId.value) {
    authPrompt.open({
      title: "Reservation required",
      message: "Please sign in or create an account to confirm your reservation.",
      icon: "hotel",
      eyebrow: "Booking access",
      redirectTo: route.fullPath,
    });
    return;
  }

  const fullName = bookingForm.value.fullName.trim();
  const email = bookingForm.value.email.trim();
  const phone = bookingForm.value.phone.trim();

  if (!fullName || !email || !phone) {
    bookingFormError.value = "Please complete Full Name, Email, and Phone Number.";
    return;
  }

  bookingFormError.value = "";
  const confirmation = await createBooking({
    hotelId: hotel.value.id,
    roomId: selectedBookingRoom.value.id,
    checkIn: formatDateForApi(checkInDate.value),
    checkOut: formatDateForApi(checkOutDate.value),
    adults: adults.value,
    children: children.value,
    fullName,
    email,
    phone,
    specialRequests: bookingForm.value.specialRequests.trim() || undefined,
    accountId: accountId.value,
  });

  if (!confirmation) {
    const reason = bookingApiError.value || "Unable to confirm your reservation.";
    if (reason.toLowerCase().includes("no longer available")) {
      showBookingDrawer.value = false;
      showRoomUnavailable.value = true;
      return;
    }
    bookingFormError.value = reason;
    return;
  }

  bookingConfirmation.value = confirmation;
  showBookingDrawer.value = false;
  showRoomsDrawer.value = false;
  showBookingSuccess.value = true;
}

function viewSimilarRooms() {
  showRoomsDrawer.value = false;
  document
    .getElementById("rooms")
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

const defaultAmenities = [
  { icon: "wifi", label: "Free high-speed Wi-Fi" },
  { icon: "pool", label: "Heated outdoor pool" },
  { icon: "fitness_center", label: "24/7 Fitness center" },
  { icon: "local_bar", label: "Lounge bar & Cocktails" },
  { icon: "restaurant", label: "Gourmet restaurant" },
  { icon: "spa", label: "Spa & wellness center" },
];

function getAmenityIcon(amenity: string) {
  const amenityMap: Record<string, string> = {
    "Free high-speed Wi-Fi": "wifi",
    "Heated outdoor pool": "pool",
    "24/7 Fitness center": "fitness_center",
    "Lounge bar & Cocktails": "local_bar",
    "Gourmet restaurant": "restaurant",
    "Spa & wellness center": "spa",
  };
  return amenityMap[amenity] || "check_circle";
}

onMounted(async () => {
  document.addEventListener("click", closeGuestPanelOnOutside);
  document.addEventListener("keydown", handleGlobalKeydown);
  checkInDate.value = addDays(today, 1);
  checkOutDate.value = addDays(today, 4);

  const id = Number(route.params.id);
  if (!isNaN(id)) {
    const data = await getById(id);
    if (data) {
      hotel.value = data;
      await Promise.all([fetchByHotel(id), fetchReviews(id)]);
    }
  }
  loading.value = false;
});

onBeforeUnmount(() => {
  document.removeEventListener("click", closeGuestPanelOnOutside);
  document.removeEventListener("keydown", handleGlobalKeydown);
});
</script>

<style scoped>
.hotel-detail {
  background: #ffffff;
  min-height: 100vh;
  padding-bottom: 80px;
}

.loading-state {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 60vh;
  color: #015081;
}

.rotating {
  animation: spin 1s linear infinite;
  font-size: 40px;
  margin-bottom: 16px;
}
@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}

/* Nav */
.detail-nav {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 24px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f1f5f9;
}

.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #64748b;
  font-weight: 500;
}

.breadcrumbs a {
  color: #64748b;
  text-decoration: none;
  transition: color 0.2s;
}
.breadcrumbs a:hover {
  color: #015081;
  text-decoration: underline;
}
.breadcrumbs .active {
  color: #015081;
  font-weight: 600;
}
.separator {
  font-size: 16px;
}

.nav-actions {
  display: flex;
  gap: 16px;
}
.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  font-size: 13px;
  font-weight: 600;
  color: #334155;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 6px;
  transition: background 0.2s;
}
.action-btn:hover {
  background: #f1f5f9;
}
.action-btn .material-symbols-outlined {
  font-size: 18px;
}

/* Header */
.detail-header {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.title-wrap {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 8px;
}

.hotel-title {
  font-size: 36px;
  font-weight: 700;
  color: #001d34;
  margin: 0;
}

.stars {
  display: flex;
  gap: 2px;
}
.stars .material-symbols-outlined {
  font-size: 20px;
  color: #e2e8f0;
  font-variation-settings: "FILL" 1;
}
.stars .active {
  color: #cdaf5d;
}

.location-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #475569;
}
.location-badge .material-symbols-outlined {
  font-size: 18px;
  color: #015081;
}
.map-link {
  font-weight: 600;
  color: #008f90;
  text-decoration: underline;
  margin-left: 8px;
  cursor: pointer;
}

/* Gallery */
.advanced-gallery {
  max-width: 1200px;
  margin: 0 auto 40px;
  padding: 0 24px;
}

.gallery-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 12px;
  border-radius: 16px;
  overflow: hidden;
  height: 480px;
}

.main-photo {
  height: 100%;
}
.main-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
  cursor: pointer;
}
.main-photo:hover img {
  transform: scale(1.02);
}

.side-photos {
  display: grid;
  grid-template-rows: 1fr 1fr;
  gap: 12px;
}

.photo-wrap {
  overflow: hidden;
  position: relative;
  cursor: pointer;
  height: 100%;
  border-radius: 8px;
}
.photo-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.photo-wrap:hover img {
  transform: scale(1.02);
}

.relative {
  position: relative;
}

.more-photos-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  font-weight: 700;
  font-size: 16px;
  gap: 8px;
  transition: background 0.3s;
}
.more-photos-overlay:hover {
  background: rgba(0, 0, 0, 0.5);
}
.more-photos-overlay .material-symbols-outlined {
  font-size: 32px;
}

.fallback-gallery {
  height: 480px;
  background: #f8fafc;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #cbd5e1;
}
.fallback-gallery img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.fallback-gallery .material-symbols-outlined {
  font-size: 64px;
}

/* Content Layout */
.content-layout {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 48px;
}

@media (max-width: 1024px) {
  .content-layout {
    grid-template-columns: 1fr;
  }
}

.content-section {
  padding-bottom: 24px;
  margin-bottom: 24px;
  border-bottom: 1px solid #e2e8f0;
}

.section-title {
  font-size: 22px;
  color: #001d34;
  margin-bottom: 16px;
  font-weight: 700;
}

.hotel-description {
  font-size: 15px;
  line-height: 1.6;
  color: #334155;
  margin-bottom: 24px;
}

.subsection-title {
  font-size: 16px;
  font-weight: 700;
  color: #015081;
  margin-bottom: 20px;
}

.amenities-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.amenity-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 15px;
  color: #334155;
}
.amenity-item .material-symbols-outlined {
  color: #008f90;
  font-size: 24px;
}

/* Rooms List */
.premium-room-card {
  display: flex;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 16px;
  transition:
    box-shadow 0.2s ease,
    border-color 0.2s ease;
  background: white;
}
.premium-room-card:hover {
  box-shadow: 0 4px 12px rgba(1, 80, 129, 0.08); /* Reduced hover intensity */
  border-color: #cbd5e1;
}

.room-image {
  width: 220px;
  flex-shrink: 0;
}
.room-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.room-content {
  padding: 16px 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.room-header h3 {
  font-size: 18px;
  color: #015081;
  margin: 0 0 12px 0;
  font-weight: 700;
}
.room-features {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}
.room-features span {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #475569;
}
.room-features .material-symbols-outlined {
  font-size: 18px;
  color: #94a3b8;
}

.room-footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 24px;
}
.price-val {
  font-size: 24px;
  font-weight: 800;
  color: #008f90;
}
.price-unit {
  font-size: 13px;
  color: #64748b;
  margin-left: 4px;
}

.book-btn-outline {
  padding: 10px 24px;
  border: 2px solid #008f90;
  background: white;
  color: #008f90;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}
.book-btn-outline:hover {
  background: #008f90;
  color: white;
}
.book-btn-outline.disabled {
  border-color: #cbd5e1;
  color: #94a3b8;
  cursor: not-allowed;
}
.book-btn-outline.disabled:hover {
  background: white;
  color: #94a3b8;
}

/* Reviews & Ratings (Notes) */
.reviews-header-advanced {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.reviews-subtitle {
  color: #64748b;
  font-size: 13px;
  margin-top: 4px;
}
.m-0 {
  margin: 0;
}

.global-rating-block {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #fdfbf7;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid #f6ecd6;
}
.rating-score {
  font-size: 36px;
  font-weight: 800;
  color: #001d34;
  line-height: 1;
}
.stars-gold {
  display: flex;
  margin-bottom: 2px;
}
.stars-gold .material-symbols-outlined {
  color: #cdaf5d;
  font-variation-settings: "FILL" 1;
  font-size: 16px;
}
.rating-context {
  display: flex;
  flex-direction: column;
}
.rating-context span {
  font-weight: 700;
  font-size: 13px;
  color: #334155;
}

.reviews-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
}
.review-card {
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #f1f5f9;
  transition: box-shadow 0.2s ease;
  margin-bottom: 12px;
}
.review-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  border-color: #e2e8f0;
}
.reviewer-prof {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}
.avatar-circle {
  width: 40px;
  height: 40px;
  background: #015081;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
  flex-shrink: 0;
}
.reviewer-meta strong {
  display: block;
  font-size: 14px;
  color: #001d34;
  font-weight: 600;
}
.reviewer-meta span {
  font-size: 12px;
  color: #64748b;
}
.review-stars-small {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 10px;
}
.review-stars-small .material-symbols-outlined {
  font-size: 15px;
  color: #e2e8f0;
  font-variation-settings: "FILL" 1;
}
.review-stars-small .material-symbols-outlined.active {
  color: #cdaf5d;
}
.review-rating-text {
  font-size: 12px;
  font-weight: 700;
  color: #64748b;
  margin-left: 4px;
}
.review-body {
  font-size: 14px;
  line-height: 1.6;
  color: #334155;
  margin: 0;
}

.all-reviews-section {
  margin-top: 32px;
}
.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.no-reviews-msg {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 40px 20px;
  color: #94a3b8;
  text-align: center;
}
.no-reviews-msg .material-symbols-outlined {
  font-size: 40px;
}
.no-reviews-msg p {
  font-size: 14px;
  margin: 0;
}

/* Feedback Form */
.mb-3 {
  margin-bottom: 12px;
}
.rating-label {
  font-size: 14px;
  font-weight: 600;
  color: #001d34;
  margin-right: 10px;
}

.feedback-form-container {
  margin-top: 28px;
  border-top: 1px solid #e2e8f0;
  padding-top: 24px;
}
.feedback-card {
  background: #f8fafc;
  border: 1px solid #f1f5f9;
  border-radius: 12px;
  padding: 20px;
}
.rating-selector {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}
.stars-interactive {
  display: flex;
  gap: 4px;
}
.star-btn {
  font-size: 26px;
  color: #e2e8f0;
  font-variation-settings: "FILL" 1;
  cursor: pointer;
  transition:
    color 0.15s,
    transform 0.15s;
}
.star-btn.active {
  color: #cdaf5d;
}
.star-btn:hover {
  transform: scale(1.15);
  color: #cdaf5d;
}
.feedback-textarea {
  width: 100%;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  color: #334155;
  font-family: inherit;
  resize: vertical;
  margin-bottom: 12px;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
  outline: none;
  box-sizing: border-box;
}
.feedback-textarea:focus {
  border-color: #008f90;
  box-shadow: 0 0 0 3px rgba(0, 143, 144, 0.1);
}
.feedback-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.submit-review-btn {
  background: #008f90;
  color: white;
  border: none;
  padding: 10px 22px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  margin-left: auto;
}
.submit-review-btn:hover:not(:disabled) {
  background: #007677;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 143, 144, 0.25);
}
.submit-review-btn:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
  opacity: 0.7;
  transform: none;
}
.submit-success-msg {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #008f90;
  font-size: 13px;
  font-weight: 600;
}
.submit-success-msg .material-symbols-outlined {
  font-size: 18px;
}

/* Sticky Sidebar Widget */
.sidebar-wrapper {
  position: relative;
}
.sticky-booking-widget {
  position: sticky;
  top: 32px;
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 20px 40px rgba(1, 80, 129, 0.08);
  border: 1px solid #e2e8f0;
}

.widget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.price-display {
  font-size: 14px;
  color: #334155;
}
.price-display strong {
  font-size: 24px;
  font-weight: 800;
  color: #001d34;
  margin: 0 2px;
}
.rating-small {
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 700;
  font-size: 14px;
}
.rating-small .material-symbols-outlined {
  font-size: 16px;
  color: #cdaf5d;
  font-variation-settings: "FILL" 1;
}

.booking-inputs {
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  margin-bottom: 16px;
  overflow: visible;
  background: #fff;
}
.sidebar-booking-inputs {
  position: relative;
  z-index: 30;
}
.booking-date-grid {
  display: flex;
  border-bottom: 1px solid #cbd5e1;
}
.booking-date-field {
  padding: 12px;
}
.date-field {
  flex: 1;
  transition: background 0.2s;
}
.date-field:hover {
  background: #f8fafc;
}
.border-right {
  border-right: 1px solid #cbd5e1;
}
.date-field label {
  display: block;
  font-size: 10px;
  font-weight: 800;
  color: #015081;
  margin-bottom: 4px;
  cursor: pointer;
  letter-spacing: 0.04em;
}

:deep(.booking-date-picker .p-inputtext) {
  width: 100%;
  border: none;
  background: transparent;
  padding: 0;
  font-size: 14px;
  color: #334155;
  font-weight: 500;
  box-shadow: none;
}

:deep(.booking-date-picker .p-datepicker-input-icon-container),
:deep(.booking-date-picker .p-datepicker-trigger) {
  display: none;
}

:deep(.booking-date-picker .p-datepicker) {
  width: 100%;
}

:deep(.booking-date-picker .p-datepicker-panel) {
  z-index: 80 !important;
  margin-top: 6px;
  background: #ffffff !important;
  border: 1px solid #cbd5e1 !important;
  border-radius: 14px !important;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.22) !important;
  padding: 0.7rem !important;
  min-width: 18rem;
}

:deep(.booking-date-picker .p-datepicker-header) {
  border-bottom: 1px solid #e2e8f0;
  padding: 0.2rem 0.35rem 0.55rem;
  margin-bottom: 0.25rem;
}

:deep(.booking-date-picker .p-datepicker-title) {
  font-size: 0.95rem;
  font-weight: 800;
  color: #001d34;
}

:deep(.booking-date-picker .p-datepicker-weekday) {
  font-size: 0.72rem;
  font-weight: 700;
  color: #64748b;
}

:deep(.booking-date-picker .p-datepicker-day) {
  width: 2rem;
  height: 2rem;
  border-radius: 8px;
  font-size: 0.88rem;
  font-weight: 600;
}

:deep(.booking-date-picker .p-datepicker-day:hover) {
  background: #f1f5f9;
}

:deep(.booking-date-picker .p-datepicker-day-selected),
:deep(.booking-date-picker .p-datepicker-day-selected-start),
:deep(.booking-date-picker .p-datepicker-day-selected-end) {
  background: #008f90 !important;
  color: #ffffff !important;
}

.booking-guest-block {
  padding: 12px;
  display: flex;
  flex-direction: column;
  position: relative;
}
.booking-guest-block label {
  font-size: 10px;
  font-weight: 800;
  color: #015081;
  margin-bottom: 4px;
  letter-spacing: 0.04em;
}

.guest-trigger {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: #334155;
  cursor: pointer;
  text-align: left;
  padding: 0;
}

.guest-trigger__icon {
  font-size: 18px;
  color: #64748b;
}
.guest-trigger__copy {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.guest-trigger__copy strong {
  font-size: 14px;
  font-weight: 600;
  color: #334155;
  line-height: 1.2;
}
.guest-trigger__copy span {
  font-size: 12px;
  color: #94a3b8;
  line-height: 1.2;
}
.guest-trigger__chevron {
  font-size: 18px;
  color: #64748b;
  transition: transform 0.2s;
}
.guest-trigger--open .guest-trigger__chevron {
  transform: rotate(180deg);
}

.guest-panel {
  margin-top: 12px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 12px 24px rgba(1, 80, 129, 0.08);
}

.guest-counter-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.guest-counter-copy {
  display: flex;
  flex-direction: column;
}
.guest-counter-copy strong {
  font-size: 14px;
  color: #001d34;
  line-height: 1.2;
}
.guest-counter-copy span {
  font-size: 12px;
  color: #64748b;
  line-height: 1.2;
}

.guest-counter-control {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 700;
  color: #001d34;
}

.guest-counter-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid #cbd5e1;
  background: #fff;
  color: #001d34;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
}

.guest-counter-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.guest-done-button {
  align-self: flex-end;
  border: 1px solid #008f90;
  background: #fff;
  color: #008f90;
  border-radius: 8px;
  padding: 6px 14px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

.primary-checkout-btn {
  width: 100%;
  padding: 14px;
  background: #008f90;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.2s;
}
.primary-checkout-btn:hover {
  opacity: 0.9;
}
.primary-checkout-btn:disabled {
  background: #94a3b8;
  cursor: not-allowed;
  opacity: 0.8;
}

.no-charge-text {
  text-align: center;
  font-size: 12px;
  color: #64748b;
  margin: 16px 0;
}

.price-breakdown {
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
}
.breakdown-row {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #475569;
  margin-bottom: 12px;
}
.breakdown-row.total {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px dashed #cbd5e1;
  font-weight: 800;
  color: #001d34;
  font-size: 16px;
}

.availability-overlay {
  position: fixed;
  inset: 0;
  z-index: 1200;
  background: rgba(15, 23, 42, 0.28);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(7px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
}

.availability-drawer {
  width: min(980px, 100%);
  max-height: 90vh;
  background: #fff;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.availability-drawer-header {
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e2e8f0;
}

.availability-drawer-header h3 {
  margin: 0;
  font-size: 22px;
  color: #001d34;
}

.availability-drawer-header p {
  margin: 4px 0 0;
  font-size: 13px;
  color: #64748b;
}

.availability-close-btn {
  border: 1px solid #cbd5e1;
  background: #fff;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.availability-room-list {
  overflow: auto;
  padding: 16px 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.availability-room-card {
  display: flex;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
}

.availability-room-image {
  width: 240px;
  min-height: 180px;
}

.availability-room-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.availability-room-content {
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.availability-room-content h4 {
  margin: 0;
  font-size: 22px;
  color: #015081;
}

.availability-room-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 18px;
}

.availability-room-meta span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #475569;
}

.availability-room-meta .material-symbols-outlined {
  font-size: 18px;
  color: #94a3b8;
}

.availability-room-footer {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.availability-loading {
  padding: 36px 20px;
  text-align: center;
  color: #015081;
}

.availability-loading p {
  margin: 8px 0 0;
  font-size: 14px;
}

.availability-empty-card {
  margin: 20px;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  background: #f8fafc;
  padding: 20px;
}

.availability-empty-card h4 {
  margin: 0 0 8px;
  font-size: 20px;
  color: #001d34;
}

.availability-empty-card p {
  margin: 0;
  color: #475569;
  font-size: 14px;
  line-height: 1.6;
}

.availability-empty-actions {
  margin-top: 16px;
  display: flex;
  gap: 10px;
}

.view-similar-btn {
  width: auto;
  padding: 10px 18px;
}

.booking-confirm-drawer {
  width: min(860px, 100%);
}

.booking-confirm-content {
  padding: 18px 20px;
  display: grid;
  gap: 12px;
  overflow: auto;
}

.booking-summary-card {
  display: flex;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  background: #f8fafc;
}

.booking-summary-image {
  width: 200px;
  min-height: 120px;
}

.booking-summary-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.booking-summary-info {
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.booking-summary-info h4 {
  margin: 0;
  color: #015081;
  font-size: 20px;
}

.booking-summary-info p {
  margin: 0;
  color: #475569;
  font-size: 14px;
}

.booking-price-card,
.booking-form-card {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
  background: #fff;
}

.booking-price-card h5,
.booking-form-card h5 {
  margin: 0 0 14px;
  font-size: 16px;
  color: #001d34;
}

.booking-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.booking-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.booking-field span {
  color: #015081;
  font-size: 12px;
  font-weight: 700;
}

.booking-field input,
.booking-field textarea {
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 14px;
  color: #334155;
  font-family: inherit;
  background: #fff;
}

.booking-field input:focus,
.booking-field textarea:focus {
  outline: none;
  border-color: #008f90;
  box-shadow: 0 0 0 3px rgba(0, 143, 144, 0.1);
}

.booking-field-full {
  grid-column: 1 / -1;
}

.booking-error-text {
  margin: 10px 0 0;
  color: #b42318;
  font-size: 13px;
  font-weight: 600;
}

.booking-confirm-footer {
  padding: 16px 20px 20px;
  border-top: 1px solid #e2e8f0;
}

.booking-feedback-drawer {
  width: min(740px, 100%);
}

.booking-feedback-card {
  margin: 18px 20px 0;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: #f8fafc;
  padding: 16px;
}

.booking-feedback-card p {
  margin: 0 0 8px;
  color: #334155;
  font-size: 14px;
}

.booking-feedback-card p:last-child {
  margin-bottom: 0;
}

.booking-feedback-actions {
  margin: 16px 20px 20px;
}

.availability-drawer-enter-active,
.availability-drawer-leave-active {
  transition: opacity 0.2s ease;
}

.availability-drawer-enter-active .availability-drawer,
.availability-drawer-leave-active .availability-drawer {
  transition: transform 0.25s ease;
}

.availability-drawer-enter-from,
.availability-drawer-leave-to {
  opacity: 0;
}

.availability-drawer-enter-from .availability-drawer,
.availability-drawer-leave-to .availability-drawer {
  transform: translateY(24px);
}

@media (max-width: 768px) {
  .availability-overlay {
    padding: 0;
    align-items: flex-end;
  }

  .availability-drawer {
    border-radius: 16px 16px 0 0;
    max-height: 94vh;
  }

  .availability-room-card {
    flex-direction: column;
  }

  .availability-room-image {
    width: 100%;
    height: 200px;
  }

  .availability-room-footer,
  .availability-empty-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .booking-summary-card {
    flex-direction: column;
  }

  .booking-summary-image {
    width: 100%;
    min-height: 180px;
  }

  .booking-form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
