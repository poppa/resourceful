import { staticStore } from '../storage'

const { systemPreferences } = window.require('electron')

export function isMac(): boolean {
  const ri = staticStore.appRuntimeInfo
  return ri?.platform === 'darwin'
}

export function isWindows(): boolean {
  const ri = staticStore.appRuntimeInfo
  return ri?.platform === 'win32'
}

export function isLinux(): boolean {
  return !isMac() && !isWindows()
}

export function initSystemPrefs(): void {
  console.log(`Sysprefs:`, systemPreferences)
}
