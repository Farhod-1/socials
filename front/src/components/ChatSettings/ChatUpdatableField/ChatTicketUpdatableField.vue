<script lang="ts" setup>
import { computed } from 'vue'
import { useAxiosErrorMessage } from '@/helpers/error'
import { updateTicketDescription } from '@/service/http/api/chat'
import RichEditor from '@/components/RichEditor/RichEditor.vue'
import BaseUpdatableField from '@/components/ChatSettings/ChatUpdatableField/BaseUpdatableField.vue'

const props = defineProps({
  label: {
    type: String
  },

  projectId: {
    type: String,
    required: true
  },

  ticketId: {
    type: String,
    required: true
  },

  field: {
    type: String,
    required: true
  },

  modelValue: {
    type: String
  }
})

const emit = defineEmits(['update:modelValue'])

const {
  mutateAsync: doUpdate,
  isLoading,
  isError,
  isSuccess,
  error
} = updateTicketDescription(props.ticketId)

const errorMessage = useAxiosErrorMessage(error)

const localValue = computed({
  get() {
    return props.modelValue
  },

  set(value) {
    emit('update:modelValue', value)
  }
})

async function onFieldUpdated(value?: string) {
  return doUpdate({
    [props.field]: value
  })
}
</script>

<template>
  <BaseUpdatableField
    :do-update="onFieldUpdated"
    :error-message="errorMessage"
    :is-error="isError"
    :is-loading="isLoading"
    :is-success="isSuccess"
    :label="label"
    :model-value="localValue"
  >
    <div class="h-[200px] mb-16">
      <RichEditor v-model:content="localValue" />
    </div>
  </BaseUpdatableField>
</template>
