<template>
  <div
    class="rounded-md w-96 px-8 flex items-center shadow-lg justify-center dark:bg-dark-700 forgot-pass"
  >
    <form :validation-schema="schema" class="w-[500px] form_input" @submit="onSubmit">
      <div class="flex w-full items-center justify-center my-4">
        <IconLogo class="w-[198px] text-center text-black dark:text-dark-200" />
      </div>

      <div class="px-6 py-3 flex flex-col gap-4 items-center justify-center">
        <div class="font-bold text-xs text-center dark:text-white">
          ⚠️{{ t('we_have_sent_code') }}
          {{ props.hiddenEmail }}
        </div>
        <div class="font-bold text-xl">
          {{ t('enter_confirmation_code') }}
        </div>
        <OTPInput
          v-model="password.code"
          label="Password"
          name="password"
          required
          type="password"
        />
        <div class="font-bold text-xl">
          {{ t('enter_new_password') }}
        </div>
        <VInput
          v-model="email"
          :disabled="email !== ''"
          :placeholder="t('enter_your_email')"
          class="mb-4"
          label="Email"
          name="email"
          required
          type="email"
        />
        <VInput
          :placeholder="t('password')"
          class="mb-4"
          label="Password"
          name="password"
          type="password"
        />
        <VInput
          :label="t('confirm_password')"
          :placeholder="t('confirm_password')"
          class="mb-4"
          name="confirm_password"
          type="password"
        />
      </div>

      <div class="border-t border-t-gray-200 flex justify-end p-3">
        <BaseButton :loading="isLoading" type="submit" variant="primary">
          {{ t('submit') }}
        </BaseButton>
      </div>
    </form>
  </div>
</template>
<script lang="ts" setup>
import IconLogo from '@/assets/icon/IconLogo.vue'
import VInput from '@/components/Input/VInput.vue'
import { ToastType, useToast } from '@/components/Toast/ToastPlugin'
import { setNewPassword } from '@/service/http/api/auth'
import type { SetNewPasswordForm } from '@/types/register-form'
import OTPInput from '@/views/Auth/components/OTPInput.vue'
import { useForm } from 'vee-validate'
import { computed, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import * as Yup from 'yup'

const toast = useToast()
const router = useRouter()

interface IModalProps {
  type: string
  hiddenEmail: string
  login: string
}

const email = computed(() => {
  if (props.login.includes('@')) {
    return props.login
  }
  return ''
})

const props = defineProps<IModalProps>()
const { t } = useI18n()

const schema = Yup.object().shape({
  email: Yup.string().when([], {
    is: () => props.type === 'create',
    then: Yup.string().email(t('validation.invalid_email')).required(t('required_field'))
  }),
  password: Yup.string().when([], {
    is: () => props.type === 'create',
    then: Yup.string()
      .min(4, t('validation.string_field_too_short', { min: 4 }))
      .required(t('required_field'))
  }),
  confirm_password: Yup.string().when([], {
    is: () => props.type === 'create',
    then: Yup.string()
      .oneOf([Yup.ref('password'), null], t('validation.password_must_match'))
      .required(t('required_field'))
  })
})

const { handleSubmit } = useForm<SetNewPasswordForm>({
  validationSchema: schema
})

const { isLoading, mutate: setPassword } = setNewPassword()

const onSubmit = handleSubmit(async (values: SetNewPasswordForm) => {
  setPassword(
    {
      email: values.email,
      password: values.password,
      confirmationCode: Number(password.code)
    },
    {
      onSuccess: () => {
        return router.push('/login')
      },
      onError: (err: any) => {
        if (typeof err.response.data.message === 'string') {
          toast.open({
            type: ToastType.ERROR,
            timer: 3000,
            message: err.response.data.message
          })
        } else if (Array.isArray(err.response.data.message)) {
          const message = err.response.data.message.join(', ')

          toast.open({
            type: ToastType.ERROR,
            timer: 3000,
            message: message
          })
        }
      }
    }
  )
})
const password = reactive({
  code: ''
})
</script>

<style scoped>
@media (max-width: 768px) {
  .form_input {
    width: 100%;
  }

  .forgot-pass {
    width: 350px;
    padding: 0;
  }
}
</style>
