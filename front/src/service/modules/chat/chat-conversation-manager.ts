import http from '@/service/http'
import { saveChatItemDetails } from '@/service/modules/chat/chat-item-details'
import { saveLastMessageOfChat } from '@/service/modules/chat/last-message'
import {
  ChatTabType,
  type LocalTicketChat,
  type RemoteTicketChat
} from '@/service/modules/chat/types'
import { useUser } from '@/service/modules/user/user'
import { TicketStatus } from '@/views/Tickets/types'
import { type InfiniteData, useInfiniteQuery, useQueryClient } from '@tanstack/vue-query'
import { debouncedWatch } from '@vueuse/core'
import type { AxiosResponse } from 'axios'
import { computed, inject, provide, type Ref, ref, toValue } from 'vue'

interface IChatConversationManager {
  activeChatIndex: Ref<number>
  activeTab: Ref<ChatTabType>
  tabDirection: Ref<'asc' | 'desc'>
  chatList: Ref<InfiniteData<RemoteTicketChat[]> | undefined>
  fetchNextChatPage: ReturnType<typeof useInfiniteQuery>['fetchNextPage']
  isChatListLoading: ReturnType<typeof useInfiniteQuery>['isLoading']
  isChatFetchingNextPage: ReturnType<typeof useInfiniteQuery>['isFetchingNextPage']
  currentChats: Ref<LocalTicketChat[]>
  isSearching: Ref<boolean>
  searchText: Ref<string>
  isSearchLoading: Ref<boolean>

  triggerLoad: () => Promise<void>
}

interface FetchTicketListData {
  page: number
  sort?: {
    respondDate?: 1 | -1
    lastActivityAt?: 1 | -1
  }
  status?: TicketStatus[]
  filters: {
    key: 'operators'
    condition: '$in' | 'null'
    value: any[]
  }[]
}

const ChatConversationManagerSymbol = Symbol('ChatConversationManager')

async function searchQuery(text: string, page = 1) {
  return (
    await http.get<RemoteTicketChat[]>('/operator/tickets/search', {
      params: {
        search: text,
        page: page
      }
    })
  ).data
}

async function fetchTicketList(
  page: number,
  activeTab: ChatTabType,
  direction: 'asc' | 'desc' = 'asc',
  userId: string
) {
  let data: FetchTicketListData

  if (activeTab === ChatTabType.New) {
    data = {
      page: page,
      filters: [],
      sort: {
        respondDate: direction === 'asc' ? 1 : -1,
        lastActivityAt: direction === 'asc' ? -1 : 1
      },
      status: [TicketStatus.HasUpdate]
    }
  } else if (activeTab === ChatTabType.Mine) {
    data = {
      page: page,
      sort: {
        lastActivityAt: direction === 'asc' ? -1 : 1
      },
      filters: [
        {
          key: 'operators',
          condition: '$in',
          value: [userId]
        }
      ]
    }
  } else if (activeTab === ChatTabType.All) {
    data = {
      page: page,
      filters: [],
      sort: {
        lastActivityAt: direction === 'asc' ? -1 : 1
      }
    }
  } else {
    throw new Error('Function not implemented')
  }

  return (
    await http.post<RemoteTicketChat[], AxiosResponse<RemoteTicketChat[]>, FetchTicketListData>(
      '/operator/tickets-beta',
      data
    )
  ).data
}

export function provideChatConversationManager(): IChatConversationManager {
  const { id: userId } = useUser()

  const isSearching = ref(false)
  const searchText = ref('')

  const activeChatIndex = ref()
  const activeTab = ref<ChatTabType>(ChatTabType.New)
  const tabDirection = ref<'asc' | 'desc'>('asc')

  const queryClient = useQueryClient()

  // normal list
  const {
    data: chatList,
    fetchNextPage: fetchNextChatPage,
    isLoading: isChatListLoading,
    isFetchingNextPage: isChatFetchingNextPage
  } = useInfiniteQuery({
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    getNextPageParam: (lastPage: any, pages) => {
      if (lastPage.length === 0) {
        return undefined
      }

      return pages.length + 1
    },
    queryKey: ['chat-list', activeTab, tabDirection],
    queryFn: async (context) => {
      const chats = await fetchTicketList(
        context.pageParam,
        activeTab.value,
        tabDirection.value,
        toValue(userId)
      )

      chats.forEach((chat) => {
        saveLastMessageOfChat(queryClient, chat)
        saveChatItemDetails(queryClient, chat)
      })

      return chats
    }
  })

  // search query
  const {
    data: searchResult,
    fetchNextPage: fetchNextSearchPage,
    remove: removeSearchResult,
    isLoading: isSearchLoading,
    isFetchingNextPage: isSearchFetchingNextPage,
    isStale: isSearchStale
  } = useInfiniteQuery({
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: false,
    getNextPageParam: (lastPage: any, pages) => {
      if (lastPage.length === 0) {
        return undefined
      }

      return pages.length + 1
    },
    queryKey: ['search-tickets', searchText],
    queryFn: async (context) => {
      const chats = await searchQuery(searchText.value, context.pageParam)

      chats.forEach((chat) => {
        saveLastMessageOfChat(queryClient, chat)
        saveChatItemDetails(queryClient, chat)
      })

      return chats
    }
  })

  debouncedWatch(
    searchText,
    async (newText) => {
      removeSearchResult()

      if (newText.length > 0) await fetchNextSearchPage()
    },
    { debounce: 300 }
  )

  const currentChats = computed<LocalTicketChat[]>(() => {
    if (isSearching.value) {
      const pages = (searchResult.value?.pages ?? []) as LocalTicketChat[][]

      return (
        pages.reduce((acc, page) => {
          return [...acc, ...page]
        }, []) ?? []
      )
    } else {
      const pages = (chatList.value?.pages ?? []) as LocalTicketChat[][]
      return (
        pages.reduce((acc, page) => {
          return [...acc, ...page]
        }, []) ?? []
      )
    }
  })

  async function triggerLoad() {
    if (isSearching.value) {
      if (isSearchLoading.value || isSearchFetchingNextPage.value) {
        return
      }

      if (isSearchStale.value) await fetchNextSearchPage()
    } else {
      if (isChatListLoading.value || isChatFetchingNextPage.value) {
        return
      }

      await fetchNextChatPage()
    }
  }

  const module: IChatConversationManager = {
    activeChatIndex,
    activeTab,
    tabDirection,
    chatList,
    fetchNextChatPage,
    isChatListLoading,
    isChatFetchingNextPage,
    currentChats,

    isSearching,
    isSearchLoading,
    searchText,

    triggerLoad
  }

  provide<IChatConversationManager>(ChatConversationManagerSymbol, module)

  return module
}

export function useChatConversationManager(): IChatConversationManager {
  const chatConversationManager = inject<IChatConversationManager>(ChatConversationManagerSymbol)

  if (chatConversationManager == null) {
    throw new Error('useChatConversationManager() is called without provider.')
  }

  return chatConversationManager
}
