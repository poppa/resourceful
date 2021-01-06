import { v4 } from 'uuid'
import type { Project } from '../../lib/interfaces/project'

export function makeProject(project?: Partial<Project>): Project {
  project = project ?? {}

  if (!project.id) {
    project.id = v4()
  }

  if (!project.name) {
    project.name = '<Unnamed>'
  }

  if (!project.resources) {
    project.resources = []
  }

  return project as Project
}
