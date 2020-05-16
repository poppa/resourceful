import { Events } from '../events'
import { IpcRenderer } from 'electron'
import { AppRuntimeInfo, Project } from '../../interfaces'
import { Maybe } from '../../types/types'

const ipcRenderer: IpcRenderer = window.require('electron').ipcRenderer

export async function loadConfig(): Promise<AppRuntimeInfo> {
  return (ipcRenderer.invoke(Events.RequestConfig) as unknown) as Promise<
    AppRuntimeInfo
  >
}

export async function saveProject(p: Project): Promise<Project | false> {
  return (ipcRenderer.invoke(Events.SaveProject, p) as unknown) as Promise<
    Project
  >
}

export async function loadProjets(): Promise<Maybe<Project[]>> {
  return ipcRenderer.invoke(Events.LoadProjects) as Promise<Maybe<Project[]>>
}
