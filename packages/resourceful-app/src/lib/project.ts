import { v4 } from 'uuid'

export interface Project {
  id: string
  name: string
}

export function makeProject(project?: Partial<Project>): Project {
  project = project ?? {}

  if (!project.id) {
    project.id = v4()
  }

  if (!project.name) {
    project.name = 'Unnamed'
  }

  return project as Project
}
