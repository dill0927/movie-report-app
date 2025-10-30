<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <header class="grid grid-cols-2 bg-[#f49895] px-5 py-3 font-sans text-[#232323]">
      <RouterLink to="/">
        <div class="font-logo text-xl font-bold">M-LOG</div>
      </RouterLink>
      <nav class="flex gap-4 justify-self-end">
        <RouterLink to="/">ホーム</RouterLink>
        <RouterLink to="/movie/log">鑑賞LOG</RouterLink>
      </nav>
    </header>
    <div class="grow bg-[#232323] p-4 text-[#f49895]">
      <RouterView />
    </div>
  </div>
</template>

<style scoped></style>
