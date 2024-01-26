<template>
  <div class="w-full flex items-center justify-items-start select-none">
    <label class="cursor-pointer justify-items-start flex items-center">
      <input
        v-model="value"
        :class="{ 'has-error': !!errorMessage }"
        class="w-4 h-4 text-red-500 bg-red-500 m-1 accent-primary"
        type="checkbox"
      />
      <span>
        {{ label }}
      </span>
    </label>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

interface IInputProps {
  name?: string
  label: string
  modelValue?: boolean
  errorMessage?: string
}

const props = defineProps<IInputProps>()
const emit = defineEmits(['update:modelValue'])

const value = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
  }
})
</script>
