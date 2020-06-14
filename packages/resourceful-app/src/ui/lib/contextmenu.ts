import { MenuItemConstructorOptions } from 'electron'
import { findElementByClassName } from './find-element'
import { Maybe } from '../../lib'
import { projectsStore } from '../storage'
import { setResourceState, handleDelete } from './resource'

const { remote } = window.require('electron')
const { Menu, MenuItem } = remote

const projectMenu = new Menu()
projectMenu.append(
  new MenuItem({
    label: 'Edit',
    click(): void {
      console.log(`Edit cliked`)
    },
  })
)
projectMenu.append(
  new MenuItem({
    label: 'Delete',
    click(): void {
      console.log(`Delete clicked`)
    },
  })
)

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

window.addEventListener(
  'contextmenu',
  (e) => {
    console.log(`Context menu:`, e)
    let el: Maybe<Element>

    if (findElementByClassName(e.target as Element, 'tab--project')) {
      projectMenu.popup()
    } else if ((el = findElementByClassName(e.target as Element, 'resource'))) {
      const resource = projectsStore.findResourceById(el.id)

      if (!resource) {
        console.warn(`Resource with id ${el.id} not found`)
        return
      }

      const collapseMenu = findItemById(
        resourceMenuTemplate,
        'menu-resource-collapse'
      )
      const deleteMenu = findItemById(
        resourceMenuTemplate,
        'menu-resource-delete'
      )

      deleteMenu.click = (): void => {
        handleDelete(resource)
      }

      if (resource.state?.hasCard) {
        collapseMenu.enabled = true
        collapseMenu.checked = resource.state.collapsed ?? false
        collapseMenu.click = (): void => {
          setResourceState({
            resource,
            state: { collapsed: !!!resource.state?.collapsed },
            save: true,
          })
        }
      } else {
        collapseMenu.enabled = false
        collapseMenu.checked = false
      }

      const resourceMenu = Menu.buildFromTemplate(resourceMenuTemplate)
      resourceMenu.popup()
    } else if (findElementByClassName(e.target as Element, 'canvas')) {
      console.log(`Canvas clicked:`, e)
    }
  },
  false
)
