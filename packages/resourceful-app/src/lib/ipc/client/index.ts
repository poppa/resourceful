import { Events } from '../events'
import { IpcRenderer } from 'electron'
import { AppRuntimeInfo } from '../../interfaces'
const ipcRenderer: IpcRenderer = window.require('electron').ipcRenderer

export async function loadConfig(): Promise<AppRuntimeInfo> {
  return (ipcRenderer.invoke(Events.RequestConfig) as unknown) as Promise<
    AppRuntimeInfo
  >
}
