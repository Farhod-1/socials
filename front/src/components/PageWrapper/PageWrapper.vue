<template>
  <div class="flex-grow max-h-screen overflow-auto relative">
    <div
      class="bg-white sticky top-0 flex items-center dark:bg-dark-900 z-[1] ltr:pr-[320px] rtl:pl-[320px] px-4 gap-4 h-[85px] shrink-0 border-b dark:border-dark-700"
    >
      <slot name="actions">
        <span class="font-bold">{{ pageTitle }}</span>
      </slot>
    </div>

    <div :class="pageClass">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  pageTitle: {
    required: false
  },

  pageClass: {
    default: ''
  }
})
</script>
