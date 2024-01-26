<template>
  <div class="relative">
    <button
      :class="[
        'px-3 py-2 pt-3 border-b-[3px] mb-[-3px] transition duration-300',
        active
          ? 'border-b-primary text-primary'
          : 'border-b-transparent text-gray-500  dark:text-white '
      ]"
      v-text="title"
    />

    <slot name="button"></slot>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  title: string
  active?: boolean
}>()
</script>
