export enum TicketStatus {
  Draft = -1,
  Archived = 0,
  HasUpdate = 1,
  Answered = 2
}

export enum TicketFormType {
  CREATE = 'create',
  EDIT = 'edit'
}

export enum TicketTaskPriority {
  Low = 0,
  Medium = 1,
  High = 2,
  Critical = 3
}

export enum TicketTaskStatus {
  New = 0,
  OnProgress = 1,
  Done = 2
}

export interface ITag {
  _id?: string
  isDeleted?: boolean
  name: {
    uz: string
    default: string
  }
}

export interface IProject {
  _id?: string
  name: string
}

export interface IExecutor {
  _id: string
  name: string
}

export interface IAuthor {
  _id?: string
  name: string
}

export interface ITicketTask {
  _id?: string
  ticketId: string
  projectId: string
  executors: IExecutor[]
  tags?: string[]
  priority?: TicketTaskPriority
  status?: TicketTaskStatus
  createdAt: string
  deadline?: string
  description: string
  files?: File[]
  filePaths?: string[]
  project?: IProject
  author?: IAuthor
  ticket?: {
    client: {
      name: string
      phone: string
      email: string
    }
  }
  type?: TicketTaskType
  smartOfficeTicket?: {
    department_id: string
  }
}

export enum TicketTaskType {
  INTERNAL = 'internal',
  SMART_OFFICE = 'smartOffice'
}

export interface ISmartOfficeDepartment {
  id: string
  name: string
  telegram_channel_id: string
  telegram_channel_name: string
  telegram_channel_username: string
}
