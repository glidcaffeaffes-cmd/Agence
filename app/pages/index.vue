<template>
  <div class="landing-page">
    <!-- Navbar -->
    <header class="header sticky-top">
      <div class="container d-flex justify-content-between align-items-center py-3">
        <div class="logo d-flex align-items-center gap-2">
          <div class="logo-icon"></div>
          <span class="fs-4 fw-bold text-navy">LuxeStay</span>
        </div>
        <nav class="d-none d-md-flex gap-4">
          <a href="#features" class="nav-link">Features</a>
          <a href="#hotels" class="nav-link">Locations</a>
          <a href="#offers" class="nav-link">Offers</a>
          <a href="#reviews" class="nav-link">Reviews</a>
        </nav>
        <div class="actions d-flex gap-3">
          <Button label="Log In" severity="secondary" text class="p-button-sm text-navy fw-semibold" />
          <Button label="Sign Up" class="p-button-sm btn-primary" />
        </div>
      </div>
    </header>

    <!-- 1. Hero Section -->
    <section class="hero position-relative d-flex align-items-center">
      <div class="hero-bg"></div>
      <div class="container position-relative z-1">
        <div class="row">
          <div class="col-lg-8 col-xl-7 text-white py-5">
            <Tag class="mb-3 bg-accent text-white border-0 px-3 py-1 fw-semibold">Premium Booking</Tag>
            <h1 class="display-3 fw-bold mb-4 font-playfair">Find Your Perfect <br><span class="text-accent">Getaway</span> Today</h1>
            <p class="fs-5 mb-5 text-gray-100 fw-light" style="max-width: 600px;">
              Experience the world's most luxurious destinations with seamless booking, instant confirmations, and exclusive VIP privileges.
            </p>
            <div class="d-flex gap-3 flex-wrap">
              <Button label="Explore Hotels" size="large" class="btn-primary px-4 py-3 fw-bold" />
              <Button label="Partner With Us" size="large" outlined class="text-white border-white px-4 py-3 fw-bold hero-btn-outlined border-2" />
            </div>
            <div class="mt-5 d-flex align-items-center gap-4">
              <div class="d-flex align-items-center gap-2">
                <i class="pi pi-check-circle text-accent fs-5"></i>
                <span class="text-white-50">Free Cancellations</span>
              </div>
              <div class="d-flex align-items-center gap-2">
                <i class="pi pi-check-circle text-accent fs-5"></i>
                <span class="text-white-50">Best Price Guarantee</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 2. Search / Booking Preview -->
        <div class="search-widget mt-5 p-4 rounded-4 shadow-lg bg-white position-relative shadow-card">
          <div class="row g-3 align-items-end">
            <div class="col-md-3">
              <label class="form-label text-navy fw-semibold small">Destination</label>
              <div class="p-inputgroup">
                <span class="p-inputgroup-addon bg-transparent border-end-0 text-primary">
                  <i class="pi pi-map-marker"></i>
                </span>
                <InputText placeholder="Where to?" class="w-100 border-start-0" />
              </div>
            </div>
            <div class="col-md-3">
              <label class="form-label text-navy fw-semibold small">Check In</label>
              <div class="p-inputgroup">
                <span class="p-inputgroup-addon bg-transparent border-end-0 text-primary">
                  <i class="pi pi-calendar"></i>
                </span>
                <InputText placeholder="Dates" class="w-100 border-start-0" />
              </div>
            </div>
            <div class="col-md-3">
              <label class="form-label text-navy fw-semibold small">Guests</label>
              <div class="p-inputgroup">
                <span class="p-inputgroup-addon bg-transparent border-end-0 text-primary">
                  <i class="pi pi-users"></i>
                </span>
                <InputText placeholder="2 Adults" class="w-100 border-start-0" />
              </div>
            </div>
            <div class="col-md-3">
              <Button label="Search Hotels" class="w-100 btn-primary py-3 fw-bold" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 3. Value Proposition / Features Section -->
    <section id="features" class="py-6 bg-gray-50">
      <div class="container py-5">
        <div class="text-center mb-5">
          <span class="text-primary fw-bold text-uppercase tracking-wide small">Why Choose Us</span>
          <h2 class="display-6 fw-bold text-navy mt-2 font-playfair">Excellence in Every Stay</h2>
        </div>
        <div class="row g-4">
          <div class="col-md-4" v-for="(feature, index) in features" :key="index">
            <div class="feature-card h-100 p-4 bg-white rounded-4 shadow-sm border-0 transition-all">
              <div class="icon-box bg-primary-50 text-primary rounded-circle d-flex align-items-center justify-content-center mb-4" style="width: 60px; height: 60px;">
                <i :class="feature.icon" class="fs-4"></i>
              </div>
              <h4 class="text-navy fw-bold mb-3">{{ feature.title }}</h4>
              <p class="text-gray-600 mb-0 line-height-3">{{ feature.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 4. Hotel Experience / Showcase Section -->
    <section id="hotels" class="py-6">
      <div class="container py-5">
        <div class="d-flex justify-content-between align-items-end mb-5">
          <div>
            <span class="text-primary fw-bold text-uppercase tracking-wide small">Premium Collection</span>
            <h2 class="display-6 fw-bold text-navy mt-2 font-playfair">Featured Locations</h2>
          </div>
          <Button label="View All" text icon="pi pi-arrow-right" iconPos="right" class="text-primary fw-bold hover-underline d-none d-md-flex" />
        </div>
        <div class="row g-4">
          <div class="col-md-4" v-for="(hotel, index) in showcaseHotels" :key="index">
            <div class="hotel-card rounded-4 overflow-hidden position-relative group-hover cursor-pointer shadow-sm">
              <div class="badge-wrapper position-absolute top-0 end-0 p-3 z-1">
                <Tag v-if="hotel.tag" :value="hotel.tag" class="bg-white text-navy fw-bold shadow-sm" rounded />
              </div>
              <div class="image-wrapper position-relative overflow-hidden" style="height: 300px;">
                <div class="overlay"></div>
                <div class="bg-image w-100 h-100" :style="{ backgroundColor: hotel.color }"></div>
              </div>
              <div class="content p-4 bg-white border border-top-0 rounded-bottom-4">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <span class="text-gray-500 small fw-semibold d-flex align-items-center"><i class="pi pi-map-marker me-1 text-primary"></i>{{ hotel.location }}</span>
                  <div class="d-flex align-items-center">
                    <i class="pi pi-star-fill text-accent small me-1"></i>
                    <span class="fw-bold text-navy small">{{ hotel.rating }}</span>
                  </div>
                </div>
                <h4 class="fw-bold text-navy mb-2">{{ hotel.name }}</h4>
                <div class="d-flex justify-content-between align-items-center mt-3 pt-3 border-top border-gray-200">
                  <div>
                    <span class="text-gray-500 small">Starting at </span>
                    <span class="fw-bold text-primary fs-5">${{ hotel.price }}</span>
                    <span class="text-gray-500 small">/night</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 5. Benefits Section -->
    <section class="py-6 bg-navy text-white">
      <div class="container py-5">
        <div class="row align-items-center">
          <div class="col-lg-6 mb-5 mb-lg-0 pe-lg-5">
            <h2 class="display-5 fw-bold mb-4 font-playfair">For Travelers & Partners</h2>
            <p class="text-navy-200 fs-5 mb-5 lh-lg">Whether you're looking for your next vacation spot or seeking to effortlessly manage your hotel's reservations, our platform adapts to your needs with absolute precision.</p>
            <div class="d-flex gap-3 mb-4">
              <Button label="I am a Guest" @click="benefitTab = 'guest'" :class="benefitTab === 'guest' ? 'btn-primary' : 'p-button-outlined text-white border-white border-2'" class="fw-bold px-4 py-2 rounded-pill shadow-none" rounded />
              <Button label="I am a Partner" @click="benefitTab = 'partner'" :class="benefitTab === 'partner' ? 'btn-primary' : 'p-button-outlined text-white border-white border-2'" class="fw-bold px-4 py-2 rounded-pill shadow-none" rounded />
            </div>
            
            <div v-if="benefitTab === 'guest'" class="fade-in">
              <div class="benefit-item d-flex gap-3 mb-4">
                <div class="icon-circle bg-white text-navy flex-shrink-0"><i class="pi pi-search fs-5"></i></div>
                <div>
                  <h5 class="fw-bold text-white">Smart Discovery</h5>
                  <p class="text-navy-200 mb-0">Find exactly what you want with our advanced filtering and recommendation engine.</p>
                </div>
              </div>
              <div class="benefit-item d-flex gap-3">
                <div class="icon-circle bg-white text-navy flex-shrink-0"><i class="pi pi-shield fs-5"></i></div>
                <div>
                  <h5 class="fw-bold text-white">Secure & Instant Booking</h5>
                  <p class="text-navy-200 mb-0">Your reservation is confirmed immediately with our secure payment processing.</p>
                </div>
              </div>
            </div>
            
            <div v-if="benefitTab === 'partner'" class="fade-in">
              <div class="benefit-item d-flex gap-3 mb-4">
                <div class="icon-circle bg-accent text-white flex-shrink-0"><i class="pi pi-chart-line fs-5"></i></div>
                <div>
                  <h5 class="fw-bold text-white">Insightful Dashboard</h5>
                  <p class="text-navy-200 mb-0">Track revenue, occupancy rates, and channel performance in real time.</p>
                </div>
              </div>
              <div class="benefit-item d-flex gap-3">
                <div class="icon-circle bg-accent text-white flex-shrink-0"><i class="pi pi-users fs-5"></i></div>
                <div>
                  <h5 class="fw-bold text-white">Reservation Management</h5>
                  <p class="text-navy-200 mb-0">Easily handle bookings, cancellations, and guest communication from a single hub.</p>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="device-mockup position-relative z-1">
              <div class="mockup-frame bg-navy-800 rounded-4 p-2 shadow-lg border border-navy-700">
                <div class="mockup-screen bg-gray-50 rounded-3 overflow-hidden d-flex flex-column" style="height: 480px;">
                  <div class="mockup-header bg-white p-3 border-bottom d-flex align-items-center justify-content-between">
                    <div class="fw-bold text-navy"><i class="pi pi-bars me-2"></i>LuxeStay</div>
                    <div class="d-flex gap-2">
                       <span class="rounded-circle bg-gray-200" style="width:12px;height:12px;"></span>
                       <span class="rounded-circle bg-gray-200" style="width:12px;height:12px;"></span>
                       <span class="rounded-circle bg-gray-200" style="width:12px;height:12px;"></span>
                    </div>
                  </div>
                  <div class="mockup-body p-4 bg-gray-100 flex-grow-1">
                    <div class="row g-3 mb-3">
                       <div class="col-6"><div class="bg-white p-3 rounded shadow-sm border-start border-4 border-primary"><div class="text-gray-500 small">Bookings</div><div class="fw-bold fs-4 text-navy">124</div></div></div>
                       <div class="col-6"><div class="bg-white p-3 rounded shadow-sm border-start border-4 border-accent"><div class="text-gray-500 small">Revenue</div><div class="fw-bold fs-4 text-navy">$45k</div></div></div>
                    </div>
                    <div class="bg-white p-3 rounded shadow-sm mb-3">
                       <div class="fw-bold text-navy mb-2 small">Recent Reservations</div>
                       <div class="d-flex justify-content-between align-items-center py-2 border-bottom" v-for="i in 3" :key="i">
                         <div class="d-flex align-items-center gap-2">
                           <Avatar icon="pi pi-user" shape="circle" class="bg-primary-50 text-primary" size="small" />
                           <div class="small fw-semibold text-navy">Guest {{i}}</div>
                         </div>
                         <div class="small text-success fw-bold">Confirmed</div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="decorative-blob position-absolute bg-primary rounded-circle blur-blob z-n1"></div>
              <div class="decorative-blob-2 position-absolute bg-accent rounded-circle blur-blob z-n1"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 6. Stats Section -->
    <section class="py-5 border-bottom border-gray-200">
      <div class="container py-4">
        <div class="row g-4 text-center">
          <div class="col-6 col-md-3">
            <h3 class="display-5 fw-bold text-primary mb-1 font-playfair">5k+</h3>
            <p class="text-gray-500 fw-semibold mb-0">Premium Hotels</p>
          </div>
          <div class="col-6 col-md-3">
            <h3 class="display-5 fw-bold text-primary mb-1 font-playfair">2M+</h3>
            <p class="text-gray-500 fw-semibold mb-0">Happy Guests</p>
          </div>
          <div class="col-6 col-md-3">
            <h3 class="display-5 fw-bold text-primary mb-1 font-playfair">120</h3>
            <p class="text-gray-500 fw-semibold mb-0">Countries</p>
          </div>
          <div class="col-6 col-md-3">
            <h3 class="display-5 fw-bold text-primary mb-1 font-playfair">4.9</h3>
            <p class="text-gray-500 fw-semibold mb-0">Average Rating</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 7. Testimonials Section -->
    <section id="reviews" class="py-6 bg-gray-50">
      <div class="container py-5">
        <div class="text-center mb-5">
          <h2 class="display-6 fw-bold text-navy font-playfair">What Our Guests Say</h2>
        </div>
        <div class="row g-4 justify-content-center">
          <div class="col-md-4" v-for="(review, index) in reviews" :key="index">
            <div class="card border-0 shadow-sm rounded-4 h-100 p-4 pt-5 position-relative mt-4">
              <div class="position-absolute top-0 start-50 translate-middle">
                <Avatar :image="review.avatar" icon="pi pi-user" size="xlarge" shape="circle" class="shadow-sm border border-3 border-white bg-primary-100 text-primary" />
              </div>
              <div class="text-center mb-3 mt-2">
                <Rating :modelValue="5" readonly :cancel="false" class="text-accent" />
              </div>
              <p class="text-gray-600 fst-italic text-center mb-4 flex-grow-1">"{{ review.text }}"</p>
              <div class="text-center border-top border-gray-100 pt-3">
                <h6 class="fw-bold text-navy mb-0">{{ review.name }}</h6>
                <small class="text-gray-400">{{ review.role }}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 8. Promotions Section -->
    <section id="offers" class="py-6">
      <div class="container py-5">
        <div class="promo-card bg-navy rounded-4 overflow-hidden position-relative shadow-lg">
          <div class="row g-0 align-items-center h-100">
            <div class="col-lg-6 p-5 p-xl-6 text-white z-1">
              <Tag class="bg-accent text-white border-0 px-3 py-1 fw-semibold mb-4">Limited Offer</Tag>
              <h2 class="display-5 fw-bold mb-4 font-playfair text-white">Summer Retreat Special</h2>
              <p class="fs-5 text-navy-200 mb-5">Book your tropical getaway before the end of the month and receive up to 30% off along with complimentary spa treatments.</p>
              <Button label="Claim Offer" class="btn-accent px-5 py-3 fw-bold text-navy shadow" />
            </div>
            <div class="col-lg-6 h-100 position-relative min-vh-300px">
              <div class="promo-bg w-100 h-100 position-absolute end-0 top-0"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 9. CTA Section -->
    <section class="cta-section py-6 bg-primary position-relative overflow-hidden">
      <div class="container py-5 text-center position-relative z-1 text-white">
        <h2 class="display-4 fw-bold mb-4 font-playfair text-white">Ready for your next journey?</h2>
        <p class="fs-5 text-primary-100 mb-5 mx-auto" style="max-width: 700px;">Join thousands of travelers exploring the world's most beautiful destinations with LuxeStay.</p>
        <div class="d-flex gap-3 justify-content-center flex-wrap">
          <Button label="Start Exploring" size="large" class="bg-white text-primary border-0 px-5 py-3 fw-bold shadow-sm" />
          <Button label="Create Account" size="large" outlined class="text-white border-white px-5 py-3 fw-bold border-2" />
        </div>
      </div>
    </section>

    <!-- 10. Footer -->
    <footer class="bg-navy-900 text-gray-400 py-6">
      <div class="container py-4">
        <div class="row g-5 border-bottom border-navy-800 pb-5 mb-5">
          <div class="col-lg-4 pe-lg-5">
            <div class="logo d-flex align-items-center gap-2 mb-4">
              <div class="logo-icon logo-icon-sm"></div>
              <span class="fs-4 fw-bold text-white">LuxeStay</span>
            </div>
            <p class="mb-4 text-navy-200 line-height-3">Redefining luxury travel with seamless booking experiences and carefully curated premium destinations worldwide.</p>
            <div class="d-flex gap-3">
              <a href="#" class="social-icon bg-navy-800 text-white rounded-circle d-flex align-items-center justify-content-center transition-all"><i class="pi pi-twitter"></i></a>
              <a href="#" class="social-icon bg-navy-800 text-white rounded-circle d-flex align-items-center justify-content-center transition-all"><i class="pi pi-instagram"></i></a>
              <a href="#" class="social-icon bg-navy-800 text-white rounded-circle d-flex align-items-center justify-content-center transition-all"><i class="pi pi-facebook"></i></a>
            </div>
          </div>
          <div class="col-lg-2 col-md-4">
            <h5 class="text-white fw-bold mb-4">Company</h5>
            <ul class="list-unstyled d-flex flex-column gap-3 mb-0">
              <li><a href="#" class="text-gray-400 text-decoration-none transition-colors">About Us</a></li>
              <li><a href="#" class="text-gray-400 text-decoration-none transition-colors">Careers</a></li>
              <li><a href="#" class="text-gray-400 text-decoration-none transition-colors">Blog</a></li>
            </ul>
          </div>
          <div class="col-lg-2 col-md-4">
            <h5 class="text-white fw-bold mb-4">Destinations</h5>
            <ul class="list-unstyled d-flex flex-column gap-3 mb-0">
              <li><a href="#" class="text-gray-400 text-decoration-none transition-colors">Paris, France</a></li>
              <li><a href="#" class="text-gray-400 text-decoration-none transition-colors">Bali, Indonesia</a></li>
              <li><a href="#" class="text-gray-400 text-decoration-none transition-colors">Maldives</a></li>
            </ul>
          </div>
          <div class="col-lg-4 col-md-4">
            <h5 class="text-white fw-bold mb-4">Newsletter</h5>
            <p class="mb-3">Subscribe for exclusive offers.</p>
            <div class="p-inputgroup mb-3">
              <InputText placeholder="Email address" class="bg-navy-800 border-navy-700 text-white w-100 p-2" />
              <Button label="Subscribe" class="btn-primary" />
            </div>
          </div>
        </div>
        <div class="row align-items-center">
          <div class="col-md-6 text-center text-md-start mb-3 mb-md-0 small">
            &copy; 2026 LuxeStay. All rights reserved.
          </div>
          <div class="col-md-6 d-flex justify-content-center justify-content-md-end gap-4">
            <a href="#" class="text-gray-400 text-decoration-none small">Privacy Policy</a>
            <a href="#" class="text-gray-400 text-decoration-none small">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from '#imports'

const benefitTab = ref('guest')

const features = [
  {
    icon: 'pi pi-compass',
    title: 'Curated Selections',
    description: 'Every hotel in our network is thoroughly vetted to ensure it meets our strict premium quality standards.'
  },
  {
    icon: 'pi pi-calendar-plus',
    title: 'Flexible Booking',
    description: 'Plans change. Enjoy free cancellation on most properties and seamless modifications to your itinerary.'
  },
  {
    icon: 'pi pi-headphones',
    title: '24/7 Concierge',
    description: 'Our dedicated support team is always available to help you with special requests or travel adjustments.'
  }
]

const showcaseHotels = [
  {
    name: 'The Azure Resort & Spa',
    location: 'Santorini, Greece',
    rating: '4.9',
    price: '420',
    color: 'var(--color-secondary-300)',
    tag: 'Bestseller'
  },
  {
    name: 'Metropolitan Luxury Suites',
    location: 'New York, USA',
    rating: '4.8',
    price: '380',
    color: 'var(--color-navy-400)',
    tag: 'Trending'
  },
  {
    name: 'Emerald Jungle Retreat',
    location: 'Ubud, Bali',
    rating: '5.0',
    price: '290',
    color: 'var(--color-primary-400)',
    tag: ''
  }
]

const reviews = [
  {
    name: 'Eleanor Vance',
    role: 'Frequent Traveler',
    text: 'The booking process was incredibly smooth, and the customer service went above and beyond when we had to change our dates.',
    avatar: undefined
  },
  {
    name: 'Marcus Chen',
    role: 'Business Executive',
    text: 'I use LuxeStay for all my corporate travel. The platform is intuitive, and the properties are consistently outstanding.',
    avatar: undefined
  },
  {
    name: 'Sophia Laurent',
    role: 'Travel Blogger',
    text: 'An absolute game-changer. The exclusive rates they offer for absolute luxury properties are unmatched anywhere else.',
    avatar: undefined
  }
]
</script>

<style scoped>
.landing-page {
  font-family: var(--font-family, 'Inter', sans-serif);
  color: var(--color-gray-800);
}

.font-playfair {
  font-family: 'Playfair Display', serif;
}

.header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--color-gray-100);
}

.logo-icon {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  border-radius: 8px;
}

.logo-icon-sm {
  width: 24px;
  height: 24px;
}

.nav-link {
  color: var(--color-gray-600);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.nav-link:hover {
  color: var(--color-primary);
}

.btn-primary {
  background-color: var(--color-primary) !important;
  border-color: var(--color-primary) !important;
  color: white !important;
}

.btn-primary:hover {
  background-color: var(--color-primary-600) !important;
  border-color: var(--color-primary-600) !important;
}

.btn-accent {
  background-color: var(--color-accent) !important;
  border-color: var(--color-accent) !important;
}

.btn-accent:hover {
  background-color: var(--color-accent-600) !important;
  border-color: var(--color-accent-600) !important;
}

/* HERO SECTION */
.hero {
  min-height: 85vh;
  padding-top: 4rem;
  padding-bottom: 4rem;
}

.hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(rgba(1, 80, 129, 0.85), rgba(0, 143, 144, 0.85)),
              url('data:image/svg+xml;utf8,<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="%23015081"/></svg>') center/cover;
}

.hero-btn-outlined:hover {
  background-color: rgba(255,255,255,0.1) !important;
}

.shadow-card {
  box-shadow: 0 20px 40px rgba(0,0,0,0.08) !important;
}

/* CARDS */
.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0,0,0,0.05) !important;
}

