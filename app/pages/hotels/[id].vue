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
          <div
            class="share-wrapper"
            v-click-outside="() => (isShareOpen = false)"
          >
            <button class="action-btn" @click="isShareOpen = !isShareOpen">
              <span class="material-symbols-outlined">ios_share</span>
              <span>Share</span>
              <span
                class="material-symbols-outlined"
                style="font-size: 16px; margin-left: -4px"
                >{{ isShareOpen ? "expand_less" : "expand_more" }}</span
              >
            </button>

            <transition name="dropdown-fade">
              <div v-if="isShareOpen" class="share-dropdown">
                <button
                  v-for="item in flatShareItems"
                  :key="item.label"
                  class="share-item"
                  @click="handleShare(item)"
                >
                  <span
                    v-if="item.svg"
                    class="share-icon-svg"
                    v-html="item.svg"
                  ></span>
                  <span v-else class="material-symbols-outlined">{{
                    item.icon
                  }}</span>
                  {{ item.label }}
                </button>
              </div>
            </transition>
          </div>

          <button
            class="action-btn"
            :class="{ 'is-saved': isWishlisted(hotel.id) }"
            @click="toggle(hotel.id)"
          >
            <span class="material-symbols-outlined">
              {{ isWishlisted(hotel.id) ? "favorite" : "favorite_border" }}
            </span>
            {{ isWishlisted(hotel.id) ? "Saved" : "Save" }}
          </button>
        </div>
      </nav>

      <!-- ═══ HERO 2-COLUMN LAYOUT ═══ -->
      <section class="hero-layout">
        <!-- LEFT: Gallery -->
        <div class="hero-gallery">
          <div
            class="gallery-stage-wrapper"
            v-if="hotel.images && hotel.images.length > 0"
          >
            <div class="gallery-main-container">
              <UCarousel
                ref="carouselRef"
                v-model="activeGalleryIndex"
                :items="hotel.images"
                :ui="{ item: 'basis-full' }"
                class="gallery-carousel"
                loop
                @update:model-value="(val) => (activeGalleryIndex = val)"
              >
                <template #default="{ item, index }">
                  <img
                    :src="item"
                    :alt="hotel.name + ' photo ' + (index + 1)"
                    class="gallery-main-img"
                    draggable="false"
                    @click="openLightbox(index)"
                  />
                </template>
              </UCarousel>

              <!-- Custom Navigation UI on top of Carousel -->
              <button
                class="gallery-arrow gallery-arrow--prev"
                v-if="hotel.images.length > 1"
                @click="prevImage"
                aria-label="Previous photo"
              >
                <span class="material-symbols-outlined">chevron_left</span>
              </button>
              <button
                class="gallery-arrow gallery-arrow--next"
                v-if="hotel.images.length > 1"
                @click="nextImage"
                aria-label="Next photo"
              >
                <span class="material-symbols-outlined">chevron_right</span>
              </button>
              <div class="gallery-counter">
                {{ activeGalleryIndex + 1 }} / {{ hotel.images.length }}
              </div>
              <button
                class="gallery-show-all"
                @click="openLightbox(activeGalleryIndex)"
              >
                <span class="material-symbols-outlined">photo_library</span>
                All {{ hotel.images.length }} photos
              </button>
            </div>

            <div
              class="gallery-thumbs"
              ref="thumbsRef"
              v-if="hotel.images.length > 1"
            >
              <button
                v-for="(img, idx) in hotel.images"
                :key="idx"
                class="gallery-thumb"
                :class="{ 'gallery-thumb--active': idx === activeGalleryIndex }"
                @click="setGalleryImage(idx)"
              >
                <img :src="img" :alt="'Thumb ' + (idx + 1)" />
              </button>
            </div>
          </div>
        </div>

        <!-- RIGHT: Hotel Info -->
        <div class="hero-info">
          <!-- Hotel Title & Stars -->
          <div class="hi-header">
            <div class="hi-title-row">
              <h1 class="hi-name">{{ hotel.name }}</h1>
            </div>
            <div class="hi-location">
              <span class="material-symbols-outlined">location_on</span>
              <span>{{ hotel.city }}, {{ hotel.country }}</span>
            </div>
          </div>

          <!-- Rating Block -->
          <div class="hi-rating-block">
            <div class="hi-score">{{ averageRatingDisplay }}</div>
            <div class="hi-rating-detail">
              <div class="flex items-center gap-2">
                <div class="hi-stars-row flex items-center">
                  <span
                    v-for="i in 5"
                    :key="i"
                    class="material-symbols-outlined"
                    style="
                      font-variation-settings: &quot;FILL&quot; 1;
                      color: #cdaf5d;
                      font-size: 16px;
                    "
                    >star</span
                  >
                </div>
                <span class="hi-rating-label">Excellent</span>
              </div>
              <span class="hi-review-count">{{ reviews.length }} reviews</span>
            </div>
          </div>

          <!-- Category bars -->
          <div class="hi-rating-bars">
            <div class="hi-bar-row">
              <span>Location</span>
              <div class="hi-bar">
                <div class="hi-bar-fill" style="width: 90%"></div>
              </div>
            </div>
            <div class="hi-bar-row">
              <span>Service</span>
              <div class="hi-bar">
                <div class="hi-bar-fill" style="width: 85%"></div>
              </div>
            </div>
            <div class="hi-bar-row">
              <span>Value</span>
              <div class="hi-bar">
                <div class="hi-bar-fill" style="width: 80%"></div>
              </div>
            </div>
          </div>

          <!-- About -->
          <div class="hi-about">
            <h3 class="hi-section-label">About</h3>
            <p class="hi-desc" style="white-space: pre-line">
              {{ hotel.description }}
            </p>
          </div>

          <!-- All Amenities -->
          <div class="hi-amenities">
            <h3 class="hi-section-label">Amenities & Services</h3>
            <div class="hi-chips">
              <span
                v-for="amenity in hotel.amenities ||
                defaultAmenities.map((a) => a.label)"
                :key="amenity"
                class="hi-chip"
              >
                <span class="material-symbols-outlined">{{
                  getAmenityIcon(amenity)
                }}</span>
                {{ amenity }}
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- Booking Section -->
      <section class="booking-section-bottom">
        <!-- Booking Widget -->
        <div class="hi-booking hi-booking--horizontal" ref="bookingPanelRef">
          <div class="hi-booking-main-row">
            <div class="hi-price-col">
              <div class="hi-price-row">
                <span class="hi-price"
                  >From
                  <strong>{{ formatEuro(fromPricePerNight) }}</strong></span
                >
                <span class="hi-per">/night</span>
              </div>
              <p class="hi-no-charge">You won't be charged yet</p>
            </div>

            <div class="hi-controls-col">
              <div class="hi-controls-bar">
                <div class="hi-date-field">
                  <label class="filter-label">Check-in</label>
                  <div class="date-picker-shell">
                    <span
                      class="material-symbols-outlined date-picker-shell__icon"
                      >calendar_today</span
                    >
                    <DatePicker
                      v-model="checkInDate"
                      :showIcon="false"
                      :manualInput="false"
                      :minDate="today"
                      appendTo="self"
                      placeholder="Select"
                      dateFormat="D, M d"
                      class="filter-date-picker"
                    />
                    <span
                      class="material-symbols-outlined date-picker-shell__chevron"
                      >expand_more</span
                    >
                  </div>
                </div>
                <div class="hi-date-field">
                  <label class="filter-label">Check-out</label>
                  <div class="date-picker-shell">
                    <span
                      class="material-symbols-outlined date-picker-shell__icon"
                      >calendar_today</span
                    >
                    <DatePicker
                      v-model="checkOutDate"
                      :showIcon="false"
                      :manualInput="false"
                      :minDate="checkOutMinDate"
                      appendTo="self"
                      placeholder="Select"
                      dateFormat="D, M d"
                      class="filter-date-picker"
                    />
                    <span
                      class="material-symbols-outlined date-picker-shell__chevron"
                      >expand_more</span
                    >
                  </div>
                </div>

                <div
                  class="hi-guest-field-container"
                  ref="guestPanelContainerRef"
                >
                  <label class="filter-label">Guests</label>
                  <button
                    type="button"
                    class="guest-trigger"
                    :class="{ 'guest-trigger--open': isGuestPanelOpen }"
                    @click="toggleGuestPanel"
                  >
                    <span class="material-symbols-outlined guest-trigger__icon"
                      >person</span
                    >
                    <span class="guest-trigger__copy">
                      <strong>{{ guestSummary }}</strong>
                      <span>Adults, children</span>
                    </span>
                    <span
                      class="material-symbols-outlined guest-trigger__chevron"
                      >expand_more</span
                    >
                  </button>

                  <div
                    v-if="isGuestPanelOpen"
                    class="guest-panel"
                    :class="{ 'guest-panel--top': guestPanelSide === 'top' }"
                    @click.stop
                  >
                    <div class="guest-counter-row">
                      <div class="guest-counter-copy">
                        <strong>Adults</strong><span>Ages 18+</span>
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
                        <strong>Children</strong><span>Ages 0–17</span>
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
                    <!-- Age selector per child -->
                    <div v-if="children > 0" class="child-ages-section">
                      <p class="child-ages-label">Child age at check-in</p>
                      <div class="child-ages-grid">
                        <div
                          v-for="(age, i) in childAges"
                          :key="i"
                          class="child-age-item"
                        >
                          <label class="child-age-lbl">Child {{ i + 1 }}</label>
                          <Select
                            v-model="childAges[i]"
                            :options="childAgeOptions"
                            optionLabel="label"
                            optionValue="value"
                            class="child-age-select-premium"
                            placeholder="Age"
                            appendTo="self"
                          />
                        </div>
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
                class="hi-book-btn"
                :disabled="!canCheckAvailability || availabilityLoading"
                @click="handleCheckAvailability"
              >
                {{ availabilityLoading ? "Checking..." : "Check Availability" }}
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Lightbox -->
      <Teleport to="body">
        <transition name="lightbox-fade">
          <div
            v-if="lightboxOpen"
            class="lightbox-overlay"
            @click.self="closeLightbox"
            tabindex="-1"
          >
            <div class="lightbox-content">
              <button class="lightbox-close" @click="closeLightbox">
                <span class="material-symbols-outlined">close</span>
              </button>
              <div class="lightbox-counter">
                {{ lightboxIndex + 1 }} / {{ hotel.images.length }}
              </div>
              <div class="lightbox-stage">
                <UCarousel
                  ref="lightboxCarouselRef"
                  v-model="lightboxIndex"
                  :items="hotel.images"
                  :ui="{ item: 'basis-full' }"
                  class="lightbox-carousel"
                  loop
                  @update:model-value="(val) => (lightboxIndex = val)"
                >
                  <template #default="{ item }">
                    <img
                      :src="item"
                      :alt="hotel.name"
                      class="lightbox-img"
                      draggable="false"
                    />
                  </template>
                </UCarousel>

                <button
                  class="lightbox-arrow lightbox-arrow--prev"
                  v-if="hotel.images.length > 1"
                  @click="prevLightbox"
                >
                  <span class="material-symbols-outlined">chevron_left</span>
                </button>
                <button
                  class="lightbox-arrow lightbox-arrow--next"
                  v-if="hotel.images.length > 1"
                  @click="nextLightbox"
                >
                  <span class="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
              <div class="lightbox-thumbs" ref="lightboxThumbsRef">
                <button
                  v-for="(img, idx) in hotel.images"
                  :key="idx"
                  class="lightbox-thumb"
                  :class="{ 'lightbox-thumb--active': idx === lightboxIndex }"
                  @click="lightboxIndex = idx"
                >
                  <img :src="img" :alt="'Thumb ' + (idx + 1)" />
                </button>
              </div>
            </div>
          </div>
        </transition>
      </Teleport>

      <!-- ═══ MAIN CONTENT (full width) ═══ -->
      <div class="content-layout">
        <main class="main-content">
          <!-- Overview -->

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

          <!-- Location / Map -->
          <section class="content-section">
            <h2 class="section-title">Location</h2>
            <div class="map-container-wrapper">
              <div class="map-info-card">
                <div class="map-icon-box">
                  <span class="material-symbols-outlined">location_on</span>
                </div>
                <div class="map-address-details">
                  <h3>Property Address</h3>
                  <p>
                    {{ hotel.address }}, {{ hotel.city }}, {{ hotel.country }}
                  </p>
                </div>
              </div>
              <div class="map-iframe-holder">
                <iframe
                  v-if="hotel.latitude && hotel.longitude"
                  width="100%"
                  height="450"
                  style="border: 0; border-radius: 20px"
                  loading="lazy"
                  allowfullscreen
                  referrerpolicy="no-referrer-when-downgrade"
                  :src="`https://maps.google.com/maps?q=${hotel.latitude},${hotel.longitude}&t=&z=15&ie=UTF8&iwloc=&output=embed`"
                ></iframe>
                <iframe
                  v-else
                  width="100%"
                  height="450"
                  style="border: 0; border-radius: 20px"
                  loading="lazy"
                  allowfullscreen
                  referrerpolicy="no-referrer-when-downgrade"
                  :src="`https://maps.google.com/maps?q=${encodeURIComponent(hotel.address + ', ' + hotel.city)}&t=&z=15&ie=UTF8&iwloc=&output=embed`"
                ></iframe>
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
                          class="availability-book-btn"
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
            <section
              class="availability-drawer booking-confirm-drawer"
              @click.stop
            >
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
                <article
                  v-if="selectedBookingRoom"
                  class="booking-summary-card"
                >
                  <div class="booking-summary-image">
                    <img
                      :src="selectedBookingRoom.image"
                      :alt="selectedBookingRoom.title"
                    />
                  </div>
                  <div class="booking-summary-info">
                    <h4>{{ selectedBookingRoom.title }}</h4>
                    <p>{{ selectedDateRangeLabel }}</p>
                    <p>
                      {{ bookingGuestsLabel }} • {{ bookingNights }} night<span
                        v-if="bookingNights > 1"
                        >s</span
                      >
                    </p>
                  </div>
                </article>

                <article class="booking-price-card">
                  <h5>Price summary</h5>
                  <div class="breakdown-row">
                    <span
                      >{{
                        formatEuro(selectedBookingRoom?.pricePerNight ?? 0)
                      }}
                      x {{ bookingNights }} nights</span
                    >
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
                  <h5>Payment option</h5>
                  <div class="payment-option-grid">
                    <label
                      class="payment-option-item"
                      :class="{ 'payment-option-item--active': selectedPaymentOption === 'PAY_NOW' }"
                    >
                      <input
                        v-model="selectedPaymentOption"
                        type="radio"
                        name="paymentOption"
                        value="PAY_NOW"
                      />
                      <div>
                        <strong>Pay now by card</strong>
                        <span>Secure checkout with Stripe</span>
                      </div>
                    </label>

                    <label
                      class="payment-option-item"
                      :class="{ 'payment-option-item--active': selectedPaymentOption === 'PAY_AT_HOTEL' }"
                    >
                      <input
                        v-model="selectedPaymentOption"
                        type="radio"
                        name="paymentOption"
                        value="PAY_AT_HOTEL"
                      />
                      <div>
                        <strong>Pay at hotel</strong>
                        <span>Confirm booking now, pay at check-in</span>
                      </div>
                    </label>
                  </div>
                </article>

                <article class="booking-form-card">
                  <h5>Guest details</h5>
                  <div class="booking-form-grid">
                    <label class="booking-field">
                      <span>Full Name</span>
                      <input
                        v-model="bookingForm.fullName"
                        type="text"
                        placeholder="Enter your full name"
                      />
                    </label>
                    <label class="booking-field">
                      <span>Email</span>
                      <input
                        v-model="bookingForm.email"
                        type="email"
                        placeholder="Enter your email"
                      />
                    </label>
                    <label class="booking-field">
                      <span>Phone Number</span>
                      <input
                        v-model="bookingForm.phone"
                        type="tel"
                        placeholder="Enter your phone number"
                      />
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
                  :disabled="bookingLoading || redirectingToPayment"
                  @click="handleConfirmReservation"
                >
                  {{
                    bookingLoading || redirectingToPayment
                      ? "Redirecting to Payment..."
                      : selectedPaymentOption === "PAY_AT_HOTEL"
                        ? "Confirm Reservation"
                        : "Proceed to Payment"
                  }}
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
            <section
              class="availability-drawer booking-feedback-drawer"
              @click.stop
            >
              <header class="availability-drawer-header">
                <div>
                  <h3>{{ bookingSuccessTitle }}</h3>
                  <p>{{ bookingSuccessDescription }}</p>
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
                <p>
                  <strong>Booking reference:</strong>
                  {{ bookingConfirmation.bookingReference }}
                </p>
                <p>
                  <strong>Hotel:</strong> {{ bookingConfirmation.hotelName }}
                </p>
                <p><strong>Room:</strong> {{ bookingConfirmation.roomName }}</p>
                <p><strong>Dates:</strong> {{ selectedDateRangeLabel }}</p>
                <p>
                  <strong>Total:</strong>
                  {{ formatEuro(bookingConfirmation.pricing.total) }}
                </p>
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
            <section
              class="availability-drawer booking-feedback-drawer"
              @click.stop
            >
              <header class="availability-drawer-header">
                <div>
                  <h3>This room is no longer available</h3>
                  <p>
                    Another guest may have booked it. Please choose another
                    available room.
                  </p>
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
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "vue";
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
  createCheckoutSession,
  loading: bookingLoading,
  error: bookingApiError,
} = useReservations();

