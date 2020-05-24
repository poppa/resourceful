import { ipcMain } from 'electron'
import { Events } from '../events'
import { config } from '../../../app/config'
import { AppRuntimeInfo, Project, Resource } from '../../interfaces'
import { saveProject, loadProjects } from '../../../app/lib/project'
import { Maybe } from '../../types/types'
import { resovleResource } from '../../../app/resource-handlers'
import { ResolveResourceArgs } from '../types'
import { logDebug } from '../../debug'

const debug = logDebug('ipc-main')

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
  async (_, args: ResolveResourceArgs): Promise<Resource | Error> => {
    debug(`ipcMain.handle(%s, %o):`, Events.ResolveResource, args)
    const resource = await resovleResource(args)

    if (resource.success) {
      return resource.result
    } else {
      return { message: resource.error.message, name: resource.error.name }
    }
  }
)
