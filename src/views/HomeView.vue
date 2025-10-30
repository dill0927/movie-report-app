<script setup lang="ts">
import { fetchMovieInfos } from '@/services/fetchMovieInfos'
import type { MovieInfo } from '@/type/MovieInfo'
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const recentMovieInfos = ref<MovieInfo[]>([])
const searchedMovieInfos = ref<MovieInfo[]>([])
const error = ref<Error | null>(null)
const isLoading = ref(true)
const searchInput = ref<string>('')

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'
const IMAGE_SIZE = 'w500'

const moviesToDisplay = computed(() => {
  if (route.query.q) {
    return searchedMovieInfos.value
  }
  return recentMovieInfos.value
})

const listTitle = computed(() => {
  const query = route.query.q as string
  if (query) {
    if (isLoading.value) return `${query} を検索中...`
    if (searchedMovieInfos.value.length === 0) return `${query} の検索結果（0件）`
    return `${query} の検索結果`
  }
  return 'Now Playing'
})

const handleSearch = () => {
  const query = searchInput.value.trim()
  if (query) {
    router.push({ query: { q: query } })
  } else {
    router.push({ query: {} })
  }
}

watch(
  () => route.query.q,
  async (newQuery) => {
    const query = newQuery as string
    if (query) {
      searchInput.value = query
      const params = { query: query }
      console.log('query:' + query + 'でAPIを実行')
      searchedMovieInfos.value = await fetchMovieInfos('/search/movie', params, error, isLoading)
    } else {
      searchInput.value = ''
      if (recentMovieInfos.value.length === 0) {
        const today = new Date()
        const todayDate = today.toLocaleDateString('sv-SE')
        today.setMonth(today.getMonth() - 4)
        const fourMonthsAgoDate = today.toLocaleDateString('sv-SE')

        const params = {
          sort_by: 'popularity.desc',
          with_original_language: 'ja',
          // page: '2',
          'release_date.gte': fourMonthsAgoDate,
          'release_date.lte': todayDate,
        }

        recentMovieInfos.value = await fetchMovieInfos('/discover/movie', params, error, isLoading)
      }
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="text-center">
    <h1 class="my-3 text-2xl">Search Movie ↓</h1>
    <input
      v-model="searchInput"
      @keydown.enter="handleSearch"
      class="w-[70%] rounded-sm bg-[#f49895] px-3 py-2 text-[#232323] outline-none"
      type="text"
      placeholder="映画のタイトルを入力してEnter"
    />
  </div>
  <h1 class="my-3 text-2xl">{{ listTitle }}</h1>

  <div v-if="isLoading" class="text-center">ローディング中...</div>

  <div v-if="error" class="text-center text-red-500">{{ error.message }}</div>

  <div
    v-if="!isLoading && moviesToDisplay.length > 0"
    class="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5"
  >
    <RouterLink
      v-for="movie in moviesToDisplay"
      :key="movie.id"
      :to="`/movie/${movie.id}`"
      class="rounded-sm bg-[#f49895] p-3 text-[#232323] shadow-md"
    >
      <div class="aspect-[2/3] w-full overflow-hidden rounded-sm bg-gray-300">
        <img
          class="h-full w-full object-cover transition-transform hover:scale-105"
          :src="movie.poster_path ? `${IMAGE_BASE_URL}/${IMAGE_SIZE}${movie.poster_path}` : ''"
          :alt="movie.title"
        />
      </div>
      <div class="mt-2">
        <p class="line-clamp-2 min-h-[2.5rem] text-sm font-bold">{{ movie.title }}</p>
        <p class="mt-1 text-xs text-gray-700">{{ movie.release_date }}公開</p>
      </div>
    </RouterLink>
  </div>
</template>
