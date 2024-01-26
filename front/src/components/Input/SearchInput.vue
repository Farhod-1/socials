<template>
  <div class="w-full relative">
    <IconSearch class="w-5 h-5 absolute top-2.5 left-2" />
    <input
      ref="inputRef"
      v-model="value"
      :placeholder="placeholder"
      class="base-input w-full h-full !block py-[6px] px-[35px]"
      type="text"
      @keydown="onInputKeydown"
    />
  </div>
</template>
<script lang="ts" setup>
import IconSearch from '@/assets/icon/IconSearch.vue'
import { computed, ref, watch } from 'vue'

const props = defineProps<{
  placeholder?: string
  searchValue?: string
  autoFocus?: boolean
}>()

const emit = defineEmits(['update:searchValue', 'keydown'])
const inputRef = ref<HTMLInputElement>()

const value = computed({
  get: () => props.searchValue,
  set: (value) => {
    emit('update:searchValue', value)
  }
})

function onInputKeydown(event: KeyboardEvent) {
  emit('keydown', event)
}

watch(
  () => props.autoFocus,
  (value) => {
    if (value) inputRef.value?.focus()
  }
)
</script>
