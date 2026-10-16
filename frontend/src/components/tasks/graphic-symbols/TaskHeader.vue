<template>
  <header class="flex items-start justify-between border-b border-[#00ff66]/30 pb-3 mb-6">
    <div>
      <h1 class="text-2xl sm:text-4xl font-bold tracking-widest">{{ titel }}</h1>
      <p class="text-sm sm:text-base text-[#008833] mt-2">{{ text }}</p>
    </div>
    <div class="hidden sm:flex items-center gap-2 font-bold text-xl tracking-wider">
      <svg width="38" height="38" viewBox="0 0 40 40" fill="none" stroke="#00ff66" stroke-width="2.5" stroke-linejoin="round">
        <path d="M20 3 36 12v16L20 37 4 28V12z" />
        <path d="M20 3v14M4 12l16 5 16-5" />
        <path d="M22 18l-5 8h5l-3 7" stroke-width="2" />
      </svg>
      <span>DRV<span class="text-[#008833]">-BOX</span></span>
    </div>
  </header>
</template>

<script setup>
defineProps({
  titel: { type: String, required: true },
  text: { type: String, required: true }
})
</script>