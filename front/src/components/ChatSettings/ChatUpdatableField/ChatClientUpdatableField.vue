<script lang="ts" setup>
import { computed } from 'vue'
import { updateDetailsRequest } from '@/service/http/api/client'
import BaseInput from '@/components/Input/Input.vue'
import { useAxiosErrorMessage } from '@/helpers/error'
import BaseUpdatableField from '@/components/ChatSettings/ChatUpdatableField/BaseUpdatableField.vue'

const props = defineProps({
  mode: {
    type: String,
    default: 'input'
  },
  type: {
    type: String,
    default: 'text'
  },
  label: {
    type: String
  },
  clientId: {
    type: String,
    required: true
  },
  field: {
    type: String,
    required: true
  },
  modelValue: {
    type: String
  },
  inputClass: {
    type: String
  }
})

const emit = defineEmits(['update:modelValue'])

const { mutateAsync: doUpdate, isLoading, isError, isSuccess, error } = updateDetailsRequest()

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
    clientId: props.clientId,
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
    <input
      v-if="mode === 'input'"
      v-model="localValue"
      :class="inputClass"
      :type="type"
      class="bg-transparent px-0.5 w-full border-b focus:border-primary hover:border-gray-300 border-transparent"
    />

    <BaseInput v-else-if="mode === 'textarea'" v-model="localValue" textarea />
  </BaseUpdatableField>
</template>