import { install } from 'source-map-support'
install()
import { app, BrowserWindow, nativeTheme, Tray, Menu } from 'electron'
import { join } from 'path'
import { config } from './config'
import '../lib/ipc/server'
import { setAppMenu } from './menu'
import { MaybeNull, Maybe } from '../lib'

let mainWindow: MaybeNull<Electron.BrowserWindow> = null

if (config.isDevelopmentMode) {
  config.projectsDir().then((p) => console.log(`Projects dir: ${p}`))
}

if (config.electronReload) {
  console.log(`Electron reload enabled`)
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('electron-reload')(__dirname, {
    electron: join(__dirname, '../../../../node_modules', '.bin', 'electron'),
  })
}

const AppIcon = join(__dirname, '..', '..', 'src/app/resourceful-logo.png')

let tray: Maybe<Tray>

function makeTrayIcon(): void {
  tray = new Tray(AppIcon)
  tray.setContextMenu(
    Menu.buildFromTemplate([
      {
        label: 'Show',
        click(): void {
          if (mainWindow) {
            mainWindow.show()
          } else {
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            createWindow()
          }
        },
      },
      {
        label: 'Quit',
        role: 'quit',
      },
    ])
  )
}

function createWindow(): void {
  console.log(`createWindow()`)

  mainWindow = new BrowserWindow({
    icon: AppIcon,
    fullscreenable: true,
    darkTheme: true,
    title: 'Resourceful',
    width: 1600,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      preload: join(__dirname, 'bootstrap.js'),
    },
  })

  mainWindow.loadFile(join(__dirname, '../ui/app.html'))

  if (config.devTools) {
    console.log(`Devtools available`)
    mainWindow.webContents.openDevTools()
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

nativeTheme.on('updated', () => {
  console.log(`Native theme updated:`, nativeTheme.shouldUseDarkColors)
})

app.allowRendererProcessReuse = true

app
  .on('ready', () => {
    createWindow()
    setAppMenu()
    makeTrayIcon()
  })
  .on('window-all-closed', () => {
    // Make this configurable
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
  .on('activate', () => {
    console.log(`app on activate`)

    // Make this configurable
    if (mainWindow === null) {
      createWindow()
    }
  })
