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
          <button class="action-btn"><span class="material-symbols-outlined">ios_share</span> Share</button>
          <button class="action-btn"><span class="material-symbols-outlined">favorite</span> Save</button>
        </div>
      </nav>

      <!-- Header Section -->
      <header class="detail-header">
        <div class="header-main">
          <div class="title-wrap">
            <h1 class="hotel-title">{{ hotel.name }}</h1>
            <div class="stars">
              <span v-for="i in 5" :key="i" class="material-symbols-outlined" :class="{ 'active': i <= hotel.stars }">star</span>
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
        <div class="gallery-grid" v-if="hotel.images && hotel.images.length >= 3">
          <div class="main-photo">
            <img :src="hotel.images[0]" :alt="hotel.name">
          </div>
          <div class="side-photos">
            <div class="photo-wrap">
              <img :src="hotel.images[1]" alt="Interior">
            </div>
            <div class="photo-wrap relative">
              <img :src="hotel.images[2]" alt="Exterior">
              <div v-if="hotel.images.length > 3" class="more-photos-overlay">
                <span class="material-symbols-outlined">photo_library</span>
                <span>+{{ hotel.images.length - 3 }} photos</span>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="fallback-gallery">
          <img v-if="hotel.images && hotel.images.length > 0" :src="hotel.images[0]" :alt="hotel.name">
          <span v-else class="material-symbols-outlined">image_not_supported</span>
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
              <div class="amenity-item" v-for="amenity in hotel?.amenities || defaultAmenities.map(a => a.label)" :key="amenity">
                <span class="material-symbols-outlined">{{ getAmenityIcon(amenity) }}</span>
                <span>{{ amenity }}</span>
              </div>
            </div>
          </section>

          <!-- Rooms -->
          <section class="content-section">
            <h2 class="section-title" id="rooms">Rooms & Availability</h2>
            <div class="rooms-list">
              <div v-for="room in rooms" :key="room.id" class="premium-room-card">
                <div class="room-image">
                  <img :src="room.image || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=400&q=80'" alt="Room">
                </div>
                <div class="room-content">
                  <div class="room-header">
                    <h3>{{ room.type }}</h3>
                    <div class="room-features">
                      <span><span class="material-symbols-outlined">person</span>Up to {{ room.capacity }} guests</span>
                      <span><span class="material-symbols-outlined">king_bed</span>1 King Size Bed</span>
                      <span><span class="material-symbols-outlined">aspect_ratio</span>32 m²</span>
                    </div>
                  </div>
                  <div class="room-footer">
                    <div class="price-block">
                      <span class="price-val">{{ room.pricePerNight }}€</span>
                      <span class="price-unit">/ night</span>
                    </div>
                    <button v-if="room.status === 'AVAILABLE'" class="book-btn-outline">Select</button>
                    <button v-else class="book-btn-outline disabled">Unavailable</button>
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
                <p class="reviews-subtitle">Average based on {{ reviews.length }} verified reviews</p>
              </div>
              <div class="global-rating-block">
                <span class="rating-score">{{ (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length || 0).toFixed(1) }}</span>
                <div class="rating-context">
                  <div class="stars-gold"><span v-for="i in 5" class="material-symbols-outlined">star</span></div>
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
                      :key="'star-'+i" 
                      class="material-symbols-outlined star-btn" 
                      :class="{ 'active': i <= newReviewRating }"
                      @click="newReviewRating = i"
                    >star</span>
                  </div>
                </div>
                <textarea 
                  v-model="newReviewText" 
                  class="feedback-textarea" 
                  placeholder="Share your experience at this property..."
                  rows="4"
                ></textarea>
                <div class="feedback-actions">
                  <p v-if="submitSuccess" class="submit-success-msg"><span class="material-symbols-outlined">check_circle</span> Your review was submitted!</p>
                  <button 
                    class="submit-review-btn" 
                    @click="handleSubmitReview" 
                    :disabled="!newReviewText.trim() || submitting"
                  >{{ submitting ? 'Submitting...' : 'Submit Review' }}</button>
                </div>
              </div>
            </div>

            <!-- All Reviews List -->
            <div class="all-reviews-section" v-if="reviews.length > 0">
              <h3 class="subsection-title">All Reviews ({{ reviews.length }})</h3>
              <div class="reviews-list">
                <div class="review-card" v-for="review in reviews" :key="review.id">
                  <div class="reviewer-prof">
                    <div class="avatar-circle">
                      {{ (review.authorName || String(review.accountId)).charAt(0).toUpperCase() }}
                    </div>
                    <div class="reviewer-meta">
                      <strong>{{ review.authorName || `Guest #${review.accountId}` }}</strong>
                      <span>{{ new Date(review.publicationDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }}</span>
                    </div>
                  </div>
                  <div class="review-stars-small">
                    <span v-for="s in 5" :key="s" class="material-symbols-outlined" :class="{ 'active': s <= review.rating }">star</span>
                    <span class="review-rating-text">{{ review.rating }}/5</span>
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
              <span class="price-display">From <strong>120€</strong> <span>/ night</span></span>
              <div class="rating-small">
                <span class="material-symbols-outlined">star</span> 4.8
              </div>
            </div>

            <div class="booking-inputs">
              <div class="date-picker-mock">
                <div class="date-field border-right">
                  <label>CHECK-IN</label>
                  <span>Apr 17, 2026</span>
                </div>
                <div class="date-field">
                  <label>CHECK-OUT</label>
                  <span>Apr 20, 2026</span>
                </div>
              </div>
              <div class="guest-picker-mock">
                <label>GUESTS</label>
                <span>2 adults, 0 children</span>
                <span class="material-symbols-outlined expand-icon">expand_more</span>
              </div>
            </div>

            <button class="primary-checkout-btn">Check Availability</button>
            <p class="no-charge-text">You won't be charged at this point</p>

            <div class="price-breakdown">
              <div class="breakdown-row">
                <span>120€ x 3 nights</span>
                <span>360€</span>
              </div>
              <div class="breakdown-row">
                <span>City tax</span>
                <span>15€</span>
              </div>
              <div class="breakdown-row total">
                <span>Total</span>
                <span>375€</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useHotels } from '~/composables/useHotels'
