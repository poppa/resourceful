import { install } from 'source-map-support'
install()
import { app, BrowserWindow } from 'electron'
import { join } from 'path'
import { getenv } from '../lib'

let mainWindow: Electron.BrowserWindow | undefined

if (getenv('ELECTRON_ENV', 'production') === 'development') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('electron-reload')(__dirname, {
    electron: join(__dirname, '../../../../node_modules', '.bin', 'electron'),
  })
}

function createWindow(): void {
  mainWindow = new BrowserWindow({
    fullscreenable: true,
    darkTheme: true,
    title: 'Resourceful',
    width: 1600,
    height: 800,
    webPreferences: {
      // preload: join(__dirname, "preload.js"),
    },
  })

  mainWindow.loadFile(join(__dirname, '../ui/app.html'))

  if (process.env.RF_DEV_TOOLS) {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.on('closed', () => (mainWindow = undefined))
}

app.allowRendererProcessReuse = true

app
  .on('ready', createWindow)
  .on('window-all-closed', () => {
    // Make this configurable
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
  .on('activate', () => {
    // Make this configurable
    if (mainWindow === null) {
      createWindow()
    }
  })
