import type { MenuItemConstructorOptions } from 'electron'
import { findElementByClassName } from './find-element'
import type { Maybe } from '../../lib'
import { isSnippetResource, isTextResource } from '../../lib'
import {
  projectsStore,
  confirmState,
  editProjectDialogState,
  editResourceDialogState,
} from '../storage'
import { setResourceState, handleDelete } from './resource'

const { remote } = window.require('electron')
const { Menu } = remote

const projectMenuTemplate: MenuItemConstructorOptions[] = [
  {
    id: 'menu-project-edit',
    label: 'Edit',
  },
  {
    id: 'menu-project-delete',
    label: 'Delete',
  },
]

const resourceMenuTemplate: MenuItemConstructorOptions[] = [
  {
    id: 'menu-resource-collapse',
    label: 'Collapse',
    type: 'checkbox',
    checked: false,
  },
  { type: 'separator' },
  {
    id: 'menu-resource-edit',
    label: 'Edit',
  },
  {
    id: 'menu-resource-delete',
    label: 'Delete',
  },
  { type: 'separator' },
  {
    id: 'menu-resource-favorite',
    label: 'Favorite',
    type: 'checkbox',
    checked: false,
  },
]

function findItemById(
  menuTemplate: MenuItemConstructorOptions[],
  id: string
): MenuItemConstructorOptions {
  const item = menuTemplate.find((m) => m.id === id)

  if (!item) {
    throw new Error(`Unknown menu item ${id}`)
  }

  return item
}

function setupProjectMenu(id: string): void {
  const proj = projectsStore.findProjectById(id)

  if (!proj) {
    console.warn(`Unknown project: ${proj}`)
  }

  const editMenu = findItemById(projectMenuTemplate, 'menu-project-edit')
  const deleteMenu = findItemById(projectMenuTemplate, 'menu-project-delete')

  editMenu.click = (): void => {
    editProjectDialogState.setProject(proj)
  }

  deleteMenu.click = (): void => {
    confirmState.setState({
      description: `Are you sure you want to delete the project ${proj?.name}?`,
      onAbort(): void {
        console.log(`Aborted`)
        confirmState.setState()
      },
      async onConfirm(): Promise<void> {
        console.log(`We should really delete`)
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        await projectsStore.deleteProject(proj!)
        confirmState.setState()
      },
    })
  }
}

function setupResourceMenu(id: string): void {
  const resource = projectsStore.findResourceById(id)

  if (!resource) {
    console.warn(`Resource with id ${id} not found`)
    return
  }

  const collapseMenu = findItemById(
    resourceMenuTemplate,
    'menu-resource-collapse'
  )

  const deleteMenu = findItemById(resourceMenuTemplate, 'menu-resource-delete')

  deleteMenu.click = (): void => {
    handleDelete(resource)
  }

  if (
    resource.state?.hasCard ||
    isSnippetResource(resource) ||
    isTextResource(resource)
  ) {
    collapseMenu.enabled = true
    collapseMenu.checked = resource.state?.collapsed ?? false
    collapseMenu.click = (): void => {
      setResourceState({
        resource,
        state: { collapsed: !resource.state?.collapsed },
        save: true,
      })
    }
  } else {
    collapseMenu.enabled = false
    collapseMenu.checked = false
  }

  const editMenu = findItemById(resourceMenuTemplate, 'menu-resource-edit')
  editMenu.click = (): void => {
    editResourceDialogState.setResource(resource)
  }

  const favMenu = findItemById(resourceMenuTemplate, 'menu-resource-favorite')
  favMenu.checked = resource.state?.favorite
  favMenu.click = (): void => {
    setResourceState({
      resource,
      state: { favorite: !resource.state?.favorite },
      save: true,
    })
  }
}

window.addEventListener(
  'contextmenu',
  (e) => {
    let el: Maybe<Element>

    // Project tab right click
    if ((el = findElementByClassName(e.target as Element, 'tab--project'))) {
      setupProjectMenu(el.id)
      const projectMenu = Menu.buildFromTemplate(projectMenuTemplate)
      projectMenu.popup()
    }
    // Resource right click
    else if ((el = findElementByClassName(e.target as Element, 'resource'))) {
      setupResourceMenu(el.id)
      const resourceMenu = Menu.buildFromTemplate(resourceMenuTemplate)
      resourceMenu.popup()
    }
    // Canvas right click
    else if (findElementByClassName(e.target as Element, 'canvas')) {
      console.log(`Canvas clicked:`, e)
    }
  },
  false
)
