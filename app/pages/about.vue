<template>
  <div class="min-h-screen bg-[#f8fafc] font-sans">
    <Head>
      <title>About Us — VoyageHub</title>
      <meta name="description" content="Learn more about VoyageHub, your premier travel agency for exceptional hotel experiences." />
    </Head>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <!-- Page Header -->
      <header class="mb-12 text-center">
        <h1 class="text-5xl font-black text-neutral-900 tracking-tighter uppercase leading-none">About VoyageHub</h1>
        <p class="text-neutral-500 mt-4 text-lg font-medium">Crafting unforgettable journeys since 2020</p>
      </header>

      <div class="space-y-12">
        <!-- Mission Section -->
        <div class="bg-white rounded-[32px] shadow-xl shadow-neutral-200/50 overflow-hidden border border-neutral-100">
          <div class="p-10">
            <div class="flex items-center gap-4 mb-8">
              <div class="w-12 h-12 rounded-2xl bg-neutral-900 flex items-center justify-center text-white">
                <span class="material-symbols-outlined text-[28px]">travel_explore</span>
              </div>
              <h2 class="text-3xl font-black text-neutral-900 tracking-tight uppercase">Our Mission</h2>
            </div>
            <p class="text-neutral-600 font-medium text-lg leading-relaxed">
              At VoyageHub, we believe that every journey should be extraordinary. Our mission is to connect travelers with the world's most exceptional hotels,
              ensuring that every stay becomes a cherished memory. We curate experiences that blend luxury, authenticity, and unparalleled service.
            </p>
          </div>
        </div>

        <!-- Values Section -->
        <div class="bg-white rounded-[32px] shadow-xl shadow-neutral-200/50 overflow-hidden border border-neutral-100">
          <div class="p-10">
            <div class="flex items-center gap-4 mb-8">
              <div class="w-12 h-12 rounded-2xl bg-neutral-900 flex items-center justify-center text-white">
                <span class="material-symbols-outlined text-[28px]">stars</span>
              </div>
              <h2 class="text-3xl font-black text-neutral-900 tracking-tight uppercase">Our Values</h2>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div class="text-center">
                <div class="w-16 h-16 mx-auto rounded-full bg-neutral-100 flex items-center justify-center text-neutral-900 mb-4">
                  <span class="material-symbols-outlined text-[32px]">verified</span>
                </div>
                <h3 class="text-xl font-black text-neutral-900 uppercase tracking-tight mb-2">Excellence</h3>
                <p class="text-neutral-600 font-medium">We uphold the highest standards in every interaction and recommendation.</p>
              </div>
              <div class="text-center">
                <div class="w-16 h-16 mx-auto rounded-full bg-neutral-100 flex items-center justify-center text-neutral-900 mb-4">
                  <span class="material-symbols-outlined text-[32px]">handshake</span>
                </div>
                <h3 class="text-xl font-black text-neutral-900 uppercase tracking-tight mb-2">Trust</h3>
                <p class="text-neutral-600 font-medium">Building lasting relationships through transparency and reliability.</p>
              </div>
              <div class="text-center">
                <div class="w-16 h-16 mx-auto rounded-full bg-neutral-100 flex items-center justify-center text-neutral-900 mb-4">
                  <span class="material-symbols-outlined text-[32px]">explore</span>
                </div>
                <h3 class="text-xl font-black text-neutral-900 uppercase tracking-tight mb-2">Discovery</h3>
                <p class="text-neutral-600 font-medium">Uncovering hidden gems and creating unique travel experiences.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Contact Section -->
        <div class="bg-white rounded-[32px] shadow-xl shadow-neutral-200/50 overflow-hidden border border-neutral-100">
          <div class="p-10">
            <div class="flex items-center gap-4 mb-8">
              <div class="w-12 h-12 rounded-2xl bg-neutral-900 flex items-center justify-center text-white">
                <span class="material-symbols-outlined text-[28px]">contact_support</span>
              </div>
              <h2 class="text-3xl font-black text-neutral-900 tracking-tight uppercase">Get In Touch</h2>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 class="text-lg font-black text-neutral-900 uppercase tracking-tight mb-4">Contact Information</h3>
                <div class="space-y-3">
                  <p class="flex items-center gap-3 text-neutral-600 font-medium">
                    <span class="material-symbols-outlined text-[20px]">location_on</span>
                    123 Travel Street, Paris, France
                  </p>
                  <p class="flex items-center gap-3 text-neutral-600 font-medium">
                    <span class="material-symbols-outlined text-[20px]">phone</span>
                    +33 1 23 45 67 89
                  </p>
                  <p class="flex items-center gap-3 text-neutral-600 font-medium">
                    <span class="material-symbols-outlined text-[20px]">email</span>
                    hello@voyagehub.com
                  </p>
                </div>
              </div>
              <div>
                <h3 class="text-lg font-black text-neutral-900 uppercase tracking-tight mb-4">Business Hours</h3>
                <div class="space-y-2">
                  <p class="text-neutral-600 font-medium">Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p class="text-neutral-600 font-medium">Saturday: 10:00 AM - 4:00 PM</p>
                  <p class="text-neutral-600 font-medium">Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No script needed for this static page
</script>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>