import { app } from 'electron'
import getenv from 'getenv'
import { join } from 'path'
import { Env } from './lib/env'
import { fileExists, mkDir, readDir } from './lib/async-fs'
import { Versions, Maybe, Project } from '../lib'
import { panic } from './lib/panic'

class Config {
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

  public async projectsDir(): Promise<string> {
    if (this._projectsDir) {
      return this._projectsDir
    }

    const d = join(this.userDataPath, 'projects')

    if (!(await fileExists(d)).yes) {
      const r = await mkDir(d, true)

      if (r.no) {
        panic(`Failed creating projects dir "${d}": %o`, r.no)
      }
    }

    this._projectsDir = d

    return d
  }

  public async getProjects(): Promise<Project[]> {
    const ret: Project[] = []
    const base = await this.projectsDir()
    const r = await readDir(base)

    if (r.no) {
      panic(`Unable to read projects dir "${base}": %o`, r.no)
    }

    for (const f of r.value) {
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
}

export const config = new Config()
