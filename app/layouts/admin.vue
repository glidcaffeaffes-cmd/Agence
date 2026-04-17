<template>
  <div class="bg-surface text-on-surface antialiased min-h-screen">
    <!-- SideNavBar -->
    <aside class="h-screen w-64 fixed left-0 top-0 z-50 bg-[#015081] flex flex-col py-6 shadow-[4px_0_20px_rgba(1,80,129,0.06)]">
      <div class="px-6 mb-10">
        <h1 class="text-white text-xl font-bold italic tracking-tight">Agency Admin</h1>
        <p class="text-white/60 text-xs font-medium uppercase tracking-widest mt-1">Management Portal</p>
      </div>
      <nav class="flex-1 space-y-1" id="sidebar-nav">
        <!-- Exact navigation layout from Stitch -->
        <NuxtLink to="/admin/hotels" active-class="text-[#CDAF5D] bg-[#006768]/20 border-[#CDAF5D]" class="nav-item flex items-center gap-3 px-4 py-3 text-white/80 hover:bg-[#006768]/30 hover:text-white transition-all duration-200 border-l-4 border-transparent">
          <span class="material-symbols-outlined">hotel</span>
          <span class="font-['Inter'] font-medium text-sm">Hotels</span>
        </NuxtLink>
        <NuxtLink to="/admin/reservations" active-class="text-[#CDAF5D] bg-[#006768]/20 border-[#CDAF5D]" class="nav-item flex items-center gap-3 px-4 py-3 text-white/80 hover:bg-[#006768]/30 hover:text-white transition-all duration-200 border-l-4 border-transparent">
          <span class="material-symbols-outlined">calendar_month</span>
          <span class="font-['Inter'] font-medium text-sm">Reservations</span>
        </NuxtLink>
        <NuxtLink to="/admin/partners" active-class="text-[#CDAF5D] bg-[#006768]/20 border-[#CDAF5D]" class="nav-item flex items-center gap-3 px-4 py-3 text-white/80 hover:bg-[#006768]/30 hover:text-white transition-all duration-200 border-l-4 border-transparent">
          <span class="material-symbols-outlined">handshake</span>
          <span class="font-['Inter'] font-medium text-sm">Partners</span>
        </NuxtLink>
        <NuxtLink to="/admin/complaints" active-class="text-[#CDAF5D] bg-[#006768]/20 border-[#CDAF5D]" class="nav-item flex items-center gap-3 px-4 py-3 text-white/80 hover:bg-[#006768]/30 hover:text-white transition-all duration-200 border-l-4 border-transparent">
          <span class="material-symbols-outlined">forum</span>
          <span class="font-['Inter'] font-medium text-sm">Complaints</span>
        </NuxtLink>
      </nav>
      <div class="px-4 mt-auto">
        <button class="w-full py-3 px-4 bg-[#CDAF5D] text-[#015081] font-bold rounded-lg text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
          <span class="material-symbols-outlined text-sm">add</span>
          Create New Listing
        </button>
        <div class="mt-6 border-t border-white/10 pt-4">
          <a class="flex items-center gap-3 px-4 py-3 text-white/80 hover:bg-red-500/20 hover:text-white transition-all duration-200" href="/">
            <span class="material-symbols-outlined">logout</span>
            <span class="font-['Inter'] font-medium text-sm">Sign Out</span>
          </a>
        </div>
      </div>
    </aside>

    <!-- Main Content Canvas -->
    <main class="ml-64 min-h-screen">
      <!-- TopAppBar -->
      <header class="w-full sticky top-0 z-40 bg-[#f5faff] shadow-sm flex justify-between items-center h-16 px-8 ml-auto font-['Inter'] antialiased tracking-tight">
        <div class="flex items-center gap-4 flex-1">
          <div class="relative w-full max-w-md">
            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">search</span>
            <input class="w-full pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary text-sm outline-none" placeholder="Search..." type="text"/>
          </div>
        </div>
        <div class="flex items-center gap-6">
          <div class="flex items-center gap-4 text-outline">
            <span class="material-symbols-outlined cursor-pointer hover:text-primary transition-colors">notifications</span>
            <span class="material-symbols-outlined cursor-pointer hover:text-primary transition-colors">settings</span>
            <span class="material-symbols-outlined cursor-pointer hover:text-primary transition-colors">help</span>
          </div>
          <div class="flex items-center gap-3 border-l border-surface-variant pl-6">
            <div class="text-right">
              <p class="text-xs font-bold text-on-surface">Admin User</p>
              <p class="text-[10px] text-outline uppercase tracking-tighter">VoyageHub Manager</p>
            </div>
            <img alt="Administrator profile" class="w-10 h-10 rounded-full object-cover border-2 border-primary/20" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3jr47BTrBfbJixfp2HntDQfzkE_cdHycmT2u5Mp3vWeJth_eEXWQUSBoBejwFBDtyqrRnPItXjWxD8aHuHGlvei0LW6DMFVLi8GgzbyARM5LqwCE1z-TH7pY8AsPfx8SOreQufwY53ugh-7g0-kGFIBFchEhUgmtbRzucpWfpY-lnvYyukboDmuv_yGdT38Tow-ZDZ0MmuJWL5w6-kg9EEVKUHlOiuwnnJRCHyexxIhsGdhdbyIVcXWNXwfTbAtqJjOQH_FsskzsG"/>
          </div>
        </div>
      </header>

      <!-- Exact Page Output Slot -->
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
// Admin Layout specifically tailored for the Exact UI Reproduction
</script>

<style>
/* CSS copied from Stitch Generated Header */
.material-symbols-outlined {
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #bcc9c8; border-radius: 10px; }
</style>
