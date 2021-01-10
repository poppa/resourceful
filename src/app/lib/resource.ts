import type { Resource, Project, Maybe, ResourceOf } from '../../lib'
import { v4 } from 'uuid'
import { join } from 'path'
import { getProjectDirPath, loadProjects } from './project'
import { mkDir, rmDir } from './async-fs'
import type { AsyncResult } from 'safe-result'
import { failure, success } from 'safe-result'

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

export async function resolveProjectFromResource(
  resource: Resource
): AsyncResult<Project> {
  const pps = await loadProjects()

  if (!pps) {
    return failure(new Error('Unable to resolve projects'))
  }

  let proj: Maybe<Project>

  for (const p of pps) {
    if (p.resources.find((r) => r.id === resource.id)) {
      proj = p
      break
    }
  }

  if (!proj) {
    return failure(
      new Error(`Unable to find project of resource ${resource.id}`)
    )
  }

  return success(proj)
}

export async function deleteResource(resource: Resource): AsyncResult<boolean> {
  const proj = await resolveProjectFromResource(resource)

  if (proj.failure) {
    return proj
  }

  const dir = await getResourceDirPath(resource, proj.result)

  const rmres = await rmDir(dir, { recursive: true })
  console.log(`rm resource dir result:`, rmres)
  return rmres
}

export async function getFavoriteResources(): AsyncResult<Resource[]> {
  const projs = await loadProjects()

  if (!projs) {
    return success([])
  }

  const favs: Resource[] = []

  projs.forEach((p) => {
    p.resources.forEach((res) => {
      if (res.state?.favorite) {
        favs.push(res)
      }
    })
  })

  return success(favs)
}
