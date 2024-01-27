<template>
  <router-view />

  <ModalsContainer />
</template>

<script lang="ts" setup>
import { provideUserModule } from '@/service/modules/user/user'

import { onBeforeMount, watch } from 'vue'
import { ModalsContainer } from 'vue-final-modal'
import { useI18n } from 'vue-i18n'

onBeforeMount(() => {
  provideUserModule()
})

const { locale } = useI18n()

watch(
  locale,
  () => {
    localStorage.setItem('locale', locale.value)

    const html = document.getElementsByTagName('html')[0]
    html.setAttribute('dir', locale.value === 'ar' ? 'rtl' : 'ltr')
  },
  { immediate: true }
)
</script>

<style lang="scss">
@import '@/assets/styles/main.scss';
</style>
