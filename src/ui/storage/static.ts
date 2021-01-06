import { computed, observable } from 'mobx'
import type { Maybe } from '../../lib/types/types'
import type { AppRuntimeInfo } from '../../lib'
import { IpcClient } from '../lib'
import { initSystemPrefs } from '../lib/system-preferences'

let store: Maybe<StaticStore>

export class StaticStore {
  public static create(): StaticStore {
    return store ?? (store = new this())
  }

  @observable private _appRuntimeInfo: Maybe<AppRuntimeInfo>

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public async loadConfig(): Promise<void> {
    this._appRuntimeInfo = await IpcClient.loadConfig()
    initSystemPrefs()
  }

  @computed public get appRuntimeInfo(): Maybe<AppRuntimeInfo> {
    return this._appRuntimeInfo
  }
}
