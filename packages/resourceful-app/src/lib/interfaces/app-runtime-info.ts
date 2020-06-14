import { Versions } from './versions'

export interface AppRuntimeInfo {
  appDataPath: string
  cachePath: string
  devTools: boolean
  electronReload: boolean
  isDevelopmentMode: boolean
  isProductionMode: boolean
  userDataPath: string
  versions: Versions
  platform: string
}
