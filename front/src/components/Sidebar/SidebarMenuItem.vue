<script lang="ts" setup>
import type { MenuItem } from '@/types'

defineProps<{
  item: MenuItem
}>()
</script>

<template>
  <li class="relative hover:text-primary py-2 menu-item">
    <router-link
      :to="item.link ?? '#'"
      class="flex items-center gap-2 dark:bg-dark-900 cursor-pointer justify-center flex-col"
      exact
    >
      <img
        v-if="typeof item.icon === 'string'"
        :src="item.icon"
        alt="icon"
        class="w-6 h-6 shrink-0"
      />

      <component :is="item.icon" v-else class="w-6 h-6 shrink-0" />

      <div
        class="mx-3 h-[25px] text-xs break-words text-center font-semibold flex items-center justify-center"
      >
        {{ item.title }}
      </div>
    </router-link>
  </li>
</template>