const hotel = ref<Hotel | null>(null);

// ── Save & Share Logic ───────────────────────────────────────────────────
const { isWishlisted, toggle } = useWishlist();

const isShareOpen = ref(false);

const FB_SVG = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`;
const WA_SVG = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;
const IG_SVG = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>`;

const flatShareItems = computed(() => {
  if (!hotel.value) return [];
  const url = typeof window !== "undefined" ? window.location.href : "";
  const text = `Check out ${hotel.value.name} on VoyageHub!`;

  return [
    {
      label: "Copy link",
      icon: "link",
      click: () => {
        navigator.clipboard.writeText(url);
        alert("Link copied to clipboard!");
      },
    },
    {
      label: "Facebook",
      svg: FB_SVG,
      click: () =>
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
          "_blank",
        ),
    },
    {
      label: "WhatsApp",
      svg: WA_SVG,
      click: () =>
        window.open(
          `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`,
          "_blank",
        ),
    },
    {
      label: "Email",
      icon: "mail",
      click: () => {
        const subject = `Check out this hotel on VoyageHub: ${hotel.value!.name}`;
        const body = `Hi,\n\nI found this amazing hotel on VoyageHub and thought you might like it:\n\n${hotel.value!.name}\n${url}\n\nEnjoy!`;
        window.open(
          `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
          "_blank",
        );
      },
    },
    {
      label: "Instagram",
      svg: IG_SVG,
      click: () => {
        if (navigator.share) {
          navigator
            .share({ title: hotel.value!.name, text: text, url: url })
            .catch(() => {});
        } else {
          navigator.clipboard.writeText(url);
          alert(
            "Instagram sharing is best on mobile! Link copied to clipboard.",
          );
        }
      },
    },
  ];
});

function handleShare(item: any) {
  item.click();
  isShareOpen.value = false;
}

// ── Gallery ────────────────────────────────────────────────────────────────
const activeGalleryIndex = ref(0);
const carouselRef = ref(null);
const thumbsRef = ref<HTMLElement | null>(null);

function setGalleryImage(idx: number) {
  activeGalleryIndex.value = idx;
  nextTick(() => scrollThumbIntoView(thumbsRef.value, idx));
}

function prevImage() {
  if (!hotel.value?.images) return;
  const len = hotel.value.images.length;
  activeGalleryIndex.value = (activeGalleryIndex.value - 1 + len) % len;
}

function nextImage() {
  if (!hotel.value?.images) return;
  const len = hotel.value.images.length;
  activeGalleryIndex.value = (activeGalleryIndex.value + 1) % len;
}

watch(
  activeGalleryIndex,
  (newIdx) => {
    nextTick(() => {
      scrollThumbIntoView(thumbsRef.value, newIdx);

      const carousel = carouselRef.value;
      if (!carousel) return;

      // Try multiple possible API methods to ensure movement
      if (typeof carousel.select === "function") {
        carousel.select(newIdx);
      } else if (
        carousel.emblaApi &&
        typeof carousel.emblaApi.scrollTo === "function"
      ) {
        carousel.emblaApi.scrollTo(newIdx);
      }
    });
  },
  { immediate: true },
);

// Listen for native carousel changes (swipes) to keep external state in sync
watch(
  carouselRef,
  (ref) => {
    if (ref?.emblaApi) {
      ref.emblaApi.on("select", () => {
        const index = ref.emblaApi.selectedScrollSnap();
        if (activeGalleryIndex.value !== index) {
          activeGalleryIndex.value = index;
        }
      });
    }
  },
  { immediate: true },
);

// ── Lightbox ───────────────────────────────────────────────────────────────
const lightboxOpen = ref(false);
const lightboxIndex = ref(0);
const lightboxThumbsRef = ref<HTMLElement | null>(null);

function openLightbox(idx: number) {
  lightboxIndex.value = idx;
  lightboxOpen.value = true;
  nextTick(() => scrollThumbIntoView(lightboxThumbsRef.value, idx));
}

function closeLightbox() {
  lightboxOpen.value = false;
}

function prevLightbox() {
  if (!hotel.value?.images) return;
  const len = hotel.value.images.length;
  lightboxIndex.value = (lightboxIndex.value - 1 + len) % len;
}

function nextLightbox() {
  if (!hotel.value?.images) return;
  const len = hotel.value.images.length;
  lightboxIndex.value = (lightboxIndex.value + 1) % len;
}

const lightboxCarouselRef = ref(null);

watch(lightboxIndex, (newIdx) => {
  nextTick(() => {
    scrollThumbIntoView(lightboxThumbsRef.value, newIdx);

    const carousel = lightboxCarouselRef.value;
    if (!carousel) return;

    if (typeof carousel.select === "function") {
      carousel.select(newIdx);
    } else if (
      carousel.emblaApi &&
      typeof carousel.emblaApi.scrollTo === "function"
    ) {
      carousel.emblaApi.scrollTo(newIdx);
    }
  });
});

watch(
  lightboxCarouselRef,
  (ref) => {
    if (ref?.emblaApi) {
      ref.emblaApi.on("select", () => {
        const index = ref.emblaApi.selectedScrollSnap();
        if (lightboxIndex.value !== index) {
          lightboxIndex.value = index;
        }
      });
    }
  },
  { immediate: true },
);

function onLightboxPointerDown() {
  /* Handled by UCarousel */
}
function onLightboxPointerUp() {
  /* Handled by UCarousel */
}

function scrollThumbIntoView(container: HTMLElement | null, idx: number) {
  if (!container) return;
  const thumb = container.children[idx] as HTMLElement;
  if (thumb)
    thumb.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
}

function handleLightboxKeydown(e: KeyboardEvent) {
  if (!lightboxOpen.value) return;
  if (e.key === "ArrowRight") nextLightbox();
  if (e.key === "ArrowLeft") prevLightbox();
  if (e.key === "Escape") closeLightbox();
}
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
const childAges = ref<number[]>([]); // age per child (1–17)
const childAgeOptions = Array.from({ length: 17 }, (_, index) => ({
  label: `${index + 1} years old`,
  value: index + 1,
}));
const isGuestPanelOpen = ref(false);
const guestPanelSide = ref<"top" | "bottom">("bottom");
const bookingPanelRef = ref<HTMLElement | null>(null);

function toggleGuestPanel(event: MouseEvent) {
  isGuestPanelOpen.value = !isGuestPanelOpen.value;
  if (isGuestPanelOpen.value && event.currentTarget instanceof HTMLElement) {
    const rect = event.currentTarget.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const spaceBelow = windowHeight - rect.bottom;
    // If less than 380px below, open at top
    guestPanelSide.value = spaceBelow < 300 ? "top" : "bottom";
  }
}

const availabilityLoading = ref(false);
const showRoomsDrawer = ref(false);
const availability = ref<HotelAvailabilitySummary | null>(null);
const selectedRoomId = ref<number | null>(null);
const selectedBookingRoom = ref<HotelAvailableRoomOption | null>(null);
const showBookingDrawer = ref(false);
const showBookingSuccess = ref(false);
const showRoomUnavailable = ref(false);
const bookingConfirmation = ref<BookingConfirmation | null>(null);
const redirectingToPayment = ref(false);
const selectedPaymentOption = ref<"PAY_NOW" | "PAY_AT_HOTEL">("PAY_NOW");
const PAYMENT_RESULT_ACCESS_KEY = "vh_payment_result_access";
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

const guestSummary = computed(() => {
  const adultLabel = `${adults.value} adult${adults.value > 1 ? "s" : ""}`;
  const childLabel =
    children.value > 0
      ? ` · ${children.value} child${children.value > 1 ? "ren" : ""}`
      : "";
  return `${adultLabel}${childLabel}`;
});

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

const bookingNights = computed(
  () => availability.value?.nights ?? nightsCount.value,
);
const bookingRoomPrice = computed(
  () =>
    (selectedBookingRoom.value?.pricePerNight ?? selectedPricePerNight.value) *
    bookingNights.value,
);
const bookingTaxes = computed(
  () => availability.value?.cityTax ?? bookingNights.value * 5,
);
const bookingTotal = computed(
  () => bookingRoomPrice.value + bookingTaxes.value,
);
const bookingGuestsLabel = computed(() => {
  const adultsLabel = `${adults.value} adult${adults.value > 1 ? "s" : ""}`;
  if (children.value < 1) {
    return adultsLabel;
  }
  return `${adultsLabel}, ${children.value} child${children.value > 1 ? "ren" : ""}`;
});

const bookingSuccessTitle = computed(() =>
  bookingConfirmation.value?.paymentOption === "PAY_AT_HOTEL"
    ? "Reservation Submitted"
    : "Reservation Submitted",
);

const bookingSuccessDescription = computed(() =>
  bookingConfirmation.value?.paymentOption === "PAY_AT_HOTEL"
    ? "Your booking is pending. You will pay at hotel check-in."
    : "Your booking is now pending payment confirmation.",
);

const isAnyModalOpen = computed(
  () =>
    lightboxOpen.value ||
    showRoomsDrawer.value ||
    showBookingDrawer.value ||
    showBookingSuccess.value ||
    showRoomUnavailable.value,
);

watch(
  isAnyModalOpen,
  (open) => {
    document.body.style.overflow = open ? "hidden" : "";
  },
  { immediate: true },
);

function updateGuestCount(type: "adults" | "children", delta: number) {
  if (type === "adults") {
    adults.value = Math.max(1, adults.value + delta);
    return;
  }
  const newVal = Math.max(0, children.value + delta);
  if (delta > 0) {
    childAges.value.push(14); // default age 14
  } else if (delta < 0 && childAges.value.length > 0) {
    childAges.value.pop();
  }
  children.value = newVal;
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
  redirectingToPayment.value = false;
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
  redirectingToPayment.value = false;
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
  redirectingToPayment.value = false;
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
      availability.value.rooms.find(
        (room) => room.id === selectedRoomId.value,
      ) ?? null;
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
  selectedPaymentOption.value = "PAY_NOW";
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
  redirectingToPayment.value = false;
}

function closeSuccessModal() {
  showBookingSuccess.value = false;
  redirectingToPayment.value = false;
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
      message:
        "Please sign in or create an account to confirm your reservation.",
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
    bookingFormError.value =
      "Please complete Full Name, Email, and Phone Number.";
    return;
  }

  bookingFormError.value = "";
  redirectingToPayment.value = true;
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
    paymentOption: selectedPaymentOption.value,
  });

  if (!confirmation) {
    const reason =
      bookingApiError.value || "Unable to confirm your reservation.";
    if (reason.toLowerCase().includes("no longer available")) {
      showBookingDrawer.value = false;
      showRoomUnavailable.value = true;
      redirectingToPayment.value = false;
      return;
    }
    bookingFormError.value = reason;
    redirectingToPayment.value = false;
    return;
  }

  bookingConfirmation.value = confirmation;
  showBookingDrawer.value = false;
  showRoomsDrawer.value = false;

  if (selectedPaymentOption.value === "PAY_AT_HOTEL") {
    showBookingSuccess.value = true;
    redirectingToPayment.value = false;
    return;
  }

  const checkoutSession = await createCheckoutSession({
    tripId: hotel.value.id,
    userId: accountId.value,
    totalPrice: confirmation.pricing.total,
    bookingId: confirmation.bookingId,
  });

  if (!checkoutSession?.url) {
    bookingFormError.value =
      bookingApiError.value ||
      "Unable to initialize secure payment. Please try again.";
    redirectingToPayment.value = false;
    showBookingDrawer.value = true;
    return;
  }

  if (typeof window !== "undefined") {
    sessionStorage.setItem(PAYMENT_RESULT_ACCESS_KEY, "1");
  }
  window.location.assign(checkoutSession.url);
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
  document.addEventListener("keydown", handleLightboxKeydown);
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
  document.removeEventListener("keydown", handleLightboxKeydown);
  document.body.style.overflow = "";
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
  gap: 12px;
}
.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  border: 1px solid #e2e8f0;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s;
}
.action-btn:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
  color: #015081;
}
.action-btn .material-symbols-outlined {
  font-size: 20px;
}
.action-btn.is-saved {
  color: #e11d48;
  border-color: #fecdd3;
  background: #fff1f2;
}
.action-btn.is-saved .material-symbols-outlined {
  font-variation-settings: "FILL" 1;
}

/* Custom Share Dropdown */
.share-wrapper {
  position: relative;
}

.share-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: 200px;
  z-index: 1000;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.share-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  width: 100%;
  border: none;
  background: transparent;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #475569;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;
}

.share-item:hover {
  background: #f1f5f9;
  color: #015081;
}

.share-icon-svg {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  color: #64748b;
}

.share-item:hover .share-icon-svg {
  color: #015081;
}

.share-item .material-symbols-outlined {
  font-size: 18px;
  color: #64748b;
}

.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: all 0.2s ease-out;
}
.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* ═══ HERO 2-COLUMN LAYOUT ═══ */
.hero-layout {
  max-width: 1200px;
  margin: 0 auto 40px;
  padding: 0 24px;
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 32px;
  align-items: start;
}

@media (max-width: 1024px) {
  .hero-layout {
    grid-template-columns: 1fr;
  }
}

/* ═══ BOTTOM BOOKING SECTION ═══ */
.booking-section-bottom {
  max-width: 1200px;
  margin: 0 auto 60px;
  padding: 0 24px;
}

/* LEFT: Gallery */
.hero-gallery {
  width: 100%;
  position: sticky;
  top: 24px;
  min-width: 0;
}

.gallery-stage {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
}

.gallery-main-container {
  position: relative;
  width: 100%;
  height: 440px;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
}

.gallery-main-container {
  position: relative;
  width: 100%;
  height: 440px;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
  background: #0f172a;
}

.gallery-carousel {
  width: 100%;
  height: 100%;
}

.gallery-main-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: pointer;
  display: block;
}

/* Slide transitions */
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: absolute;
  inset: 0;
}
.slide-left-enter-from {
  transform: translateX(100%);
  opacity: 0;
}
.slide-left-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
.slide-right-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}
.slide-right-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.gallery-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.9);
  color: var(--color-navy);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: var(--transition-hover);
  backdrop-filter: blur(4px);
}
.gallery-arrow:hover {
  background: var(--color-white);
  transform: translateY(-50%) scale(1.1);
}
.gallery-arrow--prev {
  left: 20px;
}
.gallery-arrow--next {
  right: 20px;
}

.gallery-counter {
  position: absolute;
  top: 24px;
  left: 24px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  padding: 6px 16px;
  border-radius: 30px;
  backdrop-filter: blur(8px);
  z-index: 10;
}

.gallery-show-all {
  position: absolute;
  bottom: 20px;
  right: 20px;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.95);
  color: var(--color-navy);
  border: none;
  border-radius: var(--radius-xl);
  padding: 10px 18px;
  font-size: var(--font-size-body-sm);
  font-weight: var(--font-weight-bold);
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: var(--transition-hover);
}
.gallery-show-all:hover {
  background: var(--color-white);
  transform: translateY(-2px);
}

.gallery-thumbs {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding: 8px 0;
  scrollbar-width: none;
}
.gallery-thumbs::-webkit-scrollbar {
  display: none;
}

.gallery-thumb {
  flex-shrink: 0;
  width: 100px;
  height: 68px;
  border-radius: 12px;
  overflow: hidden;
  border: 3px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
  padding: 0;
  opacity: 0.6;
}
.gallery-thumb--active {
  border-color: var(--color-primary);
  opacity: 1;
  transform: translateY(-4px);
}
.gallery-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* RIGHT: Hero Info */
.hero-info {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.hi-header {
  border-bottom: 1px solid var(--color-border-soft);
  padding-bottom: var(--space-5);
}
.hi-title-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 8px;
}
.hi-name {
  font-size: var(--font-size-h3);
  font-weight: var(--font-weight-bold);
  color: var(--color-heading);
  margin: 0;
  line-height: 1.2;
}
.hi-star {
  color: var(--color-accent);
  font-size: 18px;
  font-variation-settings: "FILL" 1;
}
.hi-location {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: var(--font-size-body-sm);
  color: var(--color-text-soft);
}
.hi-location .material-symbols-outlined {
  font-size: 18px;
  color: var(--color-navy);
}

.hi-rating-block {
  display: flex;
  align-items: center;
  gap: 16px;
}
.hi-score {
  background: var(--color-navy);
  color: var(--color-white);
  font-size: var(--font-size-title-md);
  font-weight: var(--font-weight-bold);
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-xl);
}
.hi-rating-detail {
  display: flex;
  flex-direction: column;
}
.hi-rating-label {
  font-weight: var(--font-weight-semibold);
  color: var(--color-heading);
  font-size: var(--font-size-body-md);
}
.hi-review-count {
  font-size: var(--font-size-caption);
  color: var(--color-text-soft);
}

.hi-rating-bars {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.hi-bar-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.hi-bar-row span {
  font-size: var(--font-size-caption);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-soft);
  width: 60px;
}
.hi-bar {
  flex: 1;
  height: 6px;
  background: var(--color-border-soft);
  border-radius: var(--radius-pill);
  overflow: hidden;
}
.hi-bar-fill {
  height: 100%;
  background: var(--color-primary);
  border-radius: var(--radius-pill);
}

.hi-about {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.hi-section-label {
  font-size: var(--font-size-body-md);
  font-weight: var(--font-weight-bold);
  color: var(--color-heading);
  margin: 0;
}
.hi-desc {
  font-size: var(--font-size-body-sm);
  line-height: 1.7;
  color: var(--color-text-soft);
  margin: 0;
}

.hi-amenities {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
.hi-chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}
.hi-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--color-surface-2);
  padding: 6px 12px;
  border-radius: var(--radius-pill);
  font-size: var(--font-size-caption);
  font-weight: var(--font-weight-semibold);
  color: var(--color-navy);
  border: 1px solid var(--color-border);
}
.hi-chip .material-symbols-outlined {
  font-size: 16px;
  color: var(--color-primary);
}

/* Booking Widget in Hero */
/* ── Booking Widget ─────────────────────────────────────────────────── */
.hi-booking {
  background: var(--color-surface);
  border: 1px solid color-mix(in srgb, var(--color-gray-200) 40%, white 60%);
  border-radius: 24px;
  padding: 1.25rem 2rem;
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.06);
  width: 100%;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}
.hi-booking:hover {
  box-shadow: 0 25px 60px rgba(15, 23, 42, 0.1);
}

.hi-booking--horizontal .hi-booking-main-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-6);
}

.hi-booking--horizontal .hi-price-col {
  flex: 0 0 auto;
  min-width: 150px;
}

.hi-booking--horizontal .hi-controls-col {
  flex: 1;
  display: flex;
  align-items: flex-end;
  gap: var(--space-4);
}

.hi-controls-bar {
  display: flex;
  align-items: flex-end;
  flex: 1;
  gap: var(--space-4);
}

.hi-date-field,
.hi-guest-field-container {
  flex: 1;
  min-width: 150px;
  display: flex;
  flex-direction: column;
  position: relative; /* Critical anchor for popups */
}

.filter-label {
  display: block;
  font-size: 12px;
  font-weight: 800;
  color: var(--color-navy-700);
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  padding-left: 2px;
}

/* ── PrimeVue DatePicker calendar popup ─────────────────────────────── */
.booking-date-picker :deep(.p-datepicker-panel) {
  background: var(--color-surface) !important;
  border: 1px solid var(--color-border) !important;
  border-radius: var(--radius-2xl) !important;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.14) !important;
  padding: var(--space-4) !important;
  font-family: var(--font-family-base);
  min-width: 280px;
}
.booking-date-picker :deep(.p-datepicker-header) {
  background: transparent !important;
  border: none !important;
  padding: var(--space-1) var(--space-1) var(--space-3) !important;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.booking-date-picker :deep(.p-datepicker-title) {
  font-weight: var(--font-weight-bold) !important;
  font-size: var(--font-size-body-md) !important;
  color: var(--color-heading) !important;
}
.booking-date-picker :deep(.p-datepicker-prev-button),
.booking-date-picker :deep(.p-datepicker-next-button) {
  background: transparent !important;
  border: 1px solid var(--color-border) !important;
  border-radius: var(--radius-md) !important;
  color: var(--color-text-soft) !important;
  width: 30px !important;
  height: 30px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  transition: all 0.15s !important;
}
.booking-date-picker :deep(.p-datepicker-prev-button:hover),
.booking-date-picker :deep(.p-datepicker-next-button:hover) {
  background: var(--color-surface-2) !important;
  color: var(--color-heading) !important;
}
.booking-date-picker :deep(.p-datepicker-weekday) {
  font-size: 11px !important;
  font-weight: 700 !important;
  color: var(--color-text-muted) !important;
  text-transform: uppercase !important;
  letter-spacing: 0.05em !important;
  padding: var(--space-1) !important;
}
.booking-date-picker :deep(.p-datepicker-day-cell-inner) {
  width: 34px !important;
  height: 34px !important;
  border-radius: var(--radius-md) !important;
  font-size: var(--font-size-body-sm) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  transition: background 0.15s !important;
  color: var(--color-text) !important;
}
.booking-date-picker :deep(.p-datepicker-day-cell-inner:hover) {
  background: var(--color-primary-50) !important;
  color: var(--color-primary-700) !important;
}
.booking-date-picker :deep(.p-datepicker-today .p-datepicker-day-cell-inner) {
  background: var(--color-primary-100) !important;
  color: var(--color-primary-700) !important;
  font-weight: var(--font-weight-bold) !important;
}
.booking-date-picker :deep(.p-highlight .p-datepicker-day-cell-inner),
.booking-date-picker :deep(.p-datepicker-day-cell-inner.p-highlight) {
  background: var(--color-primary) !important;
  color: var(--color-white) !important;
  font-weight: var(--font-weight-bold) !important;
}
.booking-date-picker :deep(.p-disabled .p-datepicker-day-cell-inner) {
  opacity: 0.3 !important;
  cursor: not-allowed !important;
}

/* ── Guest Panel ─────────────────────────────────────────────────────── */
.guest-panel {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  z-index: 999;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-2xl);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.12);
  padding: var(--space-5);
  width: 290px;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
.guest-counter-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  padding: var(--space-2) 0;
  border-bottom: 1px solid var(--color-border-soft);
}
.guest-counter-row:last-of-type {
  border-bottom: none;
}
.guest-counter-copy {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.guest-counter-copy strong {
  font-size: var(--font-size-body-md);
  font-weight: var(--font-weight-semibold);
  color: var(--color-heading);
}
.guest-counter-copy span {
  font-size: var(--font-size-caption);
  color: var(--color-text-muted);
}
.guest-counter-control {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-size: var(--font-size-body-md);
  font-weight: var(--font-weight-semibold);
  color: var(--color-heading);
  min-width: 80px;
  justify-content: center;
}
.guest-counter-btn {
  width: 30px;
  height: 30px;
  border-radius: var(--radius-full);
  border: 1px solid var(--color-border);
  background: transparent;
  color: var(--color-text);
  font-size: 18px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition-hover);
}
.guest-counter-btn:hover:not(:disabled) {
  background: var(--color-primary-50);
  border-color: var(--color-primary);
  color: var(--color-primary);
}
.guest-counter-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
.guest-done-button {
  width: 100%;
  padding: 10px;
  background: var(--color-primary);
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-body-sm);
  cursor: pointer;
  transition: var(--transition-hover);
  margin-top: var(--space-2);
}
.guest-done-button:hover {
  background: var(--color-primary-dark);
}

/* Child age selectors */
.child-ages-section {
  padding-top: var(--space-3);
  border-top: 1px solid var(--color-border-soft);
}
.child-ages-label {
  font-size: var(--font-size-caption);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-soft);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 var(--space-3);
}
.child-ages-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-2) var(--space-3);
}
.child-age-item {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}
.child-age-lbl {
  font-size: var(--font-size-caption);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-muted);
}
.child-age-select {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 6px 10px;
  font-size: var(--font-size-body-sm);
  background: var(--color-surface);
  color: var(--color-text);
  outline: none;
  cursor: pointer;
  width: 100%;
  transition: border-color var(--duration-fast);
}
.child-age-select:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(0, 103, 104, 0.1);
}

.hi-booking--horizontal .guest-panel {
  top: calc(100% + 12px);
  right: 0;
  left: auto;
  width: 320px;
}

.hi-booking--horizontal .guest-panel--top {
  top: auto;
  bottom: calc(100% + 12px);
}

.hi-booking--horizontal .hi-book-btn {
  flex: 0 0 auto;
  width: auto;
  min-width: 160px;
  height: 48px;
  padding: 0 28px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: var(--space-2);
}

.hi-price-row {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-bottom: 2px;
}
.hi-price {
  font-size: 14px;
  color: var(--color-gray-500);
  font-weight: 500;
}
.hi-price strong {
  font-size: 26px;
  font-weight: 800;
  color: var(--color-navy-700);
  letter-spacing: -0.02em;
}
.hi-per {
  font-size: 13px;
  color: var(--color-gray-500);
}
.hi-no-charge {
  text-align: left;
  font-size: 12px;
  color: var(--color-gray-400);
  font-weight: 500;
  margin: 0;
}

.hi-book-btn {
  width: 100%;
  background: var(--color-primary-600);
  color: var(--color-white);
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0, 103, 104, 0.15);
}
.hi-book-btn:hover:not(:disabled) {
  background: var(--color-primary-700);
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 103, 104, 0.25);
}
.hi-book-btn:active:not(:disabled) {
  transform: translateY(0);
}
.hi-book-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none;
}

.hi-breakdown {
  margin-top: var(--space-5);
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-border-soft);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
.hi-breakdown--horizontal {
  max-width: 400px;
  margin-left: auto;
}
.hi-bd-row {
  display: flex;
  justify-content: space-between;
  font-size: var(--font-size-body-sm);
  color: var(--color-text-soft);
}
.hi-bd-total {
  margin-top: var(--space-2);
  padding-top: var(--space-3);
  border-top: 1px dashed var(--color-border);
  font-weight: var(--font-weight-bold);
  color: var(--color-heading);
  font-size: var(--font-size-body-md);
}

/* ── Lightbox ─────────────────────────────────────────────────────────── */
.lightbox-fade-enter-active,
.lightbox-fade-leave-active {
  transition: opacity 0.25s ease;
}
.lightbox-fade-enter-from,
.lightbox-fade-leave-to {
  opacity: 0;
}

.lightbox-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 10, 20, 0.96);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.lightbox-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 60px 20px 40px; /* Space for counter at top and thumbnails at bottom */
}

.lightbox-close {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 20;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
}
.lightbox-close:hover {
  background: rgba(255, 255, 255, 0.2);
}
.lightbox-close .material-symbols-outlined {
  font-size: 22px;
}

.lightbox-counter {
  position: absolute;
  top: 22px;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255, 255, 255, 0.7);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.05em;
}

.lightbox-stage {
  position: relative;
  width: 100%;
  flex: 1; /* Expand to take all available middle space */
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.lightbox-carousel {
  width: 80%;
  height: 100%;
}

/* Force the Carousel engine to fill the vertical space */
.lightbox-carousel :deep(div:first-child),
.lightbox-carousel :deep(.embla),
.lightbox-carousel :deep(.embla__container),
.lightbox-carousel :deep(.embla__slide) {
  height: 100%;
}

.lightbox-img {
  max-width: 80%;
  max-height: 75vh;
  object-fit: contain;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5);
  border-radius: 12px;
  user-select: none;
  display: block;
  margin: 0 auto;
}

.lightbox-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition:
    background 0.2s,
    transform 0.2s;
  backdrop-filter: blur(4px);
}
.lightbox-arrow:hover {
  background: rgba(255, 255, 255, 0.22);
  transform: translateY(-50%) scale(1.08);
}
.lightbox-arrow--prev {
  left: 12px;
}
.lightbox-arrow--next {
  right: 12px;
}
.lightbox-arrow .material-symbols-outlined {
  font-size: 26px;
}

/* Lightbox thumbnails */
.lightbox-thumbs {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scroll-behavior: smooth;
  max-width: 100%;
  padding-top: 32px;
  scrollbar-width: none;
  margin-top: auto; /* Push to bottom of screen */
}
.lightbox-thumbs::-webkit-scrollbar {
  display: none;
}

.lightbox-thumb {
  flex-shrink: 0;
  width: 72px;
  height: 50px;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid transparent;
  cursor: pointer;
  padding: 0;
  background: none;
  opacity: 0.5;
  transition:
    opacity 0.2s,
    border-color 0.2s,
    transform 0.2s;
}
.lightbox-thumb:hover {
  opacity: 0.85;
}
.lightbox-thumb--active {
  border-color: var(--color-primary);
  opacity: 1;
  transform: translateY(-2px);
}
.lightbox-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* ── Property Content ────────────────────────────────────────────────── */
.content-section {
  padding: var(--space-12) 0;
  border-bottom: 1px solid var(--color-border-soft);
}
.section-title {
  font-size: var(--font-size-h3);
  font-weight: var(--font-weight-bold);
  color: var(--color-heading);
  margin-bottom: var(--space-6);
}
.hotel-description {
  font-size: var(--font-size-body-md);
  line-height: 1.8;
  color: var(--color-text-soft);
  white-space: pre-line;
}
.subsection-title {
  font-size: var(--font-size-title-sm);
  font-weight: var(--font-weight-bold);
  color: var(--color-heading);
  margin-bottom: var(--space-4);
}
.amenities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: var(--space-4);
}
.amenity-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  background: var(--color-surface-2);
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-border-soft);
  font-size: var(--font-size-body-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-navy);
}
.amenity-item .material-symbols-outlined {
  color: var(--color-primary);
  font-size: 24px;
}

/* ── Rooms Grid ──────────────────────────────────────────────────────── */
.rooms-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}
.premium-room-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-3xl);
  overflow: hidden;
  transition:
    transform var(--duration-normal) var(--easing-standard),
    box-shadow var(--duration-normal) var(--easing-standard);
  display: flex;
  flex-direction: column;
}
.premium-room-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-card-hover);
}
.room-image {
  height: 200px;
  overflow: hidden;
}
.room-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}
.premium-room-card:hover .room-image img {
  transform: scale(1.08);
}
.room-content {
  padding: var(--space-6);
  flex: 1;
  display: flex;
  flex-direction: column;
}
.room-header h3 {
  font-size: var(--font-size-title-md);
  font-weight: var(--font-weight-bold);
  color: var(--color-heading);
  margin: 0 0 var(--space-3);
}
.room-features {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-bottom: var(--space-6);
}
.room-features span {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-body-sm);
  color: var(--color-text-soft);
}
.room-features .material-symbols-outlined {
  font-size: 20px;
  color: var(--color-primary);
}
.room-footer {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-border-soft);
}
.price-block {
  display: flex;
  align-items: baseline;
  gap: var(--space-1);
}
.price-val {
  font-size: var(--font-size-title-md);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-600);
}
.price-unit {
  font-size: var(--font-size-caption);
  color: var(--color-text-muted);
  font-weight: var(--font-weight-semibold);
}
.book-btn-outline {
  border: 2px solid var(--color-primary-500);
  background: transparent;
  color: var(--color-primary-600);
  padding: 10px 20px;
  border-radius: 4px;
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-body-sm);
  cursor: pointer;
  transition: var(--transition-hover);
  white-space: nowrap;
}
.book-btn-outline:hover:not(.disabled) {
  background: var(--color-primary-500);
  color: #ffffff;
}
.book-btn-outline.disabled {
  border-color: var(--color-disabled);
  color: var(--color-disabled-text);
  cursor: not-allowed;
}

/* ── Map ────────────────────────────────────────────────────────────── */
.map-container-wrapper {
  background: var(--color-surface);
  border-radius: var(--radius-3xl);
  overflow: hidden;
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
  margin-bottom: 20px;
}
.map-info-card {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-6);
  background: #f8fafc;
  border-bottom: 1px solid var(--color-border-soft);
}
.map-icon-box {
  width: 48px;
  height: 48px;
  background: rgba(0, 103, 104, 0.1);
  color: var(--color-primary);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.map-icon-box .material-symbols-outlined {
  font-size: 28px;
}
.map-address-details h3 {
  font-size: 16px;
  font-weight: 800;
  color: var(--color-navy);
  margin: 0 0 4px;
}
.map-address-details p {
  font-size: 14px;
  color: var(--color-text-soft);
  margin: 0;
}
.map-iframe-holder {
  padding: 12px;
}

/* ── Reviews ─────────────────────────────────────────────────────────── */
.reviews-header-advanced {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  gap: 24px;
}
.reviews-subtitle {
  color: var(--color-text-soft);
  font-size: var(--font-size-body-sm);
  margin-top: var(--space-1);
}

.global-rating-block {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  background: var(--color-surface-2);
  padding: var(--space-4) var(--space-6);
  border-radius: var(--radius-2xl);
  border: 1px solid var(--color-border);
}
.rating-score {
  font-size: var(--font-size-display-sm);
  font-weight: var(--font-weight-bold);
  color: var(--color-navy);
  line-height: 1;
}
.rating-context {
  display: flex;
  flex-direction: column;
}
.stars-gold {
  display: flex;
  gap: 2px;
  margin-bottom: var(--space-1);
}
.stars-gold .material-symbols-outlined {
  color: var(--color-accent);
  font-variation-settings: "FILL" 1;
  font-size: 18px;
}
.rating-context span {
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-body-sm);
  color: var(--color-heading);
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}
.review-card {
  padding: var(--space-6);
  background: var(--color-surface);
  border: 1px solid var(--color-border-soft);
  border-radius: var(--radius-2xl);
  transition: var(--transition-hover);
}
.review-card:hover {
  border-color: var(--color-border);
  box-shadow: var(--shadow-sm);
}
.reviewer-prof {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  margin-bottom: var(--space-4);
}
.avatar-circle {
  width: 44px;
  height: 44px;
  background: var(--color-navy);
  color: var(--color-white);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-title-sm);
}
.reviewer-meta strong {
  display: block;
  font-size: var(--font-size-body-md);
  color: var(--color-heading);
}
.reviewer-meta span {
  font-size: var(--font-size-caption);
  color: var(--color-text-muted);
}
.review-stars-small {
  display: flex;
  gap: var(--space-1);
  margin-bottom: var(--space-3);
}
.review-stars-small .material-symbols-outlined {
  font-size: 16px;
  color: var(--color-border);
  font-variation-settings: "FILL" 1;
}
.review-stars-small .active {
  color: var(--color-accent);
}
.review-body {
  font-size: var(--font-size-body-md);
  line-height: 1.7;
  color: var(--color-text-soft);
}

/* Feedback Form */
.feedback-form-container {
  margin-top: var(--space-10);
  padding-top: var(--space-8);
  border-top: 1px solid var(--color-border-soft);
}
.feedback-card {
  background: var(--color-surface-2);
  padding: var(--space-6);
  border-radius: var(--radius-3xl);
  border: 1px solid var(--color-border);
}
.rating-selector {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
}
.rating-label {
  font-size: var(--font-size-body-md);
  font-weight: var(--font-weight-bold);
  color: var(--color-heading);
}
.stars-interactive {
  display: flex;
  gap: var(--space-2);
}
.star-btn {
  font-size: 28px;
  color: var(--color-border);
  cursor: pointer;
  transition: var(--transition-hover);
  font-variation-settings: "FILL" 1;
}
.star-btn:hover,
.star-btn.active {
  color: var(--color-accent);
  transform: scale(1.1);
}
.feedback-textarea {
  width: 100%;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: var(--space-4);
  font-size: var(--font-size-body-md);
  font-family: inherit;
  resize: vertical;
  margin-bottom: var(--space-4);
  outline: none;
  background: var(--color-surface);
  color: var(--color-text);
}
.feedback-textarea:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 4px rgba(0, 103, 104, 0.1);
}
.feedback-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: var(--space-4);
}

.submit-success-msg {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--color-primary-600);
  font-weight: 600;
  font-size: 0.9rem;
}

.submit-review-btn {
  background: #004d4d; /* Deep Teal matching main theme */
  color: #ffffff;
  border: none;
  padding: 14px 32px;
  border-radius: 12px;
  font-weight: 800;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 77, 77, 0.2);
}

.submit-review-btn:hover:not(:disabled) {
  background: #003333;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 77, 77, 0.3);
}

.submit-review-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none;
}

/* ── Content Layout & Drawers ─────────────────────────────────────────── */
.content-layout {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}
.main-content {
  width: 100%;
}

.availability-overlay {
  position: fixed;
  inset: 0;
  z-index: var(--z-index-modal);
  background: var(--color-overlay);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-6);
}
.availability-drawer {
  width: min(1000px, 100%);
  max-height: 92vh;
  background: var(--color-surface);
  border-radius: var(--radius-dialog);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: var(--shadow-modal);
}
.availability-drawer-header {
  padding: var(--space-5) var(--space-6);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--color-border-soft);
}
.availability-drawer-header h3 {
  font-size: var(--font-size-title-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-heading);
  margin: 0;
}
.availability-drawer-header p {
  color: var(--color-text-soft);
  font-size: var(--font-size-body-sm);
  margin: var(--space-1) 0 0;
}
.availability-room-list {
  padding: var(--space-5);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
.availability-room-card {
  display: flex;
  height: 160px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  overflow: hidden;
  background: var(--color-surface);
  transition:
    transform var(--duration-fast) var(--easing-standard),
    box-shadow var(--duration-fast) var(--easing-standard);
}
.availability-room-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--color-border-soft);
}
.availability-room-image {
  width: 180px;
  min-width: 180px;
  height: 100%;
  flex-shrink: 0;
}
.availability-room-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.availability-room-content {
  flex: 1;
  min-width: 0;
  padding: var(--space-4) var(--space-5);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
}
.availability-room-content h4 {
  font-family: var(--font-family-heading);
  font-size: var(--font-size-title-sm);
  color: var(--color-heading);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.availability-room-meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2) var(--space-4);
  color: var(--color-text-soft);
  font-size: var(--font-size-body-sm);
}
.availability-room-meta span {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  white-space: nowrap;
}
.availability-room-meta .material-symbols-outlined {
  font-size: 16px;
  color: var(--color-text-muted);
}
.availability-room-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-3);
}

/* Confirm Drawer */
.booking-confirm-drawer {
  width: min(800px, 100%);
}
.booking-confirm-content {
  padding: var(--space-6);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}
.booking-summary-card {
  display: flex;
  background: var(--color-surface-2);
  border-radius: var(--radius-2xl);
  overflow: hidden;
  border: 1px solid var(--color-border);
}
.booking-summary-image {
  width: 200px;
}
.booking-summary-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.booking-summary-info {
  padding: var(--space-4);
  flex: 1;
}
.booking-summary-info h4 {
  font-family: var(--font-family-heading);
  font-size: var(--font-size-title-sm);
  color: var(--color-heading);
  margin: 0 0 var(--space-2);
}
.booking-summary-info p {
  font-size: var(--font-size-body-sm);
  color: var(--color-text-soft);
  margin: 0;
}
.booking-price-card,
.booking-form-card {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-2xl);
  padding: var(--space-5);
}
.booking-price-card h5,
.booking-form-card h5 {
  font-family: var(--font-family-heading);
  font-size: var(--font-size-title-sm);
  color: var(--color-heading);
  margin: 0 0 var(--space-4);
}
.booking-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
}

.payment-option-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3);
}

.payment-option-item {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  padding: var(--space-3) var(--space-4);
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  cursor: pointer;
  transition: var(--transition-hover);
}

.payment-option-item:hover {
  border-color: color-mix(in srgb, var(--color-primary-300) 70%, white 30%);
}

.payment-option-item input[type="radio"] {
  margin-top: 2px;
  accent-color: var(--color-primary);
}

.payment-option-item strong {
  display: block;
  color: var(--color-heading);
  font-size: var(--font-size-body-sm);
  font-weight: var(--font-weight-bold);
}

.payment-option-item span {
  display: block;
  color: var(--color-text-soft);
  font-size: var(--font-size-caption);
  margin-top: 2px;
}

.payment-option-item--active {
  border-color: var(--color-primary);
  background: color-mix(in srgb, var(--color-primary-50) 55%, white 45%);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-primary-100) 50%, transparent 50%);
}

/* Transitions */
/* ── Availability drawer extra styles ───────────────────────────────── */
.availability-close-btn {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
  border: 1px solid var(--color-border);
  background: transparent;
  color: var(--color-text-soft);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition-hover);
}
.availability-close-btn:hover {
  background: var(--color-surface-2);
  color: var(--color-heading);
}
.availability-close-btn .material-symbols-outlined {
  font-size: 20px;
}

.availability-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-16);
  gap: var(--space-4);
  color: var(--color-text-muted);
}
.availability-loading .material-symbols-outlined {
  font-size: 40px;
  color: var(--color-primary);
}

/* Empty / Unavailable state */
.availability-empty-card {
  padding: var(--space-8) var(--space-6);
  text-align: center;
}
.availability-empty-card h4 {
  font-family: var(--font-family-heading);
  font-size: var(--font-size-title-md);
  color: var(--color-heading);
  margin-bottom: var(--space-3);
}
.availability-empty-card p {
  color: var(--color-text-soft);
  font-size: var(--font-size-body-md);
  line-height: 1.6;
  max-width: 480px;
  margin: 0 auto var(--space-6);
}
.availability-empty-actions {
  display: flex;
  gap: var(--space-3);
  justify-content: center;
  flex-wrap: wrap;
}

/* Primary CTA button */
.primary-checkout-btn {
  background: var(--color-primary);
  color: #ffffff;
  border: none;
  padding: 14px 32px;
  border-radius: 8px;
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-body-md);
  cursor: pointer;
  transition: var(--transition-hover);
  letter-spacing: 0.02em;
}
.primary-checkout-btn:hover:not(:disabled) {
  background: var(--color-primary-dark);
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(0, 103, 104, 0.3);
}
.primary-checkout-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
.view-similar-btn {
  background: var(--color-navy);
}
.view-similar-btn:hover:not(:disabled) {
  background: var(--color-navy-dark);
}

/* Booking confirm footer */
.booking-confirm-footer {
  padding: var(--space-5) var(--space-6);
  border-top: 1px solid var(--color-border-soft);
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.booking-confirm-footer .primary-checkout-btn {
  width: auto;
  padding: 10px 28px;
  font-size: var(--font-size-body-md);
}

/* Price breakdown rows in confirm drawer */
.breakdown-row {
  display: flex;
  justify-content: space-between;
  font-size: var(--font-size-body-sm);
  color: var(--color-text-soft);
  padding: var(--space-2) 0;
}
.breakdown-row.total {
  font-weight: var(--font-weight-bold);
  color: var(--color-heading);
  font-size: var(--font-size-body-md);
  border-top: 1px dashed var(--color-border);
  margin-top: var(--space-2);
  padding-top: var(--space-3);
}

/* Booking form inputs */
.booking-field {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.booking-field-full {
  grid-column: 1 / -1;
}
.booking-field span {
  font-size: var(--font-size-body-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-soft);
}
.booking-field input,
.booking-field textarea {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-3) var(--space-4);
  font-size: var(--font-size-body-sm);
  background: var(--color-surface);
  color: var(--color-text);
  outline: none;
  transition: var(--transition-hover);
}
.booking-field input:focus,
.booking-field textarea:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(0, 103, 104, 0.1);
}
.booking-error-text {
  color: var(--color-danger);
  font-size: var(--font-size-body-sm);
  margin: var(--space-2) 0 0;
}

/* Booking feedback (success) drawer */
.booking-feedback-drawer {
  width: min(600px, 100%);
}
.booking-feedback-card {
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
.booking-feedback-card p {
  font-size: var(--font-size-body-md);
  color: var(--color-text-soft);
  margin: 0;
}
.booking-feedback-card strong {
  color: var(--color-heading);
}
.booking-feedback-actions {
  padding: var(--space-5) var(--space-6);
  border-top: 1px solid var(--color-border-soft);
  display: flex;
  gap: var(--space-3);
  flex-wrap: wrap;
}

@media (max-width: 860px) {
  .payment-option-grid {
    grid-template-columns: 1fr;
  }
}

/* No reviews state */
.no-reviews-msg {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-12) 0;
  color: var(--color-text-muted);
}
.no-reviews-msg .material-symbols-outlined {
  font-size: 48px;
  color: var(--color-border);
}
.no-reviews-msg p {
  font-size: var(--font-size-body-md);
  margin: 0;
}

/* Submit success */
.submit-success-msg {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--color-success);
  font-size: var(--font-size-body-sm);
  font-weight: var(--font-weight-semibold);
  margin: 0;
}
.feedback-actions {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

/* Review rating text */
.review-rating-text {
  font-size: var(--font-size-caption);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-muted);
  margin-left: var(--space-1);
}

/* Transitions */
.availability-drawer-enter-active,
.availability-drawer-leave-active {
  transition: all 0.3s ease;
}
.availability-drawer-enter-from,
.availability-drawer-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.date-picker-shell {
  width: 100%;
  height: 48px;
  background: white;
  border: 1px solid color-mix(in srgb, var(--color-gray-200) 74%, white 26%);
  border-radius: 8px;
  position: relative;
  transition: all 0.2s ease;
}

.date-picker-shell:hover {
  border-color: color-mix(in srgb, var(--color-primary-200) 68%, white 32%);
}

.guest-trigger {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0 1rem;
  height: 48px;
  background: white;
  border: 1px solid color-mix(in srgb, var(--color-gray-200) 74%, white 26%);
  border-radius: 8px;
  position: relative;
  text-align: left;
  transition: all 0.2s ease;
  cursor: pointer;
}

.guest-trigger:hover,
.guest-trigger--open {
  border-color: color-mix(in srgb, var(--color-primary-200) 68%, white 32%);
  box-shadow:
    0 0 0 3px color-mix(in srgb, var(--color-primary-50) 60%, transparent 40%),
    inset 0 1px 0 rgba(255, 255, 255, 0.78);
}

.date-picker-shell__icon,
.guest-trigger__icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-primary-600);
  font-size: 20px;
  z-index: 2;
}

.guest-trigger__copy {
  min-width: 0;
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-left: 32px; /* Total 14px left + 32px padding = 46px offset for text */
}

.guest-trigger__copy strong {
  color: var(--color-navy-700);
  font-size: 0.85rem;
  font-weight: 700;
  white-space: nowrap;
}

.guest-trigger__copy span {
  color: var(--color-gray-500);
  font-size: 11px;
  font-weight: 500;
  white-space: nowrap;
}

.date-picker-shell__chevron,
.guest-trigger__chevron {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-gray-400);
  font-size: 18px;
  transition: transform 0.2s ease;
  z-index: 2;
}

.guest-trigger--open .guest-trigger__chevron {
  transform: translateY(-50%) rotate(180deg);
}

/* ── Exact DatePicker Styles from Hotels Filter Page ───────────────── */
.date-picker-shell {
  position: relative;
  width: 100%;
}

.date-picker-shell__chevron {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  color: var(--color-gray-500);
  font-size: 18px;
  pointer-events: none;
  transition: transform 0.2s ease;
}

.date-picker-shell:focus-within .date-picker-shell__chevron {
  transform: translateY(-50%) rotate(180deg);
}

:deep(.filter-date-picker.p-datepicker) {
  width: 100%;
  background: linear-gradient(
    180deg,
    white 0%,
    color-mix(in srgb, var(--color-gray-50) 72%, white 28%) 100%
  ) !important;
  border: 1px solid color-mix(in srgb, var(--color-gray-200) 74%, white 26%) !important;
  border-radius: 8px !important;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.78) !important;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
  cursor: pointer;
}

:deep(.filter-date-picker.p-datepicker:hover),
:deep(.filter-date-picker.p-datepicker.p-focus) {
  border-color: color-mix(
    in srgb,
    var(--color-primary-200) 68%,
    white 32%
  ) !important;
  box-shadow:
    0 0 0 3px color-mix(in srgb, var(--color-primary-50) 60%, transparent 40%),
    inset 0 1px 0 rgba(255, 255, 255, 0.78) !important;
}

:deep(.filter-date-picker .p-inputtext) {
  width: 100%;
  height: 48px;
  line-height: 48px;
  border: 0;
  background: transparent !important;
  color: var(--color-navy-700);
  font-size: 0.85rem;
  font-weight: 700;
  padding: 0 2.5rem 0 46px !important; /* 46px left to match guest-trigger offset */
  cursor: pointer;
}

:deep(.filter-date-picker .p-datepicker-input-icon-container) {
  left: 0.9rem !important;
  right: auto;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary-600);
}

/* Calendar Panel Styling - Matching Index Page Exactly */
:deep(.p-datepicker-panel) {
  background: white !important;
  border: 1px solid color-mix(in srgb, var(--color-gray-200) 76%, white 24%) !important;
  border-radius: 20px !important;
  box-shadow: 0 28px 54px rgba(15, 23, 42, 0.18) !important;
  margin-top: 8px !important;
  padding: 0.9rem !important;
  z-index: 1100 !important;
}

:deep(.p-datepicker-header) {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  border-bottom: 1px solid var(--color-gray-200) !important;
  padding: 0.5rem 1rem !important;
  margin-bottom: 0.24rem !important;
  background: transparent !important;
}

:deep(.p-datepicker-title) {
  font-size: 0.95rem !important;
  font-weight: 800 !important;
  color: var(--color-navy-500) !important;
}

:deep(.p-datepicker-prev-button),
:deep(.p-datepicker-next-button) {
  width: 1.72rem !important;
  height: 1.72rem !important;
  border-radius: 999px !important;
  color: var(--color-gray-500) !important;
  transition: all 0.2s ease !important;
}

:deep(.p-datepicker-prev-button:hover),
:deep(.p-datepicker-next-button:hover) {
  background: color-mix(
    in srgb,
    var(--color-primary-50) 72%,
    white 28%
  ) !important;
  color: var(--color-primary-700) !important;
}

:deep(.p-datepicker-calendar th) {
  padding: 0.14rem 0 0.28rem !important;
  font-size: 0.69rem !important;
  font-weight: 700 !important;
  color: var(--color-gray-500) !important;
  text-transform: uppercase !important;
}

:deep(.p-datepicker-day) {
  width: 2.06rem !important;
  height: 2.06rem !important;
  border-radius: 0.66rem !important;
  font-size: 0.88rem !important;
  font-weight: 600 !important;
  transition: all 0.2s ease !important;
}

:deep(.p-datepicker-day:not(.p-disabled):hover) {
  background: color-mix(
    in srgb,
    var(--color-primary-50) 72%,
    white 28%
  ) !important;
  color: var(--color-primary-700) !important;
}

:deep(.p-datepicker-day-selected) {
  background: linear-gradient(
    145deg,
    #0a7677 0%,
    var(--color-primary-600) 100%
  ) !important;
  color: white !important;
  box-shadow: 0 8px 18px rgba(0, 80, 81, 0.34) !important;
}

:deep(.p-datepicker-today .p-datepicker-day) {
  color: var(--color-primary-600) !important;
  border: 1px solid var(--color-primary-100) !important;
}

/* Child Age Select Premium */
.child-age-select-premium {
  width: 100% !important;
}
:deep(.child-age-select-premium.p-select) {
  background: var(--color-surface-2) !important;
  border: 1px solid var(--color-border) !important;
  border-radius: 10px !important;
  height: 38px !important;
  display: flex !important;
  align-items: center !important;
}
:deep(.child-age-select-premium .p-select-label) {
  font-size: var(--font-size-body-sm) !important;
  font-weight: 600 !important;
  color: var(--color-text) !important;
  padding: 0 10px !important;
}
:deep(.child-age-select-premium .p-select-dropdown) {
  width: 30px !important;
}
</style>
