<template>
  <slot></slot>
</template>

<script lang="ts" setup>
export interface TabProps {
  title: string
  tabName?: string
  active?: boolean
}

defineProps<TabProps>()
</script>
