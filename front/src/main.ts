import { createApp } from 'vue'
import setupLocatorUI from '@locator/runtime'

import '@/assets/styles/app.css'

import App from './App.vue'
import router from './router'
import ToastPlugin from './components/Toast/ToastPlugin'
import socket from '@/modules/socket'
import contextmenu from '@/modules/contextmenu'
import globalComponents from '@/components/GlobalComponents'
import BaseInput from '@/components/Input/Input.vue'
import VInput from '@/components/Input/VInput.vue'
import BaseButton from '@/components/Button/Button.vue'
import BaseCheckbox from '@/components/Checkbox/Checkbox.vue'
import Loader from '@/components/Loader/Loader.vue'

import { i18n } from '@/service/locale'

import { VueQueryPlugin } from '@tanstack/vue-query'
import { createVfm } from 'vue-final-modal'

if (import.meta.env.NODE_ENV === 'development') {
  setupLocatorUI({
    adapter: 'vue'
  })
}

const app = createApp(App)

globalComponents.forEach((component) => app.component(component.name, component))

app.component('BaseInput', BaseInput)
app.component('VInput', VInput)
app.component('BaseButton', BaseButton)
app.component('BaseCheckbox', BaseCheckbox)
app.component('Loader', Loader)

app
  .use(router)
  .use(ToastPlugin)
  .use(i18n)
  .use(socket)
  .use(contextmenu)
  .use(VueQueryPlugin)
  .use(createVfm())
  .mount('#app')
