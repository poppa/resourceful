import { Resource, Project, Maybe } from '../../lib'
import { v4 } from 'uuid'
import { join } from 'path'
import { getProjectDirPath } from './project'
import { mkDir } from './async-fs'

type MakeResourceArgs = Omit<Resource, 'id'>

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

export function makeResource(resource: MakeResourceArgs): Resource {
  const res: Resource = { id: v4(), ...resource }
  return res as Resource
}
