import { PageStateStore } from './pagestate'
import { ProjectsStore } from './projects'
import { StaticStore } from './static'
import { DragStateStore } from './dragstate'
import {
  ResourceActionState,
  ConfirmState,
  CreateProjectDialogState,
  EditProjectDialogState,
  EditResourceDialogState,
  CreateResourceState,
} from './misc'
import { TabDragStateStore } from './tabdragstate'

export const projectsStore = ProjectsStore.create()
export const staticStore = StaticStore.create()
export const dragStateStore = DragStateStore.create()
export const resourceActionsState = ResourceActionState.create()
export const confirmState = ConfirmState.create()
export const createProjectDialogState = CreateProjectDialogState.create()
export const editProjectDialogState = EditProjectDialogState.create()
export const editResourceDialogState = EditResourceDialogState.create()
export const tabDragState = TabDragStateStore.create()
export const createResourceState = CreateResourceState.create()
// Need to keep this last
export const pageStateStore = PageStateStore.create()
