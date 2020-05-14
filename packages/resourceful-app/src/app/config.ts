import { app } from 'electron'
import getenv from 'getenv'
import { join } from 'path'
import { Env } from './lib/env'
import { fileExists, mkDir, readDir } from './lib/async-fs'
import { Versions, Maybe, Project, AppRuntimeInfo } from '../lib'
import { panic } from './lib/panic'

class Config implements AppRuntimeInfo {
  private _projectsDir: Maybe<string>

  @Env('RF_USER_DATA_PATH')
  public get userDataPath(): string {
    return app.getPath('userData')
  }

  @Env('RF_CACHE_PATH')
  public get cachePath(): string {
    return app.getPath('cache')
  }

  @Env('RF_APP_DATA_PATH')
  public get appDataPath(): string {
    return app.getPath('appData')
  }

  @Env('RF_DEV_TOOLS')
  public get devTools(): boolean {
    return false
  }

  @Env('RF_ELECTRON_RELOAD')
  public get electronReload(): boolean {
    return false
  }

  public get isProductionMode(): boolean {
    return process.env.ELECTRON_ENV !== 'development'
  }

  public get isDevelopmentMode(): boolean {
    return process.env.ELECTRON_ENV === 'development'
  }

  public async projectsDir(): Promise<string> {
    if (this._projectsDir) {
      return this._projectsDir
    }

    const d = join(this.userDataPath, 'projects')

    if (!(await fileExists(d)).success) {
      const r = await mkDir(d, true)

      if (r.failure) {
        panic(`Failed creating projects dir "${d}": %o`, r.error)
      }
    }

    this._projectsDir = d

    return d
  }

  public async getProjects(): Promise<Project[]> {
    const ret: Project[] = []
    const base = await this.projectsDir()
    const r = await readDir(base)

    if (r.failure) {
      panic(`Unable to read projects dir "${base}": %o`, r.error)
    }

    for (const f of r.result) {
      console.log(`f:`, f)
    }

    return ret
  }

  public get versions(): Versions {
    return {
      electron: process.versions.electron,
      node: process.versions.chrome,
      chrome: process.versions.chrome,
      app: getenv('npm_package_version', '0.0.0'),
    }
  }

  public toJson(): AppRuntimeInfo {
    return {
      appDataPath: this.appDataPath,
      cachePath: this.cachePath,
      devTools: this.devTools,
      electronReload: this.electronReload,
      isDevelopmentMode: this.isDevelopmentMode,
      isProductionMode: this.isProductionMode,
      userDataPath: this.userDataPath,
      versions: this.versions,
    }
  }
}

export const config = new Config()