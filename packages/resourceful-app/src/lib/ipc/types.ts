import { Project } from '../interfaces'

export interface ResolveResourceArgs {
  buffer: string
  project: Project
}

export interface FeedbackMessage {
  key: string
  message?: string
  type: 'start' | 'update' | 'finish'
}
