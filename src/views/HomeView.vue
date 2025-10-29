<script setup lang="ts">
import axios from 'axios'
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'

interface MovieInfo {
  id: number
  title: string
  overview: string
  genre_ids: number[]
  poster_path: string
  release_date: string
}

const recentMovieInfos = ref<MovieInfo[]>([])
const error = ref<Error | null>(null)
const isLoading = ref(true)

const apiKey = import.meta.env.VITE_TMDB_API_KEY
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'
const IMAGE_SIZE = 'w500'

const tmdbApi = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  headers: {
    Authorization: `Bearer ${apiKey}`,
    accept: 'application/json',
  },
  params: {
    language: 'ja-JP',
    region: 'JP',
  },
})

const fetchRecentMovieInfo = async (): Promise<MovieInfo[]> => {
  error.value = null
  isLoading.value = true

  const today = new Date()
  const todayDate = today.toLocaleDateString('sv-SE')
  today.setMonth(today.getMonth() - 4)
  const fourMonthsAgoDate = today.toLocaleDateString('sv-SE')

  try {
    const response = await tmdbApi.get('/discover/movie', {
      params: {
        sort_by: 'popularity.desc',
        with_original_language: 'ja',
        // page: '2',
        'release_date.gte': fourMonthsAgoDate,
        'release_date.lte': todayDate,
      },
    })

    if (!response.data?.results) {
      throw new Error('APIからデータを取得できませんでした')
    }

    const recentMovies: MovieInfo[] = response.data.results.map((movie: MovieInfo) => ({
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      genre_ids: movie.genre_ids,
      poster_path: movie.poster_path,
      release_date: movie.release_date,
    }))

    return recentMovies
  } catch (e) {
    if (axios.isAxiosError(e)) {
      if (e.response?.status === 401) {
        error.value = e instanceof Error ? e : new Error('API認証に失敗しました')
      } else if (e.response?.status === 404) {
        error.value = e instanceof Error ? e : new Error('リソースが見つかりませんでした')
      } else {
        error.value = e instanceof Error ? e : new Error('APIリクエストに失敗しました')
      }
    } else {
      error.value = e instanceof Error ? e : new Error('予期せぬエラーが発生しました')
    }
    console.error('Error fetching movies:', e)
    return []
  } finally {
    isLoading.value = true
  }
}

onMounted(async () => {
  recentMovieInfos.value = await fetchRecentMovieInfo()
})
</script>

<template>
  <h1 class="my-3 text-2xl">Now Playing</h1>
  <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5">
    <RouterLink
      v-for="recentMovieInfo in recentMovieInfos"
      :key="recentMovieInfo.id"
      :to="`/movie/${recentMovieInfo.id}`"
      class="rounded-sm bg-[#f49895] p-3 text-[#232323] shadow-md"
    >
      <div class="aspect-[2/3] w-full overflow-hidden rounded-sm bg-gray-300">
        <img
          class="h-full w-full object-cover transition-transform hover:scale-105"
          :src="
            recentMovieInfo.poster_path
              ? `${IMAGE_BASE_URL}/${IMAGE_SIZE}${recentMovieInfo.poster_path}`
              : ''
          "
          :alt="recentMovieInfo.title"
        />
      </div>
      <div class="mt-2">
        <p class="line-clamp-2 min-h-[2.5rem] text-sm font-bold">{{ recentMovieInfo.title }}</p>
        <p class="mt-1 text-xs text-gray-700">{{ recentMovieInfo.release_date }}公開</p>
      </div>
    </RouterLink>
  </div>
</template>
