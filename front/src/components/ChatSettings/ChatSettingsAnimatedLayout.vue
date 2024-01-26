<script setup lang="ts">
import { computed } from 'vue'
import IconLeftArrow from '@/assets/icon/IconLeftArrow.vue'

const props = defineProps({
  open: Boolean,
  title: String
})

const emit = defineEmits(['update:open'])

const isOpen = computed({
  get() {
    return props.open
  },
  set(value) {
    emit('update:open', value)
  }
})
</script>

<template>
  <div
    :class="[isOpen ? 'translate-x-0' : 'translate-x-full']"
    class="absolute top-0 right-0 w-full h-full transition-all duration-250 z-10 dark:bg-dark-900 bg-white"
  >
    <div class="h-full overflow-hidden flex flex-col relative" v-if="isOpen">
      <slot name="header">
        <div class="flex items-center gap-4 p-4 border-b dark:border-b-dark-700 select-none">
          <IconLeftArrow class="w-6 h-6 text-gray-500 cursor-pointer" @click="isOpen = false" />

          <span>{{ title }}</span>
        </div>
      </slot>

      <slot></slot>
    </div>
  </div>
</template>
