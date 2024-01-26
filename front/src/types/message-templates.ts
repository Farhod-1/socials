export enum MessageTemplateType {
  ALL_PROJECTS = 0,
  SELECTED_PROJECTS = 1
}

export enum MessageVisibility {
  PERSONAL = 0,
  ALL_OPERATORS = 1
}

export interface MessageTemplateForm extends Record<string, unknown> {
  _id?: string
  key?: string
  text?: string
  projects?: string[]
  type: MessageTemplateType
  visibility: MessageVisibility
}

export enum MessageTemplateFormType {
  CREATE = 'create',
  EDIT = 'edit'
}

export interface MessageTemplate {
  _id: string
  text: string
  creator: {
    _id: string
    name: string
  }
  projects: {
    _id: string
    name: string
  }[]
  key: string
  type: MessageTemplateType
  visibility: MessageVisibility
  createAt: string
  updatedAt: string
}
