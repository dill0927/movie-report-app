<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="flex min-h-screen flex-col align-middle">
    <header
      class="sticky top-0 z-1000 grid grid-cols-2 bg-primary px-5 py-4 font-sans text-secondary"
    >
      <RouterLink to="/">
        <div class="font-logo text-xl font-bold">M-LOG</div>
      </RouterLink>
      <nav class="flex gap-4 justify-self-end">
        <RouterLink to="/"><v-icon name="io-home-sharp" /></RouterLink>
        <RouterLink to="/log"><v-icon name="gi-backward-time" scale="1.5" /></RouterLink>
      </nav>
    </header>
    <div class="grow bg-secondary p-4 text-primary">
      <RouterView />
    </div>
  </div>
</template>

<style scoped></style>
