import { staticStore } from '../storage'
import { applyTheme } from '../theme/theme'

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
  applyTheme()
}
