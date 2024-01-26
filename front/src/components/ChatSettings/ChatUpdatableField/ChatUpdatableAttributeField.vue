<script lang="ts" setup>
import { computed, type PropType } from 'vue'
import {
  CustomAttributeType,
  CustomAttributeTypes,
  setCustomAttribute
} from '@/service/http/api/custom-attribute'
import { useAxiosErrorMessage } from '@/helpers/error'
import BaseUpdatableField from '@/components/ChatSettings/ChatUpdatableField/BaseUpdatableField.vue'

const props = defineProps({
  customAttributeType: {
    type: String as PropType<CustomAttributeType>,
    required: true,
    validator: (value: CustomAttributeType) => {
      return CustomAttributeTypes.includes(value)
    }
  },

  customAttributeId: {
    type: String,
    required: true
  },

  label: {
    type: String
  },

  modelValue: {
    type: String
  },

  clientId: {
    type: String,
    required: true
  },

  projectId: {
    type: String,
    required: true
  },

  inputClass: {
    type: String,
    required: false
  }
})

const emit = defineEmits(['update:modelValue'])

const { mutateAsync: doUpdate, isLoading, isError, isSuccess, error } = setCustomAttribute()

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
    id: props.clientId,
    customAttributeType: props.customAttributeType,
    customAttributeId: props.customAttributeId,
    projectId: props.projectId,
    value: value || ''
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
      v-model="localValue"
      :class="inputClass"
      class="hover:border-gray-300 border-transparent bg-transparent px-0.5 w-full border-b focus:border-primary"
      type="text"
    />
  </BaseUpdatableField>
</template>