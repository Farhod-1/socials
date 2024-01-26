<template>
  <p
    class="border flex gap-2 items-center justify-between px-2 py-1 rounded-xl bg-gray-50 border-gray-300 cursor-pointer dark:bg-gray-700"
  >
    <slot />
    <IconDelete />
  </p>
</template>

<script lang="ts" setup>
import IconDelete from '@/assets/icon/IconDelete.vue'
</script>