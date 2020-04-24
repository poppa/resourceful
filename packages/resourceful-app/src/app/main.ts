import { app, BrowserWindow } from 'electron'
import { join } from 'path'

let mainWindow: Electron.BrowserWindow | undefined

function createWindow(): void {
  mainWindow = new BrowserWindow({
    backgroundColor: '#131313',
    fullscreenable: true,
    darkTheme: true,
    title: 'Resourceful',
    width: 1200,
    height: 600,
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
