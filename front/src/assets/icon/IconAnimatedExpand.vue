<template>
  <svg height="16" width="16" xmlns="http://www.w3.org/2000/svg">
    <rect
      :class="{ '!rotate-180': expanded }"
      class="transform origin-center transition duration-200 ease-out"
      height="2"
      rx="1"
      width="16"
      y="7"
    />
    <rect
      :class="{ '!rotate-180': expanded }"
      class="transform origin-center rotate-90 transition duration-200 ease-out"
      height="2"
      rx="1"
      width="16"
      y="7"
    />
  </svg>
</template>

<script lang="ts" setup>
defineProps({
  expanded: Boolean
})
</script>
