<template>
  <div class="hotel-scene">
    <div class="scene-glow scene-glow--teal"></div>
    <div class="scene-glow scene-glow--blue"></div>

    <div class="scene-shell">
      <div class="scene-shadow"></div>

      <div class="photo-plane photo-plane--back"></div>

      <div class="photo-plane photo-plane--front">
        <img src="/images/hero.png" alt="Luxury hotel resort" class="photo-plane__image" />
        <div class="photo-plane__overlay"></div>
        <div class="photo-plane__caption">
          <span class="photo-plane__tag">Signature Hotel</span>
          <h3>Architectural stays designed for premium travel</h3>
          <p>Waterfront suites, calm interiors, and concierge-led arrivals for clients who value polish.</p>
        </div>
      </div>

      <div class="hotel-model">
        <div class="hotel-top"></div>
        <div class="hotel-side">
          <span v-for="n in 6" :key="`side-${n}`" class="hotel-side-window"></span>
        </div>
        <div class="hotel-front">
          <div class="hotel-brand">VoyageHub Resort</div>
          <div class="hotel-window-grid">
            <span v-for="n in 15" :key="`front-${n}`" class="hotel-window"></span>
          </div>
          <div class="hotel-entry"></div>
        </div>
        <div class="hotel-deck">
          <div class="hotel-pool"></div>
          <div class="hotel-lounger"></div>
          <div class="hotel-lounger hotel-lounger--alt"></div>
        </div>
      </div>

      <div class="float-card float-card--rating">
        <span class="float-card__kicker">Guest rating</span>
        <div class="float-card__metric">
          <strong>9.8</strong>
          <span>Exceptional</span>
        </div>
        <p>Selected for executive trips and luxury escapes.</p>
      </div>

      <div class="float-card float-card--service">
        <span class="float-card__kicker">Premium stay</span>
        <ul class="float-card__list">
          <li>Private transfers</li>
          <li>Suite upgrade priority</li>
          <li>Fast human concierge</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hotel-scene {
  position: relative;
  min-height: 500px;
}

.scene-shell {
  position: relative;
  min-height: 500px;
  perspective: 1800px;
  transform-style: preserve-3d;
  isolation: isolate;
}

.scene-glow {
  position: absolute;
  border-radius: 999px;
  filter: blur(18px);
  z-index: 0;
}

.scene-glow--teal {
  top: 22px;
  right: 34px;
  width: 180px;
  height: 180px;
  background: radial-gradient(circle, rgba(0, 103, 104, 0.22) 0%, rgba(0, 103, 104, 0) 72%);
}

.scene-glow--blue {
  bottom: 20px;
  left: 18px;
  width: 190px;
  height: 160px;
  background: radial-gradient(circle, rgba(35, 98, 148, 0.18) 0%, rgba(35, 98, 148, 0) 72%);
}

.scene-shadow {
  position: absolute;
  left: 82px;
  right: 18px;
  bottom: 14px;
  height: 78px;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(15, 23, 42, 0.24) 0%, rgba(15, 23, 42, 0) 70%);
  filter: blur(26px);
  z-index: 0;
}

.photo-plane {
  position: absolute;
  overflow: hidden;
  border-radius: 38px;
}

.photo-plane--back {
  inset: 44px 20px 40px 96px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.76), rgba(226, 240, 251, 0.58));
  border: 1px solid rgba(255, 255, 255, 0.7);
  box-shadow: 0 28px 60px rgba(15, 23, 42, 0.08);
  transform: rotateY(-18deg) rotateX(8deg) translateY(16px);
  z-index: 1;
}

.photo-plane--front {
  inset: 12px 28px 28px 34px;
  border: 1px solid rgba(255, 255, 255, 0.52);
  box-shadow:
    0 34px 72px rgba(15, 23, 42, 0.16),
    0 12px 22px rgba(15, 23, 42, 0.08);
  transform: rotateY(-14deg) rotateX(7deg);
  z-index: 2;
  animation: planeFloat 7.8s ease-in-out infinite;
}

