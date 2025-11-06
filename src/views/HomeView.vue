<script setup lang="ts">
import { fetchMovieDetailInfos, fetchMovieInfos } from '@/services/fetchMovieInfos'
import type { MovieDetailInfo, MovieInfo } from '@/type/MovieInfo'
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import Modal from '@/components/ui/CommonModal.vue'
import { formatDate } from '@/utils/date'

const route = useRoute()
const router = useRouter()

const recentMovieInfos = ref<MovieInfo[]>([])
const searchedMovieInfos = ref<MovieInfo[]>([])
const viewedMovieDetailInfo = ref<MovieDetailInfo | null>(null)
const error = ref<Error | null>(null)
const isLoading = ref(true)
const isLoadingModalData = ref(true)
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
  return 'Latest & Trending Movies'
})

const movieIdToView = computed(() => {
  return route.query.viewMovie as string | undefined
})
const showModal = computed(() => !!movieIdToView.value)
const closeModal = () => {
  const newQuery = { ...route.query }
  delete newQuery.viewMovie

  router.push({ query: newQuery })
}

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

//URLにviewMovieクエリがある時には、映画詳細データを取得
watch(
  movieIdToView,
  async (newMovieId) => {
    if (newMovieId) {
      const movieId = parseInt(newMovieId)
      console.log('movieId:' + newMovieId + 'で映画詳細取得APIを実行')
      viewedMovieDetailInfo.value = await fetchMovieDetailInfos(movieId, error, isLoadingModalData)
      console.dir(viewedMovieDetailInfo.value)
    } else {
      viewedMovieDetailInfo.value = null
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="mt-10 mb-20 text-center">
    <h1 class="my-3 text-2xl">Search Movie ↓</h1>
    <input
      v-model="searchInput"
      @keydown.enter="handleSearch"
      class="w-[70%] rounded-sm bg-primary px-3 py-3 text-secondary outline-none"
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
      :to="{ query: { ...route.query, viewMovie: movie.id } }"
      class="rounded-sm bg-primary p-3 text-secondary"
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
        <p class="mt-1 text-xs text-gray-300">{{ formatDate(movie.release_date) }}公開</p>
      </div>
    </RouterLink>
  </div>

  <Teleport to="body">
    <Modal :show="showModal" @close="closeModal">
      <div v-if="isLoadingModalData" class="text-center">ローディング中...</div>
      <div v-if="error" class="text-center text-red-500">{{ error.message }}</div>
      <div v-if="viewedMovieDetailInfo" class="gap-4 sm:grid sm:grid-cols-10">
        <div class="aspect-[2/3] w-full overflow-hidden bg-gray-300 sm:col-span-4">
          <img
            class="h-full w-full object-cover"
            :src="
              viewedMovieDetailInfo.poster_path
                ? `${IMAGE_BASE_URL}/${IMAGE_SIZE}${viewedMovieDetailInfo.poster_path}`
                : ''
            "
            :alt="viewedMovieDetailInfo.title"
          />
        </div>
        <div class="sm:col-span-6">
          <h1 class="inline text-lg font-bold">{{ viewedMovieDetailInfo.title }}</h1>
          <span class="ml-2 text-xs text-gray-200 italic">{{
            viewedMovieDetailInfo.production_countries[0]?.name
          }}</span>
          <div class="my-1 flex flex-wrap gap-1">
            <div
              v-for="genre in viewedMovieDetailInfo.genres"
              class="rounded-sm bg-secondary p-0.5 text-xs whitespace-nowrap text-primary"
              :key="genre.id"
            >
              {{ genre.name }}
            </div>
          </div>
          <div class="flex flex-col gap-2 text-xs">
            <div class="mt-5 pr-2">
              <p class="whitespace-pre-wrap">{{ viewedMovieDetailInfo.overview }}</p>
            </div>
            <div class="flex gap-2">
              <v-icon name="bi-people-fill" />
              <div class="flex flex-wrap gap-1">
                <span v-for="cast in viewedMovieDetailInfo.cast" :key="cast.name">{{
                  cast.name
                }}</span>
              </div>
            </div>
            <div class="flex gap-2">
              <v-icon name="bi-link-45deg" class="shrink-0" />
              <template v-if="viewedMovieDetailInfo.homepage">
                <a
                  :href="viewedMovieDetailInfo.homepage"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="break-all hover:text-blue-400 hover:underline"
                  >{{ viewedMovieDetailInfo.homepage }}</a
                >
              </template>
              <template v-else>ー</template>
            </div>
            <p>{{ formatDate(viewedMovieDetailInfo.release_date) }}公開</p>
          </div>
        </div>
      </div>
    </Modal>
  </Teleport>
</template>
