import { DateTime, Duration } from 'luxon'
import { useI18n } from 'vue-i18n'

function FromUniversal(date: string | Date) {
  return date instanceof Date ? DateTime.fromJSDate(date) : DateTime.fromISO(date)
}

function isToday(date: DateTime): boolean {
  return date.toISODate() === DateTime.local().toISODate()
}

export function SinceData(date?: string | Date): Duration {
  if (date) {
    const dateTime = FromUniversal(date)

    return DateTime.now().diff(dateTime)
  } else {
    return Duration.fromMillis(0)
  }
}

export function ToShortMonthNameDateTime(date: string | Date | undefined): string {
  if (date) {
    const { locale } = useI18n()

    return FromUniversal(date).toFormat('dd LLL HH:mm', {
      locale: locale.value == 'uz' ? 'uz-cyrl' : locale.value
    })
  } else {
    return ''
  }
}

export function ToLongMonthNameDateTime(date: string | Date): string {
  const { locale } = useI18n()

  if (date) {
    return FromUniversal(date).toFormat('dd LLLL HH:mm', {
      locale: locale.value == 'uz' ? 'uz-cyrl' : locale.value
    })
  } else {
    return ''
  }
}

export enum DateFormats {
  FullDate = 'dd.MM.yyyy HH:mm'
}

export function ToDateFormat(date: string | Date | undefined, format: DateFormats): string {
  const { locale } = useI18n()

  if (date) {
    return FromUniversal(date).toFormat(format, {
      locale: locale.value == 'uz' ? 'uz-cyrl' : locale.value
    })
  } else {
    return ''
  }
}

export function HHMM(date: string | Date): string {
  if (date) {
    return FromUniversal(date).toFormat('HH:mm', { locale: 'uz' })
  } else {
    return ''
  }
}

export function sortDate(a: Date, b: Date) {
  return a > b ? 1 : a < b ? -1 : 0
}

export function sortDateDesc(a: Date, b: Date) {
  return sortDate(a, b) * -1
}