import { useRooms } from '~/composables/useRooms'
import { useAuth } from '~/composables/useAuth'
import { useAuthPrompt } from '~/composables/useAuthPrompt'
import type { Hotel } from '~/types/models'

const route = useRoute()
const { isAuthenticated, currentProfile } = useAuth()
const authPrompt = useAuthPrompt()
const { getById } = useHotels()
const { rooms, fetchByHotel } = useRooms()
const { reviews, fetchByHotel: fetchReviews, submitReview } = useReviews()

const hotel = ref<Hotel | null>(null)
const loading = ref(true)

const newReviewText = ref('')
const newReviewRating = ref(5)
const submitting = ref(false)
const submitSuccess = ref(false)

async function handleSubmitReview() {
  if (!isAuthenticated.value) {
    authPrompt.open({
      title: 'Share your experience',
      message: 'Please sign in or create an account to leave a review for this hotel.',
      icon: 'rate_review',
      eyebrow: 'Review access',
      redirectTo: route.fullPath
    })
    return
  }

  if (!newReviewText.value.trim() || !hotel.value) return
  const firstName = currentProfile.value?.firstName?.trim() ?? ''
  const lastName = currentProfile.value?.lastName?.trim() ?? ''
  const authorName = `${firstName} ${lastName}`.trim() || 'Anonymous Guest'
  submitting.value = true
  submitSuccess.value = false
  await submitReview({
    hotelId: hotel.value.id,
    accountId: currentProfile.value?.accountId,
    authorName,
    rating: newReviewRating.value,
    comment: newReviewText.value,
    visible: true
  })
  newReviewText.value = ''
  newReviewRating.value = 5
  submitting.value = false
  submitSuccess.value = true
  setTimeout(() => { submitSuccess.value = false }, 4000)
}

const defaultAmenities = [
  { icon: 'wifi', label: 'Free high-speed Wi-Fi' },
  { icon: 'pool', label: 'Heated outdoor pool' },
  { icon: 'fitness_center', label: '24/7 Fitness center' },
  { icon: 'local_bar', label: 'Lounge bar & Cocktails' },
  { icon: 'restaurant', label: 'Gourmet restaurant' },
  { icon: 'spa', label: 'Spa & wellness center' }
]

function getAmenityIcon(amenity: string) {
  const amenityMap: Record<string, string> = {
    'Free high-speed Wi-Fi': 'wifi',
    'Heated outdoor pool': 'pool',
    '24/7 Fitness center': 'fitness_center',
    'Lounge bar & Cocktails': 'local_bar',
    'Gourmet restaurant': 'restaurant',
    'Spa & wellness center': 'spa'
  }
  return amenityMap[amenity] || 'check_circle'
}

onMounted(async () => {
  const id = Number(route.params.id)
  if (!isNaN(id)) {
    const data = await getById(id)
    if (data) {
      hotel.value = data
      await Promise.all([fetchByHotel(id), fetchReviews(id)])
    }
  }
  loading.value = false
})
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

.rotating { animation: spin 1s linear infinite; font-size: 40px; margin-bottom: 16px; }
@keyframes spin { 100% { transform: rotate(360deg); } }

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

