<script lang="ts" setup>
import IconBack from '@/assets/icon/IconBack.vue'
import IconDark from '@/assets/icon/IconDark.vue'
import IconLight from '@/assets/icon/IconLight.vue'
import IconLogo from '@/assets/icon/IconLogo.vue'
import BaseButton from '@/components/Button/Button.vue'
import VInput from '@/components/Input/VInput.vue'
import { ToastType, useToast } from '@/components/Toast/ToastPlugin'
import { sendEmailOtpForgotPassword } from '@/service/http/api/auth'
import type { ResetPasswordForm } from '@/types/register-form'
import SetNewPassword from '@/views/Auth/components/SetNewPassword.vue'
import { useDark, useToggle } from '@vueuse/core'
import { useForm } from 'vee-validate'
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import * as Yup from 'yup'

const toast = useToast()
const { t } = useI18n()

const isDark = useDark()
const toggleDark = useToggle(isDark)

const schema = Yup.object({
  login: Yup.string()
    .required(t('required_field'))
    .min(5, t('validation.string_field_too_short', { min: 5 }))
})

const form = reactive({
  login: '',
  hiddenEmail: ''
})

const firstStage = ref(true)
const secondStage = ref(false)
const { handleSubmit } = useForm<ResetPasswordForm>({
  validationSchema: schema
})

const { isLoading, mutate: doSendOTP } = sendEmailOtpForgotPassword()

const submit = handleSubmit(async (values: ResetPasswordForm) => {
  doSendOTP(values, {
    onSuccess: (response: any) => {
      form.hiddenEmail = response.email
      firstStage.value = false
      secondStage.value = true
    },
    onError: (err: any) => {
      if (typeof err.response.data.message === 'string') {
        toast?.open({
          type: ToastType.ERROR,
          timer: 3000,
          message: err.response.data.message
        })
      } else if (Array.isArray(err.response.data.message)) {
        const message = err.response.data.message.join(', ')

        toast?.open({
          type: ToastType.ERROR,
          timer: 3000,
          message: message
        })
      }
    }
  })
})

const backToFirstStage = () => {
  firstStage.value = true
  secondStage.value = false
}
</script>

<template>
  <div class="absolute top-4 right-4">
    <button @click="toggleDark()">
      <IconDark v-if="isDark" class="w-8 h-8" />
      <IconLight v-else class="w-8 h-8" />
    </button>
  </div>
  <IconBack
    v-if="secondStage"
    class="w-8 m-4 absolute hover:bg-gray-100 rounded-full hover:cursor-pointer dark:hover:bg-dark-700"
    @click.prevent="backToFirstStage"
  />
  <div class="register flex flex-col justify-center items-center h-screen forgot-password">
    <div v-if="firstStage" class="w-[300px]">
      <div class="flex w-full items-center justify-center">
        <IconLogo class="w-[198px] text-center text-black my-3 dark:text-dark-200" />
      </div>
      <div>
        <h1 class="my-2">
          {{ t('reset_password') }}
        </h1>
        <form :validation-schema="schema" class="p-0" @submit="submit">
          <VInput
            v-model="form.login"
            :placeholder="t('username_email')"
            class="my-6"
            label="Login"
            name="login"
            type="text"
          />
          <BaseButton :loading="isLoading" class="w-full" type="submit" variant="primary">
            {{ t('send_code') }}
          </BaseButton>
          <div class="my-2 flex justify-center">
            <router-link class="text-blue-600 mr-2" to="/login">
              {{ t('back_login') }}
            </router-link>
          </div>
        </form>
      </div>
    </div>
    <SetNewPassword
      v-if="secondStage"
      :hiddenEmail="form.hiddenEmail"
      :login="form.login"
      type="create"
    />
  </div>
</template>
