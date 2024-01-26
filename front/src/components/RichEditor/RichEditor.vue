<script lang="ts" setup>
import type { PropType } from 'vue'
import { computed } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'

import '@vueup/vue-quill/dist/vue-quill.snow.css'
import '@vueup/vue-quill/dist/vue-quill.bubble.css'

const props = defineProps({
  content: {
    type: String
  },
  contentType: {
    type: String as PropType<'html' | 'text'>,
    default: 'html'
  },
  theme: {
    type: String as PropType<'snow'>,
    default: 'snow'
  }
})

const emit = defineEmits(['update:content'])

const localContent = computed({
  get() {
    return props.content
  },
  set(value) {
    emit('update:content', value)
  }
})
</script>

<template>
  <QuillEditor v-model:content="localContent" :contentType="contentType" :theme="theme" />
</template>

<style>
html.dark .ql-snow .ql-picker {
  color: #fff !important;
}

html.dark .ql-snow .ql-stroke {
  stroke: #fff !important;
}

html.dark .ql-snow .ql-picker-options {
  background: #0f172a !important;
}

html.dark .ql-snow.ql-toolbar button:hover,
.ql-snow .ql-toolbar button:hover,
.ql-snow.ql-toolbar button:focus,
.ql-snow .ql-toolbar button:focus,
.ql-snow.ql-toolbar .ql-picker-label:hover,
.ql-snow .ql-toolbar .ql-picker-label:hover,
.ql-snow.ql-toolbar .ql-picker-item:hover,
.ql-snow .ql-toolbar .ql-picker-item:hover {
  background: #0f172a !important;
  opacity: 0.4;
}
</style>