<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header class="grid grid-cols-2 bg-[#f49895] px-5 py-3 font-sans text-[#232323]">
    <div class="font-logo text-xl font-bold">M-LOG</div>
    <nav class="flex gap-4 justify-self-end">
      <RouterLink to="/">ホーム</RouterLink>
      <RouterLink to="/movie/log">鑑賞LOG</RouterLink>
    </nav>
  </header>
  <div class="bg-[#232323] p-4 text-[#f49895]">
    <RouterView />
  </div>
</template>

<style scoped></style>
