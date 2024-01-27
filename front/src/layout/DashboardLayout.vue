<template>
  <div class="w-[100vw] h-[100vh] relative flex items-stretch">
    <Sidebar />

    <div
      class="absolute flex gap-2 items-center justify-center top-0 h-[84px] w-[400px] px-4 py-0 ltr:right-0 rtl:left-0 z-20"
    >

      <NavbarUserLayout v-if="isUserLoaded && user" :user="user" class="flex-grow" />

    </div>
    <router-view />
  </div>
</template>
<script lang="ts" setup>
import Sidebar from '@/components/Sidebar/Sidebar.vue'
import { refreshToken } from '@/service/http/api/auth'
import { useUser } from '@/service/modules/user/user'
import { useActiveElement, useMagicKeys } from '@vueuse/core'

import { computed } from 'vue'
import NavbarUserLayout from '@/components/Navbar/NavbarUserLayout.vue'

const { mutate: handleRefreshToken } = refreshToken()

const { user, isLoaded: isUserLoaded } = useUser()

if (!localStorage.getItem('call24_auth_token_refreshed')) {
  const oldToken = localStorage.getItem('call24_auth_token') || ''
  handleRefreshToken(oldToken, {
    onSuccess: ({ data }) => {
      localStorage.setItem('call24_auth_token', data.token)
      localStorage.setItem('call24_auth_token_refreshed', 'true')
    },
    onError: (error) => {
      console.log(error)
    }
  })
}

const activeElement = useActiveElement()
const notUsingInput = computed(
  () => activeElement.value?.tagName !== 'INPUT' && activeElement.value?.tagName !== 'TEXTAREA'
)

const { Slash } = useMagicKeys({
  passive: false,
  onEventFired: (event) => {
    if (event.code === 'Slash' && notUsingInput.value) {
      event.preventDefault()
    }
  }
})



</script>
