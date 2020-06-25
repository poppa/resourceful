import { Versions } from './versions'
import { SystemColors } from '../../app/colors'

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
  colors: SystemColors
}
