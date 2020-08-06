import { Resource } from './resource'

export interface Project {
  id: string
  name: string
  selected?: boolean
  resources: Resource[]
}
