<template>
  <div class="w-[100vw] h-[100vh] relative flex items-stretch">
    <Sidebar />

    <div
      class="absolute flex gap-2 items-center justify-center top-0 h-[84px] w-[400px] px-4 py-0 ltr:right-0 rtl:left-0 z-20"
    >
      <SoftPhoneLayout v-if="!isLoading && sipDetails" :sip-user="sipDetails" class="relative" />

      <NavbarUserLayout v-if="isUserLoaded && user" :user="user" class="flex-grow" />

      <!-- Global Search -->
      <IconSearch class="w-7 h-7 cursor-pointer shrink-0" @click="showGlobalSearch" />
    </div>
    <router-view />
  </div>
</template>
<script lang="ts" setup>
import Sidebar from '@/components/Sidebar/Sidebar.vue'
import { refreshToken } from '@/service/http/api/auth'
import IconSearch from '@/assets/icon/IconSearch.vue'
import { useUser } from '@/service/modules/user/user'
import { useActiveElement, useMagicKeys, whenever } from '@vueuse/core'
import { logicAnd } from '@vueuse/math/index'
import useGlobalSearch from '@/layout/GlobalSearch/useGlobalSearch'
import { computed } from 'vue'
import NavbarUserLayout from '@/components/Navbar/NavbarUserLayout.vue'
import { getSipPhoneUserDetails } from '@/service/http/api/user'

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

whenever(logicAnd(Slash, notUsingInput), () => {
  showGlobalSearch()
})

function showGlobalSearch() {
  useGlobalSearch().open()
}

const { data: sipDetails, isLoading } = getSipPhoneUserDetails()
</script>
