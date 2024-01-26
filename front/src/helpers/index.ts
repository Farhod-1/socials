import type { DateTimeFormatOptions } from 'luxon'
import { DateTime } from 'luxon'
import { useI18n } from 'vue-i18n'

export function formatAMPM(date: Date): string {
  let hours: number = date.getHours()
  let minutes: string | number = date.getMinutes()
  const ampm = hours >= 12 ? 'pm' : 'am'
  hours = hours % 12
  hours = hours ? hours : 12 // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes
  const strTime = hours + ':' + minutes + ' ' + ampm
  return strTime
}

export function formatDateToIsoString(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function logOut() {
  localStorage.removeItem('call24_auth_token')

  window.location.replace('/login')
}

export function makeFullPath(path: string | undefined) {
  return window.CALL24_CONFIG.STORAGE_URL + path
}

export const DEFAULT_AVATAR = '/img/user.png'

export function getEmployeePhoto(path: string | undefined) {
  return path ? makeFullPath(path) : DEFAULT_AVATAR
}

const photoExtensions = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp']

export function checkIsPhoto(ext: string = '') {
  return photoExtensions.includes(ext.toLowerCase())
}

const fileExtensions = ['pdf', 'doc', 'docx', 'txt', 'xls', 'xlsx', 'ppt', 'pptx']

export function checkIsFile(ext = '') {
  const fileExtension = ext.toLowerCase()
  return fileExtensions.includes(fileExtension)
}

const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm']

export function checkIsVideo(ext = '') {
  const fileExtension = ext.toLowerCase()
  return videoExtensions.includes(fileExtension)
}

const audioExtensions = ['mp3', 'wav', 'wma', 'ogg', 'aac', 'flac', 'oga']

export function checkIsAudio(ext = '') {
  const fileExtension = ext.toLowerCase()
  return audioExtensions.includes(fileExtension)
}

export function isOnlineByDate(date: Date) {
  const now = new Date()
  const diff = Math.abs(now.getTime() - date.getTime())
  const diffMinutes = Math.ceil(diff / (1000 * 60))
  return diffMinutes < 5
}

interface LanguageMap {
  [key: string]: string
}

const dateLocaleMapping: LanguageMap = {
  en: 'en-US',
  ru: 'ru-RU',
  uz: 'uz-Cyrl-UZ',
  'uz-cyrl': 'uz-Cyrl-UZ',
  ar: 'ar-AR'
}

export function getLocale() {
  const { locale } = useI18n()
  return dateLocaleMapping[locale.value] ?? 'uz-Cyrl-UZ'
}

export function formatDate(date: Date, format: DateTimeFormatOptions = DateTime.DATE_FULL) {
  if (date instanceof Date) {
    return DateTime.fromJSDate(date).toLocaleString(format, {
      locale: getLocale()
    })
  } else {
    return date
  }
}
