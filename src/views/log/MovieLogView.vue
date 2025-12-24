<script setup lang="ts">
import { computed, ref } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import { POSTER } from '@/constants/movieData'
import { useMovieLogStore } from '@/stores/movieLog'
import { splitDate } from '@/utils/date'

const movieLogStore = useMovieLogStore()
const movieLogs = computed(() => {
  return [...movieLogStore.movieLogs].sort((a, b) => {
    return new Date(b.watchedDate).getTime() - new Date(a.watchedDate).getTime()
  })
})

const visibleItems = ref<Set<string>>(new Set())

// 各ログアイテムの可視性を監視する関数
const observeLogItem = (el: Element | null, key: string) => {
  if (!el) return

  useIntersectionObserver(
    el as HTMLElement,
    ([entry]) => {
      if (entry && entry.isIntersecting) {
        visibleItems.value.add(key)
      }
    },
    { threshold: 0.1 }, // 10%見えたらトリガー
  )
}
</script>

<template>
  <div class="mx-auto flex h-full w-full flex-col px-4 py-8">
    <h1 class="mb-6 text-center text-2xl font-bold">映画鑑賞ログ</h1>

    <div class="flex-1 overflow-hidden">
      <!-- ログデータ有：リストを表示 -->
      <div v-if="movieLogs.length > 0" class="h-full overflow-y-auto pr-2">
        <div class="space-y-4">
          <div
            v-for="(log, index) in movieLogs"
            :key="`${log.id}-${log.watchedDate}`"
            :ref="(el) => observeLogItem(el as Element, `${log.id}-${log.watchedDate}`)"
            :class="[
              'log-item flex gap-4',
              visibleItems.has(`${log.id}-${log.watchedDate}`) ? 'is-visible' : '',
            ]"
            :style="{ '--index': index }"
          >
            <div class="flex flex-col items-center justify-center rounded-full bg-accent px-4 py-2">
              <p class="font-date text-sm">{{ splitDate(log.watchedDate).monthDay }}</p>
              <p class="font-date text-xs">{{ splitDate(log.watchedDate).year }}</p>
            </div>
            <div class="flex grow gap-5 rounded-sm bg-primary px-6 py-4">
              <img
                class="w-25 rounded-sm"
                :src="`${POSTER.BASE_URL}/${POSTER.SIZE}${log.posterPath}`"
                :alt="log.title"
              />
              <div class="flex flex-col gap-2 text-secondary">
                <div class="w-fit rounded-sm bg-secondary px-1 py-0.5 text-primary">
                  <p v-if="log.watchType === '映画館'" class="text-sm">
                    🎥 {{ log.watchType }}で鑑賞
                  </p>
                  <p v-if="log.watchType === '配信'" class="text-sm">
                    📺 {{ log.watchType }}で鑑賞
                  </p>
                </div>
                <p class="text-xl">{{ log.title }}</p>
                <p v-if="log.memo" class="text-sm">{{ log.memo }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ログデータ無：メッセージを表示 -->
      <div v-else class="mt-10 text-center">
        <v-icon name="gi-balloon-dog" scale="5" class="mb-2" />
        <p>No logs... Let's add logs !</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.log-item {
  opacity: 0;
  transform: translateX(-30px);
  transition:
    opacity 0.6s ease-out,
    transform 0.6s ease-out;
  transition-delay: calc(var(--index) * 0.1s);
}

.log-item.is-visible {
  opacity: 1;
  transform: translateX(0);
}
</style>
