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
import IconBellMuted from '@/assets/icon/IconBellMuted.vue'
import IconBellUnmuted from '@/assets/icon/IconBellUnmuted.vue'
import IconDark from '@/assets/icon/IconDark.vue'
import IconLight from '@/assets/icon/IconLight.vue'
import IconLogout from '@/assets/icon/IconLogout.vue'
import IconSettings from '@/assets/icon/IconSettings.vue'
import IconStatus from '@/assets/icon/IconStatus.vue'
import NavbarUserCard from '@/components/Navbar/NavbarUserCard.vue'
import { ToastType, useToast } from '@/components/Toast/ToastPlugin'
import { getEmployeePhoto, logOut } from '@/helpers'
import { useContextMenu } from '@/modules/contextmenu'
import { isMuted, toggleMute } from '@/modules/sound-controller'
import { EmployeeStatus } from '@/service/http/api/employees'
import { type IGetMeResponse, updateUserStatusQuery } from '@/service/http/api/user'
import { useDark } from '@vueuse/core'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const toast = useToast()
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

async function changeStatus(employeeStatus: EmployeeStatus) {
  updateMutation(
    {
      status: employeeStatus,
      userId: props.user._id
    },
    {
      onSuccess: () => {
        toast.open({
          type: ToastType.SUCCESS,
          message: t('toast.updated.success'),
          timer: 500
        })
      },

      onError: (error) => {
        toast.open({
          type: ToastType.ERROR,
          message: `Xatolik yuz berdi: ${error}`,
          timer: 500
        })
      }
    }
  )
}

const userStatuses = computed(() => [
  {
    title: t('employee-status.on_site'),
    value: EmployeeStatus.OnSite
  },
  {
    title: t('employee-status.on_vacation'),
    value: EmployeeStatus.Vacation
  },
  {
    title: t('employee-status.on_sick_leave'),
    value: EmployeeStatus.SickLeave
  },
  {
    title: t('employee-status.lunch_break'),
    value: EmployeeStatus.LunchBreak
  }
])

const { showContextMenu } = useContextMenu()

function showMenu(event: PointerEvent) {
  showContextMenu({
    anchor: anchor,
    event,
    items: [
      // <!-- Change Status -->
      {
        icon: IconStatus,
        title: t('status'),
        submenu: userStatuses.value.map((status) => ({
          title: status.title,
          action: () => changeStatus(status.value)
        }))
      },
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
        icon: isMuted.value ? IconBellUnmuted : IconBellMuted,
        title: t('sound.title'),
        submenu: [
          {
            icon: IconBellUnmuted,
            title: t('sound.unmute'),
            action: () => toggleMute()
          },
          {
            icon: IconBellMuted,
            title: t('sound.mute'),
            action: () => toggleMute()
          }
        ]
      },
      // <!-- Profile Settings -->
      {
        icon: IconSettings,
        title: t('settings.personal_settings'),
        action: () => {
          router.push({ name: 'settings.profile' })
        }
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
