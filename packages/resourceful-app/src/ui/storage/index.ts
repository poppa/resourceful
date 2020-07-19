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
} from './misc'

export const projectsStore = ProjectsStore.create()
export const staticStore = StaticStore.create()
export const dragStateStore = DragStateStore.create()
export const resourceActionsState = ResourceActionState.create()
export const confirmState = ConfirmState.create()
export const createProjectDialogState = CreateProjectDialogState.create()
export const editProjectDialogState = EditProjectDialogState.create()
export const editResourceDialogState = EditResourceDialogState.create()
// Need to keep this last
export const pageStateStore = PageStateStore.create()
