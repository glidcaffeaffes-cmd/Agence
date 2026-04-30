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
          <span class="photo-plane__tag">{{ t("homeScene.tag") }}</span>
          <h3>{{ t("homeScene.title") }}</h3>
          <p>{{ t("homeScene.description") }}</p>
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
        <span class="float-card__kicker">{{ t("homeScene.guestRating") }}</span>
        <div class="float-card__metric">
          <strong>9.8</strong>
          <span>{{ t("homeScene.exceptional") }}</span>
        </div>
        <p>{{ t("homeScene.guestRatingDescription") }}</p>
      </div>

      <div class="float-card float-card--service">
        <span class="float-card__kicker">{{ t("homeScene.premiumStay") }}</span>
        <ul class="float-card__list">
          <li>{{ t("homeScene.privateTransfers") }}</li>
          <li>{{ t("homeScene.suiteUpgrade") }}</li>
          <li>{{ t("homeScene.concierge") }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useAppI18n();
</script>

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
  letter-spacing: 0.12em;
}

.hotel-window-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}

.hotel-window,
.hotel-side-window {
  display: block;
  border-radius: 10px;
  background: linear-gradient(180deg, #7dc6ff 0%, #edf7ff 100%);
  border: 1px solid rgba(35, 98, 148, 0.18);
}

.hotel-window {
  height: 18px;
}

.hotel-side-window {
  height: 18px;
}

.hotel-entry {
  position: absolute;
  left: 50%;
  bottom: 12px;
  width: 34px;
  height: 36px;
  transform: translateX(-50%);
  border-radius: 18px 18px 10px 10px;
  background: linear-gradient(180deg, #184868 0%, #0f2a3c 100%);
}

.hotel-deck {
  right: -8px;
  bottom: 0;
  width: 132px;
  height: 54px;
  border-radius: 26px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.94), rgba(222, 237, 246, 0.92));
  z-index: 4;
}

.hotel-pool {
  position: absolute;
  left: 18px;
  top: 12px;
  width: 58px;
  height: 28px;
  border-radius: 999px;
  background: linear-gradient(180deg, #86dbff 0%, #4bb5ef 100%);
  box-shadow: inset 0 3px 10px rgba(255, 255, 255, 0.34);
}

.hotel-lounger {
  position: absolute;
  right: 26px;
  top: 12px;
  width: 12px;
  height: 32px;
  border-radius: 999px;
  background: linear-gradient(180deg, #cdaf5d 0%, #9a7d3c 100%);
  transform: rotate(-18deg);
}

.hotel-lounger--alt {
  right: 12px;
  transform: rotate(-10deg);
}

.float-card {
  position: absolute;
  padding: 16px 18px;
  border-radius: 24px;
  backdrop-filter: blur(18px);
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow:
    0 22px 46px rgba(15, 23, 42, 0.13),
    0 10px 22px rgba(15, 23, 42, 0.05);
  z-index: 5;
}

.float-card--rating {
  left: 6px;
  bottom: 94px;
  width: 180px;
}

.float-card--service {
  right: -4px;
  top: 54px;
  width: 188px;
}

.float-card__kicker {
  display: inline-block;
  margin-bottom: 12px;
  color: var(--color-primary-700);
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.16em;
}

.float-card__metric {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  margin-bottom: 10px;
}

.float-card__metric strong {
  color: var(--color-navy-700);
  font-size: 34px;
  line-height: 1;
}

.float-card__metric span {
  color: var(--color-primary-700);
  font-size: 14px;
  font-weight: 700;
}

.float-card p,
.float-card__list {
  margin: 0;
  color: var(--color-text-soft);
  font-size: 13px;
  line-height: 1.55;
}

.float-card__list {
  padding-left: 18px;
  display: grid;
  gap: 8px;
}

@keyframes planeFloat {
  0%,
  100% {
    transform: rotateY(-14deg) rotateX(7deg) translateY(0);
  }
  50% {
    transform: rotateY(-12deg) rotateX(8deg) translateY(-10px);
  }
}

@keyframes modelFloat {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

@media (max-width: 960px) {
  .hotel-scene,
  .scene-shell {
    min-height: 420px;
  }

  .float-card--service {
    right: 10px;
    top: 24px;
  }
}

@media (max-width: 768px) {
  .hotel-scene,
  .scene-shell {
    min-height: 350px;
  }

  .photo-plane--back {
    inset: 32px 18px 34px 54px;
  }

  .photo-plane--front {
    inset: 8px 22px 20px 18px;
  }

  .hotel-model,
  .float-card {
    display: none;
  }

  .scene-shadow {
    left: 30px;
  }
}
</style>
