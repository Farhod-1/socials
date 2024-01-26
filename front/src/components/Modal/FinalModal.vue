<template>
  <VueFinalModal
    :esc-to-close="false"
    class="flex justify-center items-center text-black"
    content-class="flex flex-col max-w-[90vw] mx-4 p-4 bg-white border rounded-lg space-y-2 dark:bg-dark-700 dark:border-dark-600 dark:text-white max-h-[90vh] overflow-y-auto"
    content-transition="vfm-slide-up"
  >
    <div ref="modalRef" tabindex="0">
      <div v-if="hasTitle" class="flex items-center gap-2">
        <slot name="title">
          <h1 class="text-xl flex-grow">
            {{ title }}
          </h1>
        </slot>

        <IconClose
          class="cursor-pointer hover:opacity-70 hover:rotate-90 transition"
          @click.stop="emit('close')"
        />
      </div>

      <slot />
    </div>
  </VueFinalModal>
</template>

<script lang="ts" setup>
import { VueFinalModal } from 'vue-final-modal'
import IconClose from '@/assets/icon/IconClose.vue'
import { nextTick, onMounted, ref } from 'vue'

defineProps({
  title: {
    type: String,
    default: ''
  },

  hasTitle: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['close'])
const modalRef = ref<HTMLDivElement>()

function closeModal(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    emit('close')

    event.preventDefault()
    event.stopPropagation()
  }
}

onMounted(() => {
  modalRef.value?.addEventListener('keydown', closeModal)

  nextTick(() => {
    modalRef.value?.focus()
  })

  return () => {
    modalRef.value?.removeEventListener('keydown', closeModal)
  }
})
</script>
