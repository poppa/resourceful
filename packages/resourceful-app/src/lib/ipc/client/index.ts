import { Events } from '../events'
import { IpcRenderer } from 'electron'
import { AppRuntimeInfo, Project } from '../../interfaces'

const ipcRenderer: IpcRenderer = window.require('electron').ipcRenderer

export async function loadConfig(): Promise<AppRuntimeInfo> {
  return (ipcRenderer.invoke(Events.RequestConfig) as unknown) as Promise<
    AppRuntimeInfo
  >
}

export async function createProject(p: Project): Promise<Project> {
  return (ipcRenderer.invoke(Events.CreateProject, p) as unknown) as Promise<
    Project
  >
}
