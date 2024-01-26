<template>
  <Highlightjs :code="jsCode" class="code-instructions" language="html" />
</template>

<style>
.code-instructions {
  font-size: 12px;
  font-family: monospace;
}

.code-instructions .hljs {
  font-family: monospace !important;
}

pre.code-instructions code.hljs {
  border-radius: 8px !important;
  padding: 5px !important;
}
</style>

<script lang="ts" setup>
import 'highlight.js/lib/common'
import 'highlight.js/styles/github-dark.css'
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import hljsVuePlugin from '@highlightjs/vue-plugin'
import { computed } from 'vue'
import ConnectScriptGenerator from '@/components/Project/ConnectScriptGenerator'

const Highlightjs = hljsVuePlugin.component

hljs.registerLanguage('javascript', javascript)

const props = defineProps({
  token: { type: String, required: true }
})

const jsCode = computed(() => ConnectScriptGenerator(props.token))
</script>
