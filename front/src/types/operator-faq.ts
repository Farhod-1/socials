import type { ITreeNode } from '@/components/TreeList/types'

export interface OperatorFaq {
  _id: string
  title: string
  question: string
  answers: string[]
  projects: string[]
  tags: string[]
  topic?: string
}

export interface CreateOperatorFAQData {
  _id?: string
  title?: string
  question: string
  answers: string[]
  projects?: string[]
  tags?: string[]
  topicId?: string
}

export interface OperatorFaqList {
  data: OperatorFaq[]
  limit: number
  page: number
  total: number
}

export interface OperatorFaqTemplateForm extends Record<string, unknown> {
  _id?: string
  title?: string
  question?: string
  answer?: string
  projects?: string[]
  tags?: string[]
}

export interface ITag {
  _id?: string
  isDeleted?: boolean
  name: {
    uz: string
    default: string
  }
}

export interface KnowledgeBaseTopics extends ITreeNode {
  faqIds?: string[]
  faqs?: OperatorFaq[]
}

export interface KnowledgeBaseTopicsWithCount extends KnowledgeBaseTopics {
  questionsCount: number
  answersCount: number
}
