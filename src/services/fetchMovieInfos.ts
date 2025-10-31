import type { MovieDetailInfo, MovieInfo } from '@/type/MovieInfo'
import axios from 'axios'
import type { Ref } from 'vue'

type ApiParams = {
  [key: string]: string
}
type ErrorRef = Ref<Error | null>
type IsLoadingRef = Ref<boolean>

const apiKey = import.meta.env.VITE_TMDB_API_KEY

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

export const fetchMovieInfos = async (
  path: string,
  params: ApiParams,
  error: ErrorRef,
  isLoading: IsLoadingRef,
): Promise<MovieInfo[]> => {
  error.value = null
  isLoading.value = true

  try {
    const response = await tmdbApi.get(path, {
      params,
    })

    if (!response.data?.results) {
      throw new Error('APIからデータを取得できませんでした')
    }

    const movieInfos: MovieInfo[] = response.data.results.map((movie: MovieInfo) => ({
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      release_date: movie.release_date,
    }))

    return movieInfos
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
    isLoading.value = false
  }
}

export const fetchMovieDetailInfos = async (
  movieId: number,
  error: ErrorRef,
  isLoading: IsLoadingRef,
): Promise<MovieDetailInfo | null> => {
  error.value = null
  isLoading.value = true

  try {
    const [movieDetails, movieCredits] = await Promise.all([
      tmdbApi.get(`/movie/${movieId}`),
      tmdbApi.get(`/movie/${movieId}/credits`),
    ])

    if (!movieDetails.data || !movieCredits.data) {
      throw new Error('APIからデータを取得できませんでした')
    }

    const movieDetailInfo: MovieDetailInfo = {
      id: movieDetails.data.id,
      title: movieDetails.data.title,
      poster_path: movieDetails.data.poster_path,
      release_date: movieDetails.data.release_date,
      genres: movieDetails.data.genres,
      homepage: movieDetails.data.homepage,
      overview: movieDetails.data.overview,
      production_countries: movieDetails.data.production_countries,
      cast: movieCredits.data.cast?.slice(0, 5) || [],
    }

    return movieDetailInfo
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
    return null
  } finally {
    isLoading.value = false
  }
}
