<script setup lang="ts">
import IconProfile from '@/assets/icon/IconProfile.vue'

defineProps({
  name: {
    type: String,
    required: true
  },
  icon: {
    type: Object,
    required: true,
    default: () => IconProfile
  }
})
</script>

<template>
  <div
    class="flex flex-row justify-between items-center w-full border px-4 py-1 bg-white rounded-lg shadow-md dark:bg-dark-900 relative"
  >
    <p
      class="flex px-2 gap-[6px] items-center text-sm bg-white dark:!bg-dark-900 absolute top-[-10px]"
    >
      <Component :is="icon" class="w-4 h-4" />
      {{ name }}
    </p>
    <slot />
  </div>
</template>
