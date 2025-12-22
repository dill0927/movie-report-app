import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { MovieLog } from '@/type/MovieLog'

export const useMovieLogStore = defineStore('movieLogs', () => {
  const movieLogs = ref<MovieLog[]>([])
  function addMovieLog(logInfo: MovieLog) {
    movieLogs.value.push(logInfo)
  }

  return { movieLogs, addMovieLog }
})
