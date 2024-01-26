<script lang="ts" setup>
import VSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  options: {
    type: Object,
    default: () => ({}),
    required: true
  },
  label: {
    type: String,
    default: 'Select',
    required: true
  },
  valueName: {
    type: String
  },
  labelText: {
    type: String,
    default: ''
  },
  errorMessage: {
    type: String
  },
  modelValue: {}
})

function onUpdateValue(data: any) {
  if (Array.isArray(data)) {
    let values = data.map((el) => el[props.valueName || '_id'])
    emit('update:modelValue', values)
  } else {
    emit('update:modelValue', data?.value)
  }
}
</script>

<script lang="ts">
export default { name: 'BaseSelect' }
</script>

<template inheritsAttr="false">
  <div class="select__wrapper">
    <label v-if="labelText">{{ labelText }}</label>
    <v-select
      :class="{ error: !!errorMessage }"
      :label="label"
      :options="options"
      :value="modelValue"
      class="select__element"
      v-bind="$attrs"
      @update:modelValue="onUpdateValue"
    ></v-select>
    <p v-show="errorMessage" class="select__error">
      {{ errorMessage }}
    </p>
  </div>
</template>

<style>
.select__error {
  margin-top: 2px;
}
</style>