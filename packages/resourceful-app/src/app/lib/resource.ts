import { Resource, Project, Maybe, ResourceOf } from '../../lib'
import { v4 } from 'uuid'
import { join } from 'path'
import { getProjectDirPath } from './project'
import { mkDir } from './async-fs'

export async function getResourceDirPath(
  resource: Resource,
  project: Project
): Promise<string> {
  return join(await getProjectDirPath(project), resource.id)
}

export async function makeResourceDir(
  resource: Resource,
  project: Project
): Promise<Maybe<string>> {
  const p = await getResourceDirPath(resource, project)
  const r = await mkDir(p)

  if (r.success) {
    return p
  }

  return undefined
}

export function makeResource<T extends Omit<Resource, 'id'>>(
  resource: T
): ResourceOf<T> {
  return ({ id: v4(), ...resource } as unknown) as ResourceOf<T>
}
