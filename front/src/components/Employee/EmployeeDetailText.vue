<script lang="ts" setup>
defineProps<{
  label?: string
  value?: string | number
  size?: string
}>()
</script>

<template>
  <div class="">
    <div class="mb-1 text-gray-800 dark:text-gray-500 flex items-center gap-1">
      <slot name="label">{{ label }}</slot>
    </div>

    <slot>
      <div
        class="transition"
        :class="size == 'large' ? '' : 'line-clamp-1 hover:line-clamp-none break-all text-ellipsis'"
      >
        {{ value }}
      </div>
    </slot>
  </div>
</template>
