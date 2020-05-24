import { Events } from '../events'
import { IpcRenderer } from 'electron'
import { AppRuntimeInfo, Project, Resource } from '../../interfaces'
import { Maybe } from '../../types/types'
import { AsyncResult, success, failure } from 'safe-result'
import { ResolveResourceArgs } from '../types'
import { isPlainObject, isResource } from '../../typeguards'
import { logDebug } from '../../debug'

const ipcRenderer: IpcRenderer = window.require('electron').ipcRenderer
const debug = logDebug('resolve-resource')

export async function loadConfig(): Promise<AppRuntimeInfo> {
  return ipcRenderer.invoke(Events.RequestConfig)
}

export async function saveProject(p: Project): Promise<Project | false> {
  return ipcRenderer.invoke(Events.SaveProject, { ...p })
}

export async function loadProjets(): Promise<Maybe<Project[]>> {
  return ipcRenderer.invoke(Events.LoadProjects)
}

export async function resovleResource({
  buffer,
  project,
}: ResolveResourceArgs): AsyncResult<Resource> {
  if (!isPlainObject(project)) {
    project = { ...project }
  }

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
