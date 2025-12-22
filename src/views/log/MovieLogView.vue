<script setup lang="ts">
import { useMovieLogStore } from '@/stores/movieLog'

const store = useMovieLogStore()
</script>

<template>
  <!-- TODO: ログ一覧ページ作成　-->
  <div class="about">
    <h1>This is a movie log page</h1>
    <p>{{ store.movieLogs }}</p>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
