<script lang="ts" setup>
defineProps<{
  label?: string
  value?: string | number
}>()
</script>

<template>
  <div class="text-sm">
    <div class="mb-1 text-gray-400 flex items-center gap-1">
      <slot name="label">{{ label }}</slot>
    </div>

    <slot>
      <div class="break-all text-ellipsis line-clamp-1 hover:line-clamp-none transition">
        {{ value }}
      </div>
    </slot>
  </div>
</template>
