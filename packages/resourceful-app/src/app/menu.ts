import { Menu } from 'electron'

const menu = Menu.buildFromTemplate([
  {
    label: 'Edit',
    submenu: [{ role: 'close' }, { role: 'quit' }],
  },
  {
    label: 'Project',
    submenu: [{ label: 'Edit' }, { role: 'paste' }, { role: 'resetZoom' }],
  },
])

export function setAppMenu(): void {
  Menu.setApplicationMenu(menu)
}
