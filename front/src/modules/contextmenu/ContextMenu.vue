<template>
  <div
    v-show="!menu.hide"
    ref="menuEl"
    class="fixed left-0 top-0 dark:bg-dark-800 bg-white shadow-xl rounded-md min-w-[160px] p-1 group z-[1001] text-sm"
  >
    <div v-if="menu.title" class="p-3 font-bold" v-html="menu.title" />

    <ContextMenuItem
      v-for="(item, index) in items"
      :key="item.title"
      :item="item"
      :open-submenu="activeMenuIndex === index"
      :reverse="reverse"
      @hover="activeMenuIndex = index"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, nextTick, onMounted, ref, watch } from 'vue'
import type { ContextMenuCreator, ContextMenuProps } from './types'
import { ContextMenuKey } from './types'
import ContextMenuItem from '@/modules/contextmenu/ContextMenuItem.vue'

const activeMenuIndex = ref<string | number>(-1)

const SetMenu = inject(ContextMenuKey) as ContextMenuCreator
const props = defineProps<{ menu: ContextMenuProps }>()
const menuEl = ref<HTMLDivElement>()
const reverse = ref(false)

const displayOffset = 100

const items = computed(() => {
  return props.menu.items
})

watch(
  () => props.menu.event,
  () => {
    activeMenuIndex.value = -1

    nextTick(() => {
      if (props.menu.event && menuEl.value) {
        let top
        let left

        if (props.menu.anchor) {
          const rect = props.menu.anchor.getBoundingClientRect()

          top = rect.top + rect.height
          left = rect.left
        } else {
          top = props.menu.event.clientY
          left = props.menu.event.clientX
        }

        const nearBottom = top + displayOffset + menuEl.value.clientHeight > window.innerHeight
        const nearRight = left + displayOffset + menuEl.value.clientWidth > window.innerWidth

        reverse.value = nearRight

        if (nearBottom) {
          menuEl.value.style.top = top - menuEl.value.clientHeight + 'px'
        } else {
          menuEl.value.style.top = top + 'px'
        }

        menuEl.value.style.left = left + 'px'
      }
    })
  }
)

function onEscape(event: KeyboardEvent) {
  if (!props.menu.hide && event.key === 'Escape') {
    SetMenu(undefined)

    event.stopPropagation()
    event.preventDefault()

    return
  }
}

onMounted(() => {
  document.addEventListener('click', ({ target }) => {
    if (props.menu.hide) return

    const el = target as HTMLDivElement

    if (el && !el.closest('.contextmenu')) {
      SetMenu(undefined)
    }
  })

  document.addEventListener('keydown', onEscape)

  return () => {
    document.removeEventListener('keydown', onEscape)
  }
})
</script>
