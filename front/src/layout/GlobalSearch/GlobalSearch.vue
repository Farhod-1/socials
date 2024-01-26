<template>
  <div class="w-[500px]">
    <div class="relative">
      <BaseInput
        v-model="searchInput"
        :placeholder="t('search')"
        auto-focus
        class="w-full focusMe"
        name="search"
        type="text"
        @keydown="onKeydown"
      />
      <IconSearch class="w-6 h-6 absolute top-3 right-3" />
    </div>

    <div class="mt-4 overflow-y-auto overflow-x-hidden h-[350px]">
      <div v-for="(route, index) in filteredRoutes" :key="route.title" ref="menuList">
        <router-link
          :class="[activeMenu === index ? 'bg-gray-200 dark:bg-dark-800' : '']"
          :to="route.link"
          class="flex items-center gap-2 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-dark-800"
          @click="onClose"
        >
          <component :is="route.icon" class="w-6 h-6" />
          <span>{{ route.title }}</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import IconAdd from '@/assets/icon/IconAdd.vue'
import IconChatBot from '@/assets/icon/IconChatBot.vue'
import IconChats from '@/assets/icon/IconChats.vue'
import IconChatsList from '@/assets/icon/IconChatsList.vue'
import IconClients from '@/assets/icon/IconClients.vue'
import IconFaq from '@/assets/icon/IconFaq.vue'
import IconProjects from '@/assets/icon/IconProjects.vue'
import IconReports from '@/assets/icon/IconReports.vue'
import IconSearch from '@/assets/icon/IconSearch.vue'
import IconSettings from '@/assets/icon/IconSettings.vue'
import IconStatistics from '@/assets/icon/IconStatistics.vue'
import IconTasks from '@/assets/icon/IconTasks.vue'
import BaseInput from '@/components/Input/Input.vue'
import router from '@/router'
import { useUser } from '@/service/modules/user/user'
import type { Component } from 'vue'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { isAdmin } = useUser()
const searchInput = ref('')
const menuList = ref<HTMLDivElement>()

interface GlobalSearchItem {
  title: string
  link: string
  icon: Component
}

const routes = computed<GlobalSearchItem[]>(() => {
  const menus = [
    {
      title: t('chats'),
      link: '/chats',
      icon: IconChats
    },
    {
      title: t('ticket.title'),
      link: '/tickets',
      icon: IconTasks
    },
    {
      title: t('faq'),
      link: '/operators-faq',
      icon: IconFaq
    },
    {
      title: t('clients'),
      link: '/clients',
      icon: IconClients
    },
    {
      title: t('chats_list'),
      link: '/chats-list',
      icon: IconChatsList
    },
    {
      title: t('chat_bot'),
      link: '/chat-bot',
      icon: IconChatBot
    },
    {
      title: t('add_project'),
      link: '/projects/create',
      icon: IconAdd
    }
  ]

  if (isAdmin) {
    menus.push({
      title: t('employees.title'),
      link: '/employees',
      icon: IconClients
    })
    menus.push({
      title: t('projects'),
      link: '/projects',
      icon: IconProjects
    })
    menus.push({
      title: t('reports.title'),
      link: '/reports',
      icon: IconReports
    })
    menus.push({
      title: t('sidebar.operator-stats'),
      link: '/statistics',
      icon: IconStatistics
    })
    menus.push({
      title: t('settings.title'),
      link: '/settings',
      icon: IconSettings
    })
  }

  return menus
})

const filteredRoutes = computed(() => {
  return routes.value.filter((route) => {
    return route.title.toLowerCase().includes(searchInput.value.toLowerCase())
  })
})

const props = defineProps<{
  onClose: () => void
}>()

const activeMenu = ref(0)

watch(searchInput, () => {
  activeMenu.value = 0
})

watch(activeMenu, (index) => {
  if (Array.isArray(menuList.value) && menuList.value.length > index) {
    menuList.value[index].scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'start'
    })
  }
})

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    activeMenu.value = Math.min(activeMenu.value + 1, filteredRoutes.value.length - 1)
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    activeMenu.value = Math.max(activeMenu.value - 1, 0)
  } else if (event.key === 'Enter') {
    event.preventDefault()

    const link = filteredRoutes.value[activeMenu.value].link

    if (link) {
      router.push(link)

      props.onClose()
    }
  }
}
</script>
