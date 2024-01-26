<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'

interface IInputProps {
  name?: string
  type?: string
  label?: string
  placeholder?: string
  modelValue?: string | number
  errorMessage?: string
  textarea?: boolean
  autoFocus?: boolean
  disabled?: boolean
}

const props = defineProps<IInputProps>()
const emit = defineEmits(['update:modelValue', 'blur', 'focus'])
defineExpose({ focus })

const autocomplete = computed(() => {
  if (props.type === 'password') {
    return 'new-password'
  }
  if (props.name === 'username') {
    return 'username'
  }
  return 'off'
})
const value = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
  }
})

const inputRef = ref<HTMLInputElement | HTMLTextAreaElement>()

function focus() {
  inputRef.value?.focus()
}

onMounted(() => {
  if (props.autoFocus) focus()
})
</script>
<template>
  <div :class="{ 'has-error': !!errorMessage, isFilled: value }" class="TextInput bg-transparent">
    <label class="input">
      <textarea
        v-if="textarea"
        ref="inputRef"
        v-model="value"
        :name="name"
        @blur="emit('blur')"
        @focus="emit('focus')"
      />
      <input
        v-else
        ref="inputRef"
        v-model="value"
        :autocomplete="autocomplete"
        :disabled="disabled"
        :name="name"
        :type="type"
      />
      <span v-if="placeholder" class="place truncate text-ellipsis max-w-[calc(100%-20px)]">{{
        placeholder
      }}</span>
    </label>
    <p v-show="errorMessage" class="help-message">{{ errorMessage }}</p>
  </div>
</template>