.photo-plane__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.photo-plane__overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(15, 23, 42, 0.08) 0%, rgba(15, 23, 42, 0.18) 34%, rgba(15, 23, 42, 0.78) 100%),
    linear-gradient(140deg, rgba(255, 255, 255, 0.34) 0%, rgba(255, 255, 255, 0.02) 38%, rgba(255, 255, 255, 0) 55%);
}

.photo-plane__caption {
  position: absolute;
  left: 22px;
  right: 22px;
  bottom: 18px;
  z-index: 2;
  color: white;
}

.photo-plane__tag {
  display: inline-block;
  margin-bottom: 10px;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(14px);
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.16em;
}

.photo-plane__caption h3 {
  margin: 0 0 8px;
  max-width: 380px;
  font-size: 26px;
  line-height: 1.08;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: #f4e7cf;
  text-shadow:
    0 4px 14px rgba(15, 23, 42, 0.42),
    0 1px 0 rgba(15, 23, 42, 0.3);
}

.photo-plane__caption p {
  margin: 0;
  max-width: 360px;
  color: rgba(255, 255, 255, 0.88);
  font-size: 13px;
  line-height: 1.5;
  text-shadow: 0 4px 14px rgba(15, 23, 42, 0.4);
}

.hotel-model {
  position: absolute;
  right: 24px;
  bottom: 54px;
  width: 205px;
  height: 188px;
  z-index: 3;
  transform: translateY(0);
  animation: modelFloat 8.5s ease-in-out infinite;
}

.hotel-front,
.hotel-side,
.hotel-top,
.hotel-deck {
  position: absolute;
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 24px 38px rgba(15, 23, 42, 0.14);
}

.hotel-front {
  left: 0;
  bottom: 16px;
  width: 158px;
  height: 146px;
  padding: 18px 16px 14px;
  border-radius: 26px 20px 24px 24px;
  background: linear-gradient(180deg, #fcfefe 0%, #d6e5ef 100%);
  z-index: 3;
}

.hotel-side {
  right: 18px;
  bottom: 26px;
  width: 58px;
  height: 146px;
  padding: 16px 12px;
  border-radius: 0 22px 22px 0;
  background: linear-gradient(180deg, #d4e2ed 0%, #b2c4d1 100%);
  transform: skewY(-28deg);
  transform-origin: bottom left;
  display: grid;
  gap: 10px;
  align-content: start;
  z-index: 2;
}

.hotel-top {
  left: 26px;
  bottom: 150px;
  width: 156px;
  height: 44px;
  border-radius: 18px 18px 10px 10px;
  background: linear-gradient(180deg, #eef6fb 0%, #d5e5ef 100%);
  transform: skewX(-56deg);
  transform-origin: bottom left;
  z-index: 1;
}

.hotel-brand {
  margin-bottom: 14px;
  color: var(--color-primary-700);
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.14em;
}

.hotel-window-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.hotel-window,
.hotel-side-window {
  display: block;
  border-radius: 10px;
  background: linear-gradient(180deg, #b7ecf0 0%, #76bad3 100%);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.35);
}

.hotel-window {
  height: 18px;
}

.hotel-side-window {
  height: 14px;
}

.hotel-entry {
  position: absolute;
  left: 56px;
  bottom: 12px;
  width: 44px;
  height: 50px;
  border-radius: 14px 14px 10px 10px;
  background: linear-gradient(180deg, #0f172a 0%, #253447 100%);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
}

.hotel-entry::after {
  content: "";
  position: absolute;
  left: 8px;
  right: 8px;
  top: 10px;
  height: 12px;
  border-radius: 8px;
  background: rgba(183, 236, 240, 0.5);
}

.hotel-deck {
  left: -24px;
  bottom: -2px;
  width: 142px;
  height: 80px;
  border-radius: 28px;
  background: linear-gradient(180deg, #f8fbfd 0%, #d9e5ec 100%);
  transform: rotate(-8deg);
  z-index: 4;
}

.hotel-pool {
  position: absolute;
  left: 16px;
  top: 14px;
  width: 76px;
  height: 38px;
  border-radius: 999px;
  background: linear-gradient(135deg, #7ee7ee 0%, #2b7da1 100%);
  box-shadow: inset 0 0 0 4px rgba(255, 255, 255, 0.48);
}

.hotel-lounger {
  position: absolute;
  right: 18px;
  top: 18px;
  width: 28px;
  height: 10px;
  border-radius: 999px;
  background: #ffffff;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.08);
}

.hotel-lounger::after {
  content: "";
  position: absolute;
  right: -4px;
  top: 10px;
  width: 18px;
  height: 4px;
  border-radius: 999px;
  background: #cfdbe5;
  transform: rotate(22deg);
}

.hotel-lounger--alt {
  top: 40px;
  right: 28px;
}

.float-card {
  position: absolute;
  z-index: 4;
  max-width: 190px;
  padding: 14px 16px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.68);
  backdrop-filter: blur(20px);
  box-shadow:
    0 26px 54px rgba(15, 23, 42, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.58);
}

.float-card--rating {
  top: 44px;
  left: -4px;
  animation: cardFloatLeft 8s ease-in-out infinite;
}

.float-card--service {
  right: 2px;
  bottom: 26px;
  animation: cardFloatRight 8.8s ease-in-out infinite;
}

.float-card__kicker {
  display: block;
  margin-bottom: 10px;
  color: var(--color-primary-700);
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.14em;
}

.float-card__metric {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 8px;
}

.float-card__metric strong {
  color: #0f172a;
  font-size: 26px;
  line-height: 1;
}

.float-card__metric span {
  color: var(--color-secondary-500);
  font-size: 13px;
  font-weight: 700;
}

.float-card p {
  margin: 0;
  color: #64748b;
  font-size: 12px;
  line-height: 1.5;
}

.float-card__list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 8px;
}

.float-card__list li {
  position: relative;
  padding-left: 16px;
  color: #334155;
  font-size: 12px;
  line-height: 1.5;
}

.float-card__list li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 7px;
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: var(--color-primary-500);
}

@keyframes planeFloat {
  0%,
  100% {
    transform: rotateY(-14deg) rotateX(7deg) translateY(0);
  }

  50% {
    transform: rotateY(-12deg) rotateX(8deg) translateY(-12px);
  }
}

@keyframes modelFloat {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-10px);
  }
}

@keyframes cardFloatLeft {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-14px);
  }
}

