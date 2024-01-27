<template>
  <div class="absolute top-4 right-4">
    <button @click="toggleDark()">
      <IconDark v-if="isDark" class="w-8 h-8" />
      <IconLight v-else class="w-8 h-8" />
    </button>
  </div>
  <div class="login">
    <div class="w-full flex items-center justify-center">
      <IconLogo class="w-[198px] text-center text-black dark:text-dark-200" />
    </div>
    <div class="login_card">
      <div class="text-lg">Login</div>
      <form :validation-schema="schema" style="padding: 0" @submit="onSubmit">
        <VInput
          :placeholder="t('username')"
          class="my-6"
          label="username"
          name="username"
          type="text"
        />
        <VInput
          :placeholder="t('password')"
          class="my-6"
          label="password"
          name="password"
          type="password"
        />
        <BaseButton :loading="isLoading" class="w-full" type="submit" variant="primary">
          {{ t('login') }}
        </BaseButton>
      </form>
      <div class="text-center mb-2 mt-4">
        {{ t('dont_have_account') }}
        <router-link class="text-blue-600" to="/register">
          {{ t('register') }}
        </router-link>
      </div>
      <div class="text-center text-sm opacity-80">
        {{ t('forgot_password') }}
        <router-link class="text-blue-600" to="/forgot-password">
          {{ t('reset') }}
        </router-link>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import IconDark from '@/assets/icon/IconDark.vue'
import IconLight from '@/assets/icon/IconLight.vue'
import IconLogo from '@/assets/icon/IconLogo.vue'
import BaseButton from '@/components/Button/Button.vue'
import { ToastType, useToast } from '@/components/Toast/ToastPlugin'
import { login } from '@/service/http/api/auth'
import { useUser } from '@/service/modules/user/user'
import type { LoginForm } from '@/types/login-form'
import { useDark, useToggle } from '@vueuse/core'
import { useForm } from 'vee-validate'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import * as Yup from 'yup'

const { setToken } = useUser()
const router = useRouter()
const toast = useToast()
const isDark = useDark()
const toggleDark = useToggle(isDark)

const { t } = useI18n()

const schema = Yup.object().shape({
  username: Yup.string().required(t('required_field')),
  password: Yup.string().required(t('required_field'))
})

const { handleSubmit } = useForm<LoginForm>({
  validationSchema: schema
})
const { isLoading, mutate: doLogin } = login()

const onSubmit = handleSubmit(async (values: LoginForm) => {
  doLogin(values, {
    onSuccess: (response) => {
      if (response.data.access_token) {
        setToken(response.data.access_token)

        return router.push('/')
      }
    },
    onError: (error: any) => {
      toast?.open({
        type: ToastType.ERROR,
        timer: 3000,
        message: error.response.data.message
      })
    }
  })
})
</script>
<style lang="scss" scoped>
html {
  background: #f0f0f0;
}

@import '../../assets/styles/base/variables';

.login {
  top: 50%;
  left: 50%;
  position: absolute;
  transform: translate(-50%, -50%);

  &_card {
    width: 360px;
    padding: 10px;

    &-btn {
      padding: 12px;
      outline: none;
      border: none;
      color: $white;
      background: $blue;
      border-radius: 4px;
      cursor: pointer;
    }

    &-form {
      gap: 15px;
      display: flex;
      flex-direction: column;

      input {
        padding: 12px 16px;
        border-radius: 4px;
        border: 1px solid #757575;

        &:focus {
          border-color: $blue;
          box-shadow: 0 0 2px $blue;
        }
      }
    }
  }
}
</style>
