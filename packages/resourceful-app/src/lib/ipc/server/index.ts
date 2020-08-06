import { ipcMain } from 'electron'
import { Events } from '../events'
import { config } from '../../../app/config'
import { AppRuntimeInfo, Project, Resource } from '../../interfaces'
import {
  saveProject,
  loadProjects,
  deleteProject,
} from '../../../app/lib/project'
import { Maybe } from '../../types/types'
import { resovleResource } from '../../../app/resource-handlers'
import { ResolveResourceArgs, FeedbackMessage, LoginRedirect } from '../types'
import { logDebug } from '../../debug'
import { deleteResource } from '../../../app/lib/resource'
import { saveProjectOrder } from '../../../app/store'
import { getMainWindow } from '../../../app/main'
import { colors } from '../../../app/colors'

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

// Delete project
ipcMain.handle(
  Events.DeleteProject,
  async (_, args: Project): Promise<boolean> => {
    debug(`Delete project invoked server side:`, args)
    const delres = await deleteProject(args)
    console.log(`Delete result:`, delres)
    return delres.success ? delres.result : false
  }
)

// Delete resource
ipcMain.handle(
  Events.DeleteResource,
  async (_, args: Resource): Promise<boolean> => {
    debug(`Delete resource:`, args)
    const ok = await deleteResource(args)

    if (ok.success) {
      return ok.result
    } else {
      console.log(`Result not ok:`, ok)
    }

    return false
  }
)

// Save project order
ipcMain.handle(
  Events.SaveProjectOrder,
  async (_, args: string[]): Promise<boolean> => {
    debug('Save project order:', args)
    saveProjectOrder(args)
    return true
  }
)

export function sendFeedbackMessage(message: FeedbackMessage): void {
  const win = getMainWindow()

  if (win) {
    win.webContents.send(Events.FeedbackMessage, message)
  }
}

export function loginRedirect(obj: LoginRedirect): void {
  const win = getMainWindow()

  if (win) {
    win.webContents.send(Events.BeginLoginRedirect, obj)
  }
}

colors.on('updated', () => {
  const win = getMainWindow()

  if (win) {
    win.webContents.send(Events.UpdateTheme, colors.toPlainObject())
  }
})
