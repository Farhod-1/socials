<template>
  <div
    class="flex items-center gap-2 flex-row hover:bg-gray-100 hover:dark:bg-dark-700 py-2 px-4 group relative rounded cursor-pointer select-none max-w-[300px]"
    @click="handle(item.action)"
    @mouseenter="onHover"
  >
    <component :is="toRaw(item.icon)" v-if="item.icon" class="w-4 h-4 shrink-0" />

    <div class="flex-grow w-max" v-text="item.title" />
    <IconBack v-if="item.submenu" class="w-4 rotate-180 h-4" />

    <div
      v-if="item.submenu && openSubmenu"
      :style="{ zIndex: level ?? 99999 }"
      class="absolute top-1 left-[95%] rounded-lg p-1 bg-white dark:bg-dark-800 shadow-lg dark:shadow-dark-900"
      :class="reverse ? 'right-[95%] left-auto' : ''"
    >
      <ContextMenuItem
        v-for="(subItem, subIndex) in item.submenu"
        :key="subItem.title"
        :item="subItem"
        :level="(level ?? 99999) + 1"
        :reverse="reverse"
        :open-submenu="activeMenuIndex === subIndex"
        @hover="activeMenuIndex = subIndex"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { inject, ref, toRaw } from 'vue'
import type {
  ContextMenuAction,
  ContextMenuCreator,
  IContextMenuItem
} from '@/modules/contextmenu/types'
import { ContextMenuKey } from '@/modules/contextmenu/types'
import IconBack from '@/assets/icon/IconBack.vue'

interface ContextMenuCardProps {
  openSubmenu: boolean
  level?: number
  item: IContextMenuItem
  reverse: boolean
}

const props = defineProps<ContextMenuCardProps>()
const emit = defineEmits(['hover'])

function onHover() {
  emit('hover')
}

const SetMenu = inject(ContextMenuKey) as ContextMenuCreator

const activeMenuIndex = ref<string | number>(-1)

async function handle(action?: ContextMenuAction): Promise<void> {
  const result = action && (await action())

  if (result !== true) {
    SetMenu(undefined)
  }
}
</script>
