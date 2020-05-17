import { ipcMain } from 'electron'
import { Events } from '../events'
import { config } from '../../../app/config'
import { AppRuntimeInfo, Project, Resource } from '../../interfaces'
import { saveProject, loadProjects } from '../../../app/lib/project'
import { Maybe } from '../../types/types'
import { AsyncResult } from 'safe-result'
import { resovleResource } from '../../../app/resource-handlers'

// Server config
ipcMain.handle(
  Events.RequestConfig,
  async (): Promise<AppRuntimeInfo> => config.toJson()
)

// Save project
ipcMain.handle(
  Events.SaveProject,
  async (_, p: Project): Promise<Project | false> => {
    const r = await saveProject(p)

    if (r) {
      return p
    } else {
      return false
    }
  }
)

// Load projects
ipcMain.handle(
  Events.LoadProjects,
  async (): Promise<Maybe<Project[]>> => loadProjects()
)

// Resolve resource
ipcMain.handle(
  Events.ResolveResource,
  async (_, buffer: string): AsyncResult<Resource> => {
    console.log(`Resolve resource:`, buffer)
    return await resovleResource(buffer)
  }
)
