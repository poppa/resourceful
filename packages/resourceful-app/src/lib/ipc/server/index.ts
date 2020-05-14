import { ipcMain } from 'electron'
import { Events } from '../events'
import { config } from '../../../app/config'
import { AppRuntimeInfo, Project } from '../../interfaces'

ipcMain.handle(
  Events.RequestConfig,
  async (): Promise<AppRuntimeInfo> => config.toJson()
)

ipcMain.handle(
  Events.CreateProject,
  async (_, p: Project): Promise<Project> => {
    console.log(`Got project on the server, will create:`, p)

    return p
  }
)
