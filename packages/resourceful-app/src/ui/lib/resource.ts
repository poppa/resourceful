import { staticStore } from '../storage'

export function resolveProjectFilePath(file: string): string {
  const base = staticStore.appRuntimeInfo
  if (!base) {
    throw new Error(`resolveFilePath() called before app was loaded`)
  }
  return `file://${base?.userDataPath}/projects/${file}`
}

export function resolveDefaultFilePath(file: string): string {
  return `images/${file}`
}
