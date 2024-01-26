<template>
  <div class="flex flex-col">
    <nav
      :class="[sticky ? 'sticky top-28 z-[100]' : '']"
      class="flex w-full border-b-gray-300 dark:border-b-dark-900 bg-gray-100 dark:bg-dark-800 border-b-[3px] flex-wrap rounded-lg"
    >
      <component
        :is="tab.component.type === Tab ? TabButton : tab.component"
        v-for="(tab, index) in tabs"
        :key="index"
        :class="{ 'dark:text-primary': activeTab === index }"
        v-bind="
          tab.component.type === Tab
            ? {
                title: tab.title,
                active: activeTab === index
              }
            : undefined
        "
        v-on="{ click: tab.component.type === Tab ? () => (activeTab = index) : undefined }"
      >
        <template v-for="(fn, slotName) in tab.slots" :key="slotName" v-slot:[slotName]>
          <component :is="fn" />
        </template>
      </component>
    </nav>

    <div v-if="keepAlive" class="flex-grow">
      <KeepAlive>
        <component :is="selectedTab.component" :key="selectedTab.title" />
      </KeepAlive>
    </div>

    <div v-else class="flex-grow">
      <component :is="selectedTab.component" :key="selectedTab.title" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { type ComponentOptions, computed, ref, useSlots, watch } from 'vue'
import type { TabProps } from './Tab.vue'
import Tab from './Tab.vue'
import TabButton from './TabButton.vue'

interface ITab {
  title: string
  tabName?: string
  component: ComponentOptions<TabProps>
  slots: Record<string, any>
}

const props = defineProps<{
  sticky?: boolean
  tab?: string
  keepAlive?: boolean
}>()

const emit = defineEmits(['update:tab'])

const slots = useSlots()

const tabs = computed<ITab[]>(() => {
  const components: ComponentOptions<TabProps>[] = slots.default?.() ?? []

  return components.map((component) => {
    return {
      title: component.props?.title ?? Date.now(),
      tabName: component.props?.['tab-name'],
      component,
      slots: Object.entries(component.children)
        .filter(([slotName]) => slotName !== 'default' && slotName !== '_')
        .reduce((acc, [slotName, fn]) => {
          acc[slotName] = fn

          return acc
        }, {} as Record<string, any>)
    }
  })
})

function restoreActiveTab() {
  if (props.tab) {
    let index = tabs.value.findIndex((t) => t.tabName === props.tab)
    if (index >= 0) return index
  }

  return 0
}

const localTab = ref(restoreActiveTab())

const selectedTab = computed(() => {
  return tabs.value[activeTab.value]
})

const activeTab = computed({
  get() {
    return localTab.value
  },

  set(value: number) {
    emit('update:tab', tabs.value[value].tabName ?? undefined)

    localTab.value = value
  }
})

watch(
  () => props.tab,
  (value) => {
    if (value) {
      let index = tabs.value.findIndex((t) => t.tabName === value)
      if (index >= 0) activeTab.value = index
    }
  }
)
</script>