type TOption = {
  key: string | number
  value: any
}

export type TInputProps = {
  type: string
  name: string
  label?: string
  showError?: boolean
  className?: string
  value: string
  placeholder?: string
  options?: TOption[]
  onChange?: (value: any) => void
}

export type TFormikWrapperProps = {
  fields: IField[]
}

export interface TController extends TInputProps {
  control: TControl
}

export interface IField {
  type: string
  name: string
  label?: string
  control: TControl
  className?: string
  value: string
  options?: TOption[] | []
  showError?: boolean
  placeholder?: string
  onChange?: (value: any) => void
}

export type TControl = 'input' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'numberFormat'
