<template>
  <div class="w-full flex items-center justify-items-start select-none">
    <label :for="idGenerator(label)" class="cursor-pointer justify-items-start flex items-center">
      <input
        :id="idGenerator(label)"
        v-model="inputValue"
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
import { toRef } from 'vue'
import { useField } from 'vee-validate'

interface IInputProps {
  name: string
  label: string
  modelValue?: boolean
}

const props = defineProps<IInputProps>()

const name = toRef(props, 'name')

const { value: inputValue, errorMessage } = useField(name)

function idGenerator(str: string) {
  return str.replace(/\s/g, '').toLocaleLowerCase()
}
</script>
