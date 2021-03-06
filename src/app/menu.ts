import type { MenuItemConstructorOptions } from 'electron'
import { Menu } from 'electron'

const mainMenuTemplate: MenuItemConstructorOptions[] = [
  {
    label: 'Resourceful',
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideOthers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'close' },
      { role: 'quit' },
    ],
  },
  {
    label: 'Project',
    submenu: [
      { label: 'Edit' },
      { role: 'delete' },
      { role: 'copy' },
      { role: 'paste' },
    ],
  },
  {
    role: 'viewMenu',
    submenu: [
      { role: 'reload' },
      { role: 'resetZoom' },
      { type: 'separator' },
      { role: 'togglefullscreen' },
    ],
  },
]

const menu = Menu.buildFromTemplate(mainMenuTemplate)

export function setAppMenu(): void {
  Menu.setApplicationMenu(menu)
}