.breadcrumbs a { color: #64748b; text-decoration: none; transition: color 0.2s; }
.breadcrumbs a:hover { color: #015081; text-decoration: underline; }
.breadcrumbs .active { color: #015081; font-weight: 600; }
.separator { font-size: 16px; }

.nav-actions { display: flex; gap: 16px; }
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
.action-btn:hover { background: #f1f5f9; }
.action-btn .material-symbols-outlined { font-size: 18px; }

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

.stars { display: flex; gap: 2px; }
.stars .material-symbols-outlined { font-size: 20px; color: #e2e8f0; font-variation-settings: 'FILL' 1; }
.stars .active { color: #CDAF5D; }

.location-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #475569;
}
.location-badge .material-symbols-outlined { font-size: 18px; color: #015081; }
.map-link { font-weight: 600; color: #008F90; text-decoration: underline; margin-left: 8px; cursor: pointer; }

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

.main-photo { height: 100%; }
.main-photo img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; cursor: pointer; }
.main-photo:hover img { transform: scale(1.02); }

.side-photos {
  display: grid;
  grid-template-rows: 1fr 1fr;
  gap: 12px;
}

.photo-wrap { overflow: hidden; position: relative; cursor: pointer; height: 100%; border-radius: 8px;}
.photo-wrap img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.photo-wrap:hover img { transform: scale(1.02); }

.relative { position: relative; }

.more-photos-overlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.4);
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
.more-photos-overlay:hover { background: rgba(0,0,0,0.5); }
.more-photos-overlay .material-symbols-outlined { font-size: 32px; }

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
.fallback-gallery img { width: 100%; height: 100%; object-fit: cover; }
.fallback-gallery .material-symbols-outlined { font-size: 64px; }

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
  .content-layout { grid-template-columns: 1fr; }
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
.amenity-item .material-symbols-outlined { color: #008F90; font-size: 24px; }

/* Rooms List */
.premium-room-card {
  display: flex;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 16px;
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
  background: white;
}
.premium-room-card:hover {
  box-shadow: 0 4px 12px rgba(1, 80, 129, 0.08); /* Reduced hover intensity */
  border-color: #cbd5e1;
}

.room-image { width: 220px; flex-shrink: 0; }
.room-image img { width: 100%; height: 100%; object-fit: cover; }

.room-content {
  padding: 16px 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.room-header h3 { font-size: 18px; color: #015081; margin: 0 0 12px 0; font-weight: 700; }
.room-features { display: flex; gap: 16px; flex-wrap: wrap; }
.room-features span { display: flex; align-items: center; gap: 6px; font-size: 13px; color: #475569; }
.room-features .material-symbols-outlined { font-size: 18px; color: #94a3b8; }

.room-footer { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 24px; }
.price-val { font-size: 24px; font-weight: 800; color: #008F90; }
.price-unit { font-size: 13px; color: #64748b; margin-left: 4px; }

.book-btn-outline {
  padding: 10px 24px;
  border: 2px solid #008F90;
  background: white;
  color: #008F90;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}
.book-btn-outline:hover { background: #008F90; color: white; }
.book-btn-outline.disabled { border-color: #cbd5e1; color: #94a3b8; cursor: not-allowed; }
.book-btn-outline.disabled:hover { background: white; color: #94a3b8; }

/* Reviews & Ratings (Notes) */
.reviews-header-advanced {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.reviews-subtitle { color: #64748b; font-size: 13px; margin-top: 4px; }
.m-0 { margin: 0; }

.global-rating-block { display: flex; align-items: center; gap: 12px; background: #fdfbf7; padding: 12px 16px; border-radius: 12px; border: 1px solid #f6ecd6; }
.rating-score { font-size: 36px; font-weight: 800; color: #001d34; line-height: 1; }
.stars-gold { display: flex; margin-bottom: 2px; }
.stars-gold .material-symbols-outlined { color: #CDAF5D; font-variation-settings: 'FILL' 1; font-size: 16px; }
.rating-context { display: flex; flex-direction: column; }
.rating-context span { font-weight: 700; font-size: 13px; color: #334155; }

.reviews-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
.review-card { padding: 20px; background: #f8fafc; border-radius: 12px; border: 1px solid #f1f5f9; transition: box-shadow 0.2s ease; margin-bottom: 12px; }
.review-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.05); border-color: #e2e8f0; }
.reviewer-prof { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
.avatar-circle { width: 40px; height: 40px; background: #015081; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 16px; flex-shrink: 0; }
.reviewer-meta strong { display: block; font-size: 14px; color: #001d34; font-weight: 600; }
.reviewer-meta span { font-size: 12px; color: #64748b; }
.review-stars-small { display: flex; align-items: center; gap: 4px; margin-bottom: 10px; }
.review-stars-small .material-symbols-outlined { font-size: 15px; color: #e2e8f0; font-variation-settings: 'FILL' 1; }
.review-stars-small .material-symbols-outlined.active { color: #CDAF5D; }
.review-rating-text { font-size: 12px; font-weight: 700; color: #64748b; margin-left: 4px; }
.review-body { font-size: 14px; line-height: 1.6; color: #334155; margin: 0; }

.all-reviews-section { margin-top: 32px; }
.reviews-list { display: flex; flex-direction: column; gap: 0; }

.no-reviews-msg { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 40px 20px; color: #94a3b8; text-align: center; }
.no-reviews-msg .material-symbols-outlined { font-size: 40px; }
.no-reviews-msg p { font-size: 14px; margin: 0; }

/* Feedback Form */
.mb-3 { margin-bottom: 12px; }
.rating-label { font-size: 14px; font-weight: 600; color: #001d34; margin-right: 10px; }

.feedback-form-container { margin-top: 28px; border-top: 1px solid #e2e8f0; padding-top: 24px; }
.feedback-card { background: #f8fafc; border: 1px solid #f1f5f9; border-radius: 12px; padding: 20px; }
.rating-selector { display: flex; align-items: center; margin-bottom: 12px; }
.stars-interactive { display: flex; gap: 4px; }
.star-btn { font-size: 26px; color: #e2e8f0; font-variation-settings: 'FILL' 1; cursor: pointer; transition: color 0.15s, transform 0.15s; }
.star-btn.active { color: #CDAF5D; }
.star-btn:hover { transform: scale(1.15); color: #CDAF5D; }
.feedback-textarea { width: 100%; border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px; font-size: 14px; color: #334155; font-family: inherit; resize: vertical; margin-bottom: 12px; transition: border-color 0.2s, box-shadow 0.2s; outline: none; box-sizing: border-box; }
.feedback-textarea:focus { border-color: #008F90; box-shadow: 0 0 0 3px rgba(0, 143, 144, 0.1); }
.feedback-actions { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.submit-review-btn { background: #008F90; color: white; border: none; padding: 10px 22px; border-radius: 8px; font-weight: 700; font-size: 14px; cursor: pointer; transition: all 0.2s; margin-left: auto; }
.submit-review-btn:hover:not(:disabled) { background: #007677; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,143,144,0.25); }
.submit-review-btn:disabled { background: #cbd5e1; cursor: not-allowed; opacity: 0.7; transform: none; }
.submit-success-msg { display: flex; align-items: center; gap: 6px; color: #008F90; font-size: 13px; font-weight: 600; }
.submit-success-msg .material-symbols-outlined { font-size: 18px; }

/* Sticky Sidebar Widget */
.sidebar-wrapper { position: relative; }
.sticky-booking-widget {
  position: sticky;
  top: 32px;
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 20px 40px rgba(1, 80, 129, 0.08);
  border: 1px solid #e2e8f0;
}

.widget-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.price-display { font-size: 14px; color: #334155; }
.price-display strong { font-size: 24px; font-weight: 800; color: #001d34; margin: 0 2px; }
.rating-small { display: flex; align-items: center; gap: 4px; font-weight: 700; font-size: 14px; }
.rating-small .material-symbols-outlined { font-size: 16px; color: #CDAF5D; font-variation-settings: 'FILL' 1; }

.booking-inputs { border: 1px solid #cbd5e1; border-radius: 8px; margin-bottom: 16px; overflow: hidden; }
.date-picker-mock { display: flex; border-bottom: 1px solid #cbd5e1; }
.date-field { flex: 1; padding: 12px; cursor: pointer; transition: background 0.2s; }
.date-field:hover { background: #f8fafc; }
.border-right { border-right: 1px solid #cbd5e1; }
.date-field label { display: block; font-size: 10px; font-weight: 800; color: #015081; margin-bottom: 4px; cursor: pointer;}
.date-field span { font-size: 14px; color: #334155; font-weight: 500; }

.guest-picker-mock { padding: 12px; display: flex; flex-direction: column; position: relative; cursor: pointer; transition: background 0.2s; }
.guest-picker-mock:hover { background: #f8fafc; }
.guest-picker-mock label { font-size: 10px; font-weight: 800; color: #015081; margin-bottom: 4px; cursor: pointer;}
.guest-picker-mock span { font-size: 14px; color: #334155; font-weight: 500; }
.expand-icon { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: #94a3b8; }

.primary-checkout-btn {
  width: 100%;
  padding: 14px;
  background: #008F90;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.2s;
}
.primary-checkout-btn:hover { opacity: 0.9; }

.no-charge-text { text-align: center; font-size: 12px; color: #64748b; margin: 16px 0; }

.price-breakdown { padding-top: 16px; border-top: 1px solid #e2e8f0; }
.breakdown-row { display: flex; justify-content: space-between; font-size: 14px; color: #475569; margin-bottom: 12px; }
.breakdown-row.total { margin-top: 16px; padding-top: 16px; border-top: 1px dashed #cbd5e1; font-weight: 800; color: #001d34; font-size: 16px; }

</style>
