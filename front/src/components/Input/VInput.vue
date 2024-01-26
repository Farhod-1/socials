<script lang="ts" setup>
import { toRef } from 'vue'
import { useField } from 'vee-validate'
import Input from './Input.vue'

interface IInputProps {
  name: string
  type: string
  label?: string
  placeholder: string
  modelValue?: string | number
  textarea?: boolean
  disabled?: boolean
  required?: boolean
}

const props = defineProps<IInputProps>()

const name = toRef(props, 'name')

const {
  value: inputValue,
  errorMessage,
  meta
} = useField(name, undefined, {
  initialValue: props.modelValue
})
</script>

<template>
  <Input
    v-model="inputValue"
    :class="{ 'has-error': !!errorMessage, success: meta.valid && meta.dirty }"
    :error-message="errorMessage"
    :label="label"
    :name="name"
    :placeholder="placeholder"
    :textarea="textarea"
    :type="type"
    v-bind="$attrs"
    :required="required"
  />
</template>
