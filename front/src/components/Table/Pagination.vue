<template>
  <div
    v-show="lastPage > 1"
    class="inline-flex justify-center py-1 border-2 rounded-lg bg-white dark:bg-dark-900"
  >
    <button
      class="px-3 mx-0.5 py-1 hover:bg-blue-200 dark:hover:bg-indigo-500 rounded cursor-pointer"
      :disabled="modelValue === 1"
      @click="setPage(1)"
    >
      «
    </button>

    <button
      class="px-3 mx-0.5 py-1 dark:hover:bg-indigo-500 rounded cursor-pointer"
      @click="setPage(Math.max(modelValue - 1, 1))"
    >
      ‹
    </button>

    <button
      v-for="page in pages"
      :key="page"
      :class="{
        'bg-blue-200 hover:bg-blue-400 dark:hover:bg-indigo-500 dark:bg-indigo-700':
          page === modelValue,
        'dark:hover:bg-indigo-500 cursor-pointer': typeof page === 'number'
      }"
      class="px-3 mx-0.5 py-1 rounded"
      @click="typeof page === 'number' && setPage(page)"
      v-html="page"
    />

    <button
      class="px-3 mx-0.5 py-1 dark:hover:bg-indigo-500 rounded cursor-pointer"
      @click="setPage(Math.min(modelValue + 1, lastPage))"
    >
      ›
    </button>

    <button
      :disabled="modelValue === lastPage"
      class="px-3 mx-0.5 py-1 dark:hover:bg-indigo-500 rounded cursor-pointer"
      @click="setPage(lastPage)"
    >
      »
    </button>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  modelValue: {
    type: Number,
    required: true
  },
  lastPage: {
    type: Number,
    required: true
  },
  eachSide: {
    type: Number,
    default: 3
  }
})

function setPage(page: number) {
  emit('update:modelValue', page)
}

const pages = computed(() => {
  const pages = []

  const start = Math.min(
    Math.min(
      Math.max(props.modelValue - props.eachSide, 1),
      Math.max(props.lastPage - 1 - props.eachSide * 2, 1)
    ),
    Math.max(props.lastPage, 1)
  )

  const end = Math.min(
    Math.max(
      Math.min(props.modelValue + props.eachSide, props.lastPage - 1),
      1 + props.eachSide * 2
    ),
    Math.max(props.lastPage, 1)
  )

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})
</script>
