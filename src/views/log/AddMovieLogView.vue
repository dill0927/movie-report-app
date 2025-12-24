<script setup lang="ts">
import { useMovieLogStore } from '@/stores/movieLog'
import type { FormData, MovieState } from '@/type/MovieLog'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const store = useMovieLogStore()

const movieId = parseInt(route.params.id as string)

const movieData = ref<MovieState | undefined>(undefined)
const formData = ref<FormData>({
  watchedDate: '',
  watchType: undefined,
  memo: undefined,
})

onMounted(() => {
  const state = history.state as MovieState

  if (!state.title || !state.posterPath) {
    alert('不正なアクセスです。ホーム画面から映画を選択してください。')
    router.push('/')
    return
  }

  movieData.value = state

  const today = new Date().toISOString().split('T')[0]!
  formData.value.watchedDate = today
})

const canSubmit = computed(() => {
  return movieData.value && formData.value.watchedDate
})

const handleSubmit = () => {
  if (!canSubmit.value || !movieData.value) return

  store.addMovieLog({
    id: movieId,
    title: movieData.value.title,
    posterPath: movieData.value.posterPath,
    watchedDate: formData.value.watchedDate,
    watchType: formData.value.watchType,
    memo: formData.value.memo,
  })

  router.push('/log')
}

const handleCancel = () => {
  router.back()
}
</script>

<template>
  <div class="mx-auto px-4 py-8">
    <h1 class="mb-6 text-center text-2xl font-bold">映画鑑賞ログを追加</h1>

    <div class="flex flex-col gap-5">
      <!-- 映画情報表示 -->
      <div v-if="movieData">
        <label for="movieTitle" class="mb-2"> 映画タイトル </label>
        <input
          id="movieTitle"
          v-model="movieData.title"
          type="text"
          disabled
          class="w-full rounded-sm bg-secondary px-4 py-3 text-primary outline-none"
        />
      </div>

      <!-- フォーム -->
      <form class="flex flex-col gap-5">
        <!-- 鑑賞日 -->
        <div>
          <label for="watchedDate" class="mb-2"> 鑑賞日 <span class="text-red-500">*</span> </label>
          <input
            id="watchedDate"
            v-model="formData.watchedDate"
            type="date"
            required
            class="w-full rounded-sm bg-primary px-4 py-3 text-secondary outline-none"
          />
        </div>

        <!-- 視聴方法 -->
        <div>
          <label class="mb-2">視聴方法</label>
          <div class="flex gap-4">
            <label class="flex cursor-pointer items-center gap-2">
              <input
                v-model="formData.watchType"
                type="radio"
                value="映画館"
                class="h-4 w-4 cursor-pointer"
              />
              <span>映画館</span>
            </label>
            <label class="flex cursor-pointer items-center gap-2">
              <input
                v-model="formData.watchType"
                type="radio"
                value="配信"
                class="h-4 w-4 cursor-pointer"
              />
              <span>配信</span>
            </label>
          </div>
        </div>

        <!-- メモ -->
        <div>
          <label for="memo" class="mb-2">メモ</label>
          <textarea
            id="memo"
            v-model="formData.memo"
            rows="6"
            placeholder="覚えておきたいことがあれば…"
            class="w-full rounded-sm bg-primary px-4 py-3 text-secondary outline-none"
          ></textarea>
        </div>

        <!-- ボタン -->
        <div class="flex gap-4">
          <button
            type="button"
            @click="handleCancel"
            class="flex-1 rounded-sm bg-gray-500 px-6 py-3 text-secondary transition-colors hover:bg-gray-700"
          >
            キャンセル
          </button>
          <button
            type="submit"
            @click="handleSubmit"
            :disabled="!canSubmit"
            class="flex-1 rounded-sm bg-accent px-6 py-3 text-secondary transition-colors hover:bg-yellow-700"
          >
            保存
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
