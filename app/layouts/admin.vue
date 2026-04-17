<template>
  <div class="bg-surface text-on-surface antialiased min-h-screen">
    <!-- SideNavBar -->
    <aside class="h-screen w-64 fixed left-0 top-0 z-50 bg-[#015081] flex flex-col shadow-[4px_0_20px_rgba(1,80,129,0.10)] overflow-y-auto">
      <!-- Brand -->
      <div class="px-6 py-6 flex-shrink-0">
        <div class="flex items-center gap-2 mb-1">
          <span class="material-symbols-outlined text-[#CDAF5D] text-2xl" style="font-variation-settings:'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 24">travel_explore</span>
          <h1 class="text-white text-lg font-bold tracking-tight">VoyageHub</h1>
        </div>
        <p class="text-white/50 text-[10px] font-semibold uppercase tracking-widest">Admin Portal</p>
      </div>

      <nav class="flex-1 px-3 pb-4" id="sidebar-nav">
        <!-- Overview -->
        <p class="nav-group-label">Overview</p>
        <NuxtLink to="/admin" exact active-class="nav-active" class="nav-item">
          <span class="material-symbols-outlined">dashboard</span>
          <span>Dashboard</span>
        </NuxtLink>
        <NuxtLink to="/admin/stats" active-class="nav-active" class="nav-item">
          <span class="material-symbols-outlined">bar_chart</span>
          <span>Statistics</span>
        </NuxtLink>
        <NuxtLink to="/admin/reports" active-class="nav-active" class="nav-item">
          <span class="material-symbols-outlined">receipt_long</span>
          <span>Financial Reports</span>
        </NuxtLink>

        <!-- Operations -->
        <p class="nav-group-label">Operations</p>
        <NuxtLink to="/admin/hotels" active-class="nav-active" class="nav-item">
          <span class="material-symbols-outlined">hotel</span>
          <span>Hotels</span>
        </NuxtLink>
        <NuxtLink to="/admin/reservations" active-class="nav-active" class="nav-item">
          <span class="material-symbols-outlined">calendar_month</span>
          <span>Reservations</span>
        </NuxtLink>
        <NuxtLink to="/admin/partners" active-class="nav-active" class="nav-item">
          <span class="material-symbols-outlined">handshake</span>
          <span>Partners</span>
        </NuxtLink>
        <NuxtLink to="/admin/complaints" active-class="nav-active" class="nav-item">
          <span class="material-symbols-outlined">forum</span>
          <span>Complaints</span>
        </NuxtLink>

        <!-- People -->
        <p class="nav-group-label">People</p>
        <NuxtLink to="/admin/users" active-class="nav-active" class="nav-item">
          <span class="material-symbols-outlined">group</span>
          <span>Users</span>
        </NuxtLink>
        <NuxtLink to="/admin/notifications" active-class="nav-active" class="nav-item">
          <span class="material-symbols-outlined">notifications</span>
          <span>Notifications</span>
        </NuxtLink>

        <!-- System -->
        <p class="nav-group-label">System</p>
        <NuxtLink to="/admin/roles" active-class="nav-active" class="nav-item">
          <span class="material-symbols-outlined">manage_accounts</span>
          <span>Roles & Access</span>
        </NuxtLink>
        <NuxtLink to="/admin/settings" active-class="nav-active" class="nav-item">
          <span class="material-symbols-outlined">settings</span>
          <span>Settings</span>
        </NuxtLink>
        <NuxtLink to="/admin/audit" active-class="nav-active" class="nav-item">
          <span class="material-symbols-outlined">policy</span>
          <span>Audit Logs</span>
        </NuxtLink>
        <NuxtLink to="/admin/integrations" active-class="nav-active" class="nav-item">
          <span class="material-symbols-outlined">extension</span>
          <span>API & Integrations</span>
        </NuxtLink>
      </nav>

      <!-- Footer -->
      <div class="px-3 pb-4 pt-2 border-t border-white/10 flex-shrink-0">
        <NuxtLink to="/" class="nav-item" style="color:rgba(255,255,255,0.6)">
          <span class="material-symbols-outlined">open_in_new</span>
          <span>View Site</span>
        </NuxtLink>
        <a href="/login" class="nav-item hover:bg-red-500/20" style="color:rgba(255,255,255,0.6)">
          <span class="material-symbols-outlined">logout</span>
          <span>Sign Out</span>
        </a>
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
/* Base typography and scrollbars */
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #bcc9c8; border-radius: 10px; }

/* Sidebar Navigation Classes */
.nav-group-label {
  font-size: 0.6875rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.08em; color: rgba(255,255,255,0.4);
  margin: 1.5rem 1rem 0.5rem;
}
.nav-item {
  display: flex; align-items: center; gap: 0.75rem;
  padding: 0.625rem 1rem; margin-bottom: 0.25rem;
  color: rgba(255,255,255,0.8); font-size: 0.875rem; font-weight: 500; font-family: 'Inter', sans-serif;
  border-radius: 0.5rem; border-left: 3px solid transparent;
  transition: all 0.15s ease; text-decoration: none;
}
.nav-item:hover {
  background: rgba(0, 103, 104, 0.3); color: #fff;
}
.nav-item .material-symbols-outlined {
  font-size: 1.25rem;
}
.nav-active {
  background: rgba(0, 103, 104, 0.4); color: #fff;
  border-left-color: #CDAF5D;
}
.nav-active .material-symbols-outlined {
  color: #CDAF5D; font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>
