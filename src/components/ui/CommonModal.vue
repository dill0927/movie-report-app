<script setup lang="ts">
import { watch } from 'vue'

const props = defineProps<{ show: boolean }>()

watch(
  () => props.show,
  (newValue) => {
    if (newValue) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  },
)
</script>

<template>
  <Transition name="modal">
    <div
      v-if="show"
      class="fixed inset-0 z-1001 flex items-center justify-center overflow-y-auto bg-gray-50/50 transition-opacity"
    >
      <div
        class="modal-container my-8 flex max-h-[90vh] w-2/3 flex-col overflow-hidden rounded-sm bg-primary text-secondary shadow-xl transition-all"
      >
        <div class="sticky top-0 z-10 flex justify-end bg-primary p-2">
          <button @click="$emit('close')" class="hover:opacity-80">
            <v-icon name="io-close-sharp" />
          </button>
        </div>
        <div class="overflow-y-auto px-5 pb-6">
          <slot></slot>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style>
.modal-enter-from {
  opacity: 0;
}

.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
