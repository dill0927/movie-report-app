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
const IMAGE_SIZE = 'w185'

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
  <div v-for="recentMovieInfo in recentMovieInfos">
    <img
      :src="
        recentMovieInfo.poster_path
          ? `${IMAGE_BASE_URL}/${IMAGE_SIZE}${recentMovieInfo.poster_path}`
          : ''
      "
      :alt="recentMovieInfo.title"
    />
  </div>
  <RouterLink to="/movie/:id">映画詳細</RouterLink>
</template>
