export interface User {
  name: string
}

export interface ITranslatableField {
  default: string
  en?: string
  ru?: string
  uz?: string
  ar?: string
}

export interface MenuItem {
  title: string
  link?: string
  handler?: any
  icon: any
}
