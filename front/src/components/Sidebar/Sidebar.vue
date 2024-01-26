<template>
  <div
    class="dark:bg-dark-900 w-[90px] h-[100vh] flex flex-col bg-white border-r border-[#E5E5E5] dark:border-dark-700"
  >
    <div class="flex items-center justify-center h-[60px]">
      <img :src="SidebarLogo" alt="logo" class="w-[40px] h-[40px]" />
    </div>

    <ul class="h-[80vh] overflow-y-auto overflow-x-hidden sidebar flex-grow group/sidebar pt-4">
      <SidebarMenuItem v-for="item of menu" :key="item.title" :item="item" class="mb-1" />
    </ul>
  </div>
</template>
<script lang="ts" setup>
import IconTasks from '@/assets/icon/IconTasks.vue'
import SidebarLogo from '@/components/Sidebar/SidebarLogo.png'
import SidebarMenuItem from '@/components/Sidebar/SidebarMenuItem.vue'
import { useUser } from '@/service/modules/user/user'
import type { MenuItem } from '@/types'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const { isAdmin } = useUser()

const menu = computed<MenuItem[]>(() => {
  const menus = [
    {
      title: t('ticket.title'),
      link: '/tickets',
      icon: IconTasks
    }
  ]

  if (isAdmin) {
  }

  return menus
})
</script>
