<script lang="ts" setup>
import BaseUpdatableField from '@/components/ChatSettings/ChatUpdatableField/BaseUpdatableField.vue'
import SimpleSelect from '@/components/Select/SimpleSelect.vue'
import { useAxiosErrorMessage } from '@/helpers/error'
import { changeProjectRequest } from '@/service/http/api/client'
import { getProjectsList } from '@/service/http/api/projects'
import { computed } from 'vue'

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
  ticketId: {
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

const { data: projects } = getProjectsList()

const projectOptions = computed(() => {
  return (projects.value ?? []).map((el) => ({ value: el._id, name: el.name }))
})

const { mutateAsync: doUpdate, isLoading, isError, isSuccess, error } = changeProjectRequest()

const errorMessage = useAxiosErrorMessage(error)

const localValue = computed({
  get() {
    return props.modelValue
  },

  set(value) {
    emit('update:modelValue', value)
  }
})

const projectName = computed(() => {
  const project = projectOptions.value.find((x) => x.value === props.modelValue)

  return project?.name ?? ''
})

async function onFieldUpdated(value?: string) {
  if (value)
    return doUpdate({
      ticketId: props.ticketId,
      newProject: {
        id: value,
        name: projectName.value
      }
    })
}
</script>

<template>
  <BaseUpdatableField
    :debounce="0"
    :do-update="onFieldUpdated"
    :error-message="errorMessage"
    :is-error="isError"
    :is-loading="isLoading"
    :is-success="isSuccess"
    :label="label"
    :model-value="localValue"
  >
    <SimpleSelect v-model="localValue" :clearable="false" :options="projectOptions" />
  </BaseUpdatableField>
</template>