.hotel-card {
  transition: all 0.3s ease;
}

.hotel-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0,0,0,0.1) !important;
}

.group-hover:hover .image-wrapper {
  transform: scale(1.02);
}

.image-wrapper {
  transition: transform 0.5s ease;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(0,0,0,0.4) 100%);
  z-index: 1;
}

/* UTILS */
.py-6 { padding-top: 6rem; padding-bottom: 6rem; }

.text-navy { color: var(--color-navy) !important; }
.bg-navy { background-color: var(--color-navy) !important; }
.text-navy-200 { color: var(--color-navy-200) !important; }
.bg-navy-800 { background-color: var(--color-navy-800) !important; }
.bg-navy-900 { background-color: var(--color-navy-900) !important; }
.border-navy-800 { border-color: var(--color-navy-800) !important; }
.border-navy-700 { border-color: var(--color-navy-700) !important; }

.text-primary { color: var(--color-primary) !important; }
.bg-primary { background-color: var(--color-primary) !important; }
.bg-primary-50 { background-color: var(--color-primary-50) !important; }
.bg-primary-100 { background-color: var(--color-primary-100) !important; }
.text-primary-100 { color: var(--color-primary-100) !important; }

.text-accent { color: var(--color-accent) !important; }
.bg-accent { background-color: var(--color-accent) !important; }

.bg-gray-50 { background-color: var(--color-gray-50) !important; }
.bg-gray-100 { background-color: var(--color-gray-100) !important; }
.text-gray-400 { color: var(--color-gray-400) !important; }
.text-gray-500 { color: var(--color-gray-500) !important; }
.text-gray-600 { color: var(--color-gray-600) !important; }

.transition-all { transition: all 0.3s ease; }
.transition-colors { transition: color 0.3s ease, background-color 0.3s ease; }

.tracking-wide { letter-spacing: 0.05em; }
.line-height-3 { line-height: 1.7; }
.min-vh-300px { min-height: 300px; }

/* CUSTOM ELEMENTS */
.icon-circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.blur-blob {
  width: 250px;
  height: 250px;
  filter: blur(80px);
  opacity: 0.4;
}

.decorative-blob { top: -10%; right: -10%; }
.decorative-blob-2 { bottom: -10%; left: -10%; }

.promo-bg {
  background: linear-gradient(135deg, var(--color-primary-400), var(--color-primary-600));
}

.social-icon {
  width: 40px;
  height: 40px;
  text-decoration: none;
}
.social-icon:hover {
  background-color: var(--color-primary) !important;
}

.fade-in {
  animation: fadeIn 0.4s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}

a:hover {
  color: white !important;
}
</style>
