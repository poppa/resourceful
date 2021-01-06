import {
  staticStore,
  projectsStore,
  dragStateStore,
  confirmState,
} from '../storage'
import type { Resource, ResourceState } from '../../lib'
import { columns } from './resource-columns'

export function upgradeResource(resource: Resource): Resource {
  if (!resource.state) {
    resource.state = { collapsed: false }
  }

  return resource
}

export interface SetResourceStateProps {
  resource: Resource
  state: Partial<ResourceState>
  save?: boolean
}

export function setResourceState({
  resource,
  state,
  save,
}: SetResourceStateProps): Resource {
  console.log(`Set resource state:`, resource, state)
  resource.state = { ...resource.state, ...state }

  if (save) {
    projectsStore
      .saveCurrentProject()
      .then(() => columns())
      .catch((err) =>
        console.error(
          `Failed saving project after setting resource state:`,
          err
        )
      )
  }

  return resource
}

export function isResourceHTMLElement(e: unknown): e is HTMLDivElement {
  return (
    typeof e === 'object' &&
    e !== null &&
    'classList' in e &&
    (e as HTMLDivElement).classList.contains('resource')
  )
}

export function handleMovedResource({
  element,
  event,
}: {
  element: Element
  event: React.DragEvent
}): void {
  if (isResourceHTMLElement(element)) {
    const rs = projectsStore.findResourceById(element.id)
    const ms = dragStateStore.mouseOffset ?? { x: 0, y: 0 }

    if (rs) {
      rs.position = {
        x: event.clientX - ms.x,
        y: event.clientY - ms.y - 12,
      }

      projectsStore
        .saveCurrentProject()
        .catch((err) => console.error(`Error saving project:`, err))
    }
  }
}

export function resolveProjectFilePath(file: string): string {
  const base = staticStore.appRuntimeInfo

  if (!base) {
    throw new Error(`resolveFilePath() called before app was loaded`)
  }

  return `file://${base.userDataPath}/projects/${file}`
}

export function resolveDefaultFilePath(file: string): string {
  return `images/${file}`
}

export function resolveDefaultIconPath(file: string): string {
  return `svg/icons/${file}`
}

export const handleDelete = (resource: Resource): void => {
  confirmState.setState({
    description: `Are you sure you want to delete the ${resource?.name} resource?`,
    onAbort(): void {
      console.log(`Aborted`)
      confirmState.setState()
    },
    onConfirm(): void {
      confirmState.setState()
      if (resource) {
        projectsStore
          .deleteResource(resource)
          .catch((e) => console.error(`Delete resource error:`, e))
        // resourceActionsState.toggleRef()
      }
    },
  })
}
