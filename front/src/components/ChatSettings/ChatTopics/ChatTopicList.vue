<template>
  <ul>
    <li class="list-disc ml-4">{{ node.name.default }}</li>

    <li v-for="nodeChild in node.children" :key="nodeChild._id" class="pl-4">
      <ChatTopicList :node="nodeChild" v-bind="$attrs" />
    </li>
  </ul>
</template>

<script lang="ts" setup>
import type { IChatTopicNested } from '@/views/Projects/types'

defineProps({
  node: {
    type: Object as () => IChatTopicNested,
    required: true
  }
})
</script>
