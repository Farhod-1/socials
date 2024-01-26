import { computed } from 'vue'

interface Locale {
  name: string
  code: string
}

export const locales = [
  { name: 'Oʻzbekcha', code: 'uz' },
  { name: 'Ўзбекча', code: 'uz-cyrl' },
  { name: 'Русский', code: 'ru' },
  { name: 'English', code: 'en' },
  { name: 'Arabic', code: 'ar' }
] as Locale[]

export const localeOptions = computed(() => {
  return locales.map((el) => ({
    value: el.code,
    name: el.name,
    id: el.code
  }))
})

export const localeCodes = computed(() => {
  return locales.map((el) => el.code)
})
