import Store from 'electron-store'
import { logDebug } from '../lib/debug'

const debug = logDebug('store')

export interface WindowBounds {
  x?: number
  y?: number
  width?: number
  height?: number
}

interface AppSettings {
  windowBounds?: WindowBounds
}

export const store = new Store<AppSettings>()

export function saveWindowBounds(bounds?: WindowBounds): void {
  debug('save window bounds: %O', bounds)
  store.set('windowBounds', bounds)
}
