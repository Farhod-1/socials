<template>
  <div class="border flex flex-row rounded-lg bg-white dark:bg-dark-900 overflow-hidden">
    <div
      v-for="option in props.options"
      :key="option.value"
      @click="local = option.value"
      class="text-sm flex-grow text-center cursor-pointer transition py-3 px-3 dark:hover:bg-dark-600 dark:[&.active]:bg-dark-700 hover:bg-gray-100 [&.active]:bg-gray-200"
      :class="{ active: option.value === local }"
    >
      {{ option.label }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

interface Option {
  label: string
  value: string | number | undefined
}

const props = defineProps<{
  options: Option[]
  modelValue: string | number | undefined
}>()

const emit = defineEmits(['update:modelValue'])

const local = computed({
  get() {
    return props.modelValue ?? props.options[0].value
  },
  set(value: unknown) {
    emit('update:modelValue', value)
  }
})
</script>
