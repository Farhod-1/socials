<template>
  <div ref="anchor">
    <NavbarUserCard
      :img="userPhoto"
      :name="userName"
      :position="userRole"
      :status="status"
      class="cursor-pointer dark:hover:bg-dark-800 hover:bg-gray-200 rounded select-none"
      is-online
      @click="showMenu"
    />
  </div>
</template>

<script lang="ts" setup>

import IconDark from '@/assets/icon/IconDark.vue'
import IconLight from '@/assets/icon/IconLight.vue'
import IconLogout from '@/assets/icon/IconLogout.vue'

import NavbarUserCard from '@/components/Navbar/NavbarUserCard.vue'
import { getEmployeePhoto, logOut } from '@/helpers'
import { useContextMenu } from '@/modules/contextmenu'
import { type IGetMeResponse, updateUserStatusQuery } from '@/service/http/api/user'
import { useDark } from '@vueuse/core'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const router = useRouter()

const anchor = ref<HTMLElement>()

const props = defineProps<{
  user: IGetMeResponse
}>()

const userName = computed(() => props.user.username)
const status = computed(() => props.user.status)
const userPhoto = computed(() => getEmployeePhoto(props.user.photoPath))
const userRole = computed(() => props.user.roles.join(', '))

const isDark = useDark()

const { mutate: updateMutation } = updateUserStatusQuery()



const { showContextMenu } = useContextMenu()

function showMenu(event: PointerEvent) {
  showContextMenu({
    anchor: anchor,
    event,
    items: [

      {
        icon: isDark.value ? IconDark : IconLight,
        title: t('appearance.title'),
        submenu: [
          {
            icon: IconLight,
            title: t('appearance.light'),
            action: () => (isDark.value = false)
          },
          {
            icon: IconDark,
            title: t('appearance.dark'),
            action: () => (isDark.value = true)
          }
        ]
      },
      {
        icon: IconLogout,
        title: t('logout'),
        action: () => logOut()
      }
    ]
  })
}
</script>
