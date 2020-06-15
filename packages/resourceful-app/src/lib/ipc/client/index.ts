import { Events } from '../events'
import { IpcRenderer } from 'electron'
import { AppRuntimeInfo, Project, Resource } from '../../interfaces'
import { Maybe } from '../../types/types'
import { AsyncResult, success, failure } from 'safe-result'
import { ResolveResourceArgs } from '../types'
import { isPlainObject, isResource } from '../../typeguards'
import { logDebug } from '../../debug'
import { toJS } from 'mobx'

const ipcRenderer: IpcRenderer = window.require('electron').ipcRenderer
const debug = logDebug('ipc-client')

function deserialize<T>(obj: T): T {
  if (!isPlainObject(obj)) {
    return toJS(obj)
  } else {
    return obj
  }
}

export async function loadConfig(): Promise<AppRuntimeInfo> {
  return ipcRenderer.invoke(Events.RequestConfig)
}

export async function saveProject(p: Project): Promise<Project | false> {
  return ipcRenderer.invoke(Events.SaveProject, deserialize(p))
}

export async function loadProjets(): Promise<Maybe<Project[]>> {
  return ipcRenderer.invoke(Events.LoadProjects)
}

export async function resovleResource({
  buffer,
  project,
}: ResolveResourceArgs): AsyncResult<Resource> {
  project = deserialize(project)

  debug(`Sending:`, { buffer, project })

  const res = await ipcRenderer.invoke(Events.ResolveResource, {
    buffer,
    project,
  })

  debug('<-- resolveResource(): %o', res)

  if (isResource(res)) {
    return success(res)
  } else {
    return failure(res)
  }
}

export async function deleteProject(project: Project): AsyncResult<boolean> {
  project = deserialize(project)

  debug(`Sending project for deletion:`, project)
  const res = await ipcRenderer.invoke(Events.DeleteProject, project)
  debug(`---> res:`, res)

  return success(true)
}

export async function deleteResource(resource: Resource): AsyncResult<boolean> {
  resource = deserialize(resource)
  const res = await ipcRenderer.invoke(Events.DeleteResource, resource)
  debug(`Delete resource ${resource.name} result: ${res}`)
  return success(true)
}
