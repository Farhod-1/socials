<script lang="ts" setup>
import ChatDetailField from '@/components/ChatSettings/ChatUpdatableField/ChatDetailField.vue'
import { type PropType, ref } from 'vue'
import IconDone from '@/assets/icon/IconDone.vue'
import IconError from '@/assets/icon/IconError.vue'
import { watchDebounced } from '@vueuse/core'
import IconLoading from '@/assets/icon/IconLoading.vue'

const props = defineProps({
  label: {
    type: String
  },

  modelValue: {
    type: String
  },

  isLoading: {
    type: Boolean,
    default: false
  },

  isError: {
    type: Boolean,
    default: false
  },

  isSuccess: {
    type: Boolean,
    default: false
  },

  errorMessage: {
    type: String
  },

  doUpdate: {
    type: Function as PropType<(data?: string) => Promise<any>>,
    required: true
  },

  debounce: {
    type: Number,
    default: 2000
  }
})

const emit = defineEmits(['update:modelValue'])

const showStatus = ref(false)
let timeout: ReturnType<typeof setTimeout> | undefined

watchDebounced(
  () => props.modelValue,
  async (value) => {
    if (timeout) {
      clearTimeout(timeout)
    }

    showStatus.value = true

    props.doUpdate(value).then(() => {
      timeout = setTimeout(() => {
        showStatus.value = false
      }, 4000)
    })
  },
  {
    debounce: props.debounce
  }
)
</script>

<template>
  <ChatDetailField>
    <template #label>
      <span>{{ label }}</span>

      <span>
        <IconLoading v-if="isLoading && showStatus" class="h-4 w-4 text-primary-600 animate-spin" />
        <IconDone v-else-if="isSuccess && showStatus" class="text-green-700 w-4 h-4" />
        <IconError v-else-if="isError && showStatus" class="text-red-700 w-4 h-4" />
      </span>
    </template>

    <slot></slot>

    <div v-if="errorMessage" class="text-red-500" v-text="errorMessage" />
  </ChatDetailField>
</template>
