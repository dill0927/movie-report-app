<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <div class="p-3">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/my-viewing-log">鑑賞記録</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped></style>
