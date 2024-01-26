<template>
  <div
    :class="[collapsed ? 'w-0 min-w-0' : 'min-w-[350px] w-[350px]']"
    class="h-full overflow-hidden flex flex-col relative border-r dark:border-dark-700 transition-all ease-in-out duration-700"
  >
    <ConversationTabs
      v-model:is-searching="isSearching"
      v-model:search="searchText"
      v-model:sorting="tabDirection"
    />

    <ScrollContainer :trigger-load="triggerLoad" class="flex-grow">
      <div ref="listContainer">
        <ChatItem
          v-for="item in currentChats"
          :key="item.chatId"
          :class="{ active: isChatOpen(item._id) }"
          :duration="activeTab === 'new'"
          :item="item"
          @click="openChat(item._id)"
        />

        <div v-if="isChatFetchingNextPage" class="w-full flex items-center justify-center py-6">
          <SpinnerIcon class="h-12 w-12" />
        </div>
      </div>

      <template #empty>
        <div
          v-if="searchText.length > 0 && isSearchLoading"
          class="full h-full flex flex-col items-center justify-center text-sm"
        >
          <SpinnerIcon class="h-12 w-12" />
        </div>

        <div
          v-else-if="currentChats.length === 0"
          class="full h-full flex flex-col items-center justify-center text-gray-500"
        >
          <MessageIcon class="h-24 w-24" />
          <br />
          <span>{{ t('no_data') }}</span>
        </div>
      </template>
    </ScrollContainer>

    <div class="flex-shrink-0 p-2 text-center text-sm opacity-70">
      {{ t('chats_count', { val: currentChats.length }) }}
    </div>
  </div>
  <div
    :class="[collapsed ? '-left-[14px]' : 'left-[340px]']"
    class="absolute py-6 hover:cursor-pointer top-1/2 dark:bg-primary w-[20px] z-10 h-16 bg-gray-200 rounded-2xl flex flex-col items-center transition-all ease-in-out duration-700"
    @click="toggleCollapse"
  >
    <IconShrinkExpand
      :class="[collapsed ? 'rotate-180' : 'rotate-0']"
      class="text-black dark:text-dark-200 hover:opacity-90 transition-all duration-500"
    />
  </div>
</template>
<script lang="ts" setup>
import IconShrinkExpand from '@/assets/icon/IconShrinkExpand.vue'
import MessageIcon from '@/assets/icon/MessageIcon.vue'
import SpinnerIcon from '@/assets/icon/SpinnerIcon.vue'
import ChatItem from '@/components/Chatting/ChatItem.vue'
import ScrollContainer from '@/components/Container/ScrollContainer.vue'
import ConversationTabs from '@/components/Conversations/ConversationTabs.vue'
import Loader from '@/components/Loader/Loader.vue'
import { useChatting } from '@/service/modules/chat/chat'
import { useChatConversationManager } from '@/service/modules/chat/chat-conversation-manager'
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const { open: openChat, isOpen: isChatOpen } = useChatting()

const {
  activeTab,
  tabDirection,
  triggerLoad,
  currentChats,
  isSearching,
  searchText,
  isSearchLoading,
  isChatFetchingNextPage
} = useChatConversationManager()

const { activeChatIndex } = useChatConversationManager()
const listContainer = ref<HTMLDivElement>()

const collapsed = ref(false)

function toggleCollapse() {
  collapsed.value = !collapsed.value
}

watch(activeChatIndex, (value) => {
  if (listContainer.value) {
    const activeElement = listContainer.value.children[value] as HTMLDivElement

    activeElement?.scrollIntoView({
      block: 'center',
      behavior: 'smooth'
    })
  }
})
</script>