@keyframes cardFloatRight {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(10px);
  }
}

@media (max-width: 1200px) {
  .hotel-scene,
  .scene-shell {
    min-height: 460px;
  }

  .photo-plane--front {
    inset: 16px 24px 24px 28px;
  }

  .photo-plane__caption h3 {
    font-size: 24px;
  }

  .hotel-model {
    right: 10px;
    bottom: 42px;
    transform: scale(0.84);
    transform-origin: bottom right;
  }
}

@media (max-width: 768px) {
  .hotel-scene,
  .scene-shell {
    min-height: 420px;
  }

  .scene-glow--teal {
    width: 180px;
    height: 180px;
    right: 12px;
  }

  .scene-glow--blue {
    width: 180px;
    height: 180px;
    left: 0;
  }

  .photo-plane--back {
    inset: 32px 10px 28px 42px;
  }

  .photo-plane--front {
    inset: 10px 14px 18px 12px;
    transform: none;
    animation: none;
  }

  .photo-plane__caption {
    left: 22px;
    right: 22px;
    bottom: 20px;
  }

  .photo-plane__caption h3 {
    font-size: 20px;
  }

  .photo-plane__caption p {
    font-size: 12px;
  }

  .hotel-model {
    right: 8px;
    bottom: 28px;
    transform: scale(0.62);
    transform-origin: bottom right;
    animation: none;
  }

  .float-card--rating {
    top: 22px;
    left: 8px;
  }

  .float-card--service {
    display: none;
  }

  .float-card {
    max-width: 150px;
    padding: 12px 14px;
    animation: none;
  }

  .float-card__metric strong {
    font-size: 22px;
  }
}
</style>
