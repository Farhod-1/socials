<script lang="ts" setup>
import IconClose from '@/assets/icon/IconClose.vue'
import IconSearch from '@/assets/icon/IconSearch.vue'
import BaseInput from '@/components/Input/Input.vue'
import { ws } from '@/modules/socket'
import { ticketCount } from '@/service/http/api/chat'
import { useChatConversationManager } from '@/service/modules/chat/chat-conversation-manager'

import { ChatTabType } from '@/service/modules/chat/types'
import { computed, onUnmounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const { activeTab } = useChatConversationManager()

const props = defineProps<{
  search: string
  isSearching?: boolean
  sorting?: 'asc' | 'desc'
}>()

const emit = defineEmits(['update:search', 'update:isSearching', 'update:sorting'])

const localSearch = computed({
  get() {
    return props.search
  },
  set(value) {
    emit('update:search', value)
  }
})

const localIsSearching = computed({
  get() {
    return props.isSearching
  },
  set(value) {
    emit('update:isSearching', value)
  }
})

const localSorting = computed({
  get() {
    return props.sorting ?? 'asc'
  },
  set(value) {
    emit('update:sorting', value)
  }
})

const tabs = [
  { title: 'new', value: ChatTabType.New },
  { title: 'mine', value: ChatTabType.Mine },
  { title: 'all', value: ChatTabType.All }
]

function changeTab(val: ChatTabType) {
  if (val === activeTab.value) {
    localSorting.value = localSorting.value === 'asc' ? 'desc' : 'asc'
  } else {
    localSorting.value = 'asc'
  }

  activeTab.value = val
}

const { data: ticketsCount, refetch: refetchTicketsCount } = ticketCount()

const newChatsCount = computed(() => {
  return ticketsCount.value?.newTickets ?? 0
})

ws.onEvent('ticket.created', refetchTicketsCount)
ws.onEvent('ticket.details-updated', refetchTicketsCount)
document.addEventListener('keydown', closeSearch)

onUnmounted(() => {
  ws.removeEvent('ticket.created', refetchTicketsCount)
  ws.removeEvent('ticket.details-updated', refetchTicketsCount)
  document.removeEventListener('keydown', closeSearch)
})

function closeSearch(ev: KeyboardEvent) {
  if (ev.key === 'Escape') {
    if (localIsSearching.value) {
      localIsSearching.value = false

      ev.preventDefault()
      ev.stopPropagation()
    }
  }
}

const searchRef = ref()

watch(localIsSearching, (value) => {
  if (value) {
    setTimeout(() => {
      searchRef.value?.focus()
    }, 50)
  } else {
    localSearch.value = ''
  }
})
</script>

<template>
  <div class="flex items-center select-none border-b dark:border-dark-700">
    <div v-show="localIsSearching" class="flex-grow flex items-center gap-2 h-[84px] px-2">
      <BaseInput
        ref="searchRef"
        v-model="localSearch"
        :placeholder="t('search_messages')"
        autofocus
        class="dark:hover:text-dark-200"
      />
      <IconClose class="cursor-pointer" @click="localIsSearching = false" />
    </div>
    <div v-show="!localIsSearching" class="flex px-2 items-center gap-2 flex-grow h-[84px]">
      <div
        v-for="tab of tabs"
        :key="tab.value"
        :class="{
          'text-primary': activeTab === tab.value
        }"
        class="items-center justify-center flex text-sm font-semibold select-none gap-1 cursor-pointer h-full relative px-2 flex-grow"
        @click="changeTab(tab.value)"
      >
        <span v-text="t(tab.title)" />
        <span
          v-if="tab.value === 'new' && newChatsCount > 0"
          class="bg-red-500 text-white rounded-full px-2 text-center"
          v-text="newChatsCount"
        />

        <div v-if="tab.value === activeTab">
          {{ localSorting === 'asc' ? '▲' : '▼' }}
        </div>

        <div
          v-if="activeTab === tab.value"
          class="absolute left-0 bottom-0 w-full h-1 rounded-t-lg bg-primary"
        ></div>
      </div>

      <div class="p-2 flex-shrink-0 cursor-pointer" @click="localIsSearching = true">
        <IconSearch />
      </div>
    </div>
  </div>
</template>
