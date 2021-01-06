import type { Versions, Maybe, AppRuntimeInfo } from '../lib'
import { app } from 'electron'
import getenv from 'getenv'
import { join } from 'path'
import { Env } from './lib/env'
import { fileExists, mkDir } from './lib/async-fs'
import { panic } from './lib/panic'
import { platform } from 'os'
import { colors } from './colors'

class Config implements Omit<AppRuntimeInfo, 'colors'> {
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
  // eslint-disable-next-line @typescript-eslint/class-literal-property-style
  public get devTools(): boolean {
    return false
  }

  @Env('RF_ELECTRON_RELOAD')
  // eslint-disable-next-line @typescript-eslint/class-literal-property-style
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

  public get versions(): Versions {
    return {
      electron: process.versions.electron,
      node: process.versions.node,
      chrome: process.versions.chrome,
      app: getenv('npm_package_version', '0.0.0'),
    }
  }

  public get platform(): string {
    return platform()
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
      platform: this.platform,
      colors: colors.toPlainObject(),
    }
  }
}

export const config = new Config()
