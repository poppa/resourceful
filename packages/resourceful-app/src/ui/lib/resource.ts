import { staticStore, projectsStore, dragStateStore } from '../storage'

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
    console.log('Event client:', event.clientX, event.clientY)
    console.log(`Mouse offset:`, dragStateStore.mouseOffset)
    const ms = dragStateStore.mouseOffset ?? { x: 0, y: 0 }

    if (rs) {
      rs.position = {
        x: event.clientX - ms.x,
        y: event.clientY - ms.y - 16,
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
