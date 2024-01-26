import { createI18n } from 'vue-i18n'

import uz from '@/assets/locales/uz.json'
import en from '@/assets/locales/en.json'

import { setLocale } from 'yup'

setLocale({
  // use constant translation keys for messages without values
  mixed: {
    default: 'validation.field_invalid',
    required: 'validation.field_required'
  },
  // use functions to generate an error object that includes the value from the schema
  number: {
    min: ({ min }) => ({ key: 'validation.field_too_short', values: { min } }),
    max: ({ max }) => ({ key: 'validation.field_too_big', values: { max } })
  },

  string: {
    min: ({ min }) => ({
      key: 'validation.string_field_too_short',
      values: { min }
    }),
    max: ({ max }) => ({
      key: 'validation.string_field_too_big',
      values: { max }
    })
  }
})

const availableLocales = ['uz', 'uz-cyrl', 'ru', 'en', 'ar']

function getDefaultLocale(): string {
  // Get locale from navigator
  const locale = localStorage.getItem('locale') ?? navigator.language.split('-')[0]

  if (availableLocales.includes(locale)) {
    return locale
  } else {
    return 'uz'
  }
}

export const i18n = createI18n({
  legacy: false,
  locale: getDefaultLocale(),

  // Refer a global scope Composer instance of i18n
  globalInjection: true,

  messages: {
    uz,
    en
  }
})
