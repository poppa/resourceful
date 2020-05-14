import { Maybe } from '../../lib/types/types'
import { loadConfig } from '../../lib/ipc/client'
import { AppRuntimeInfo } from '../../lib'
import { computed, observable } from 'mobx'

let store: Maybe<StaticStore>

export class StaticStore {
  static create(): StaticStore {
    return store ?? (store = new this())
  }

  @observable private _appRuntimeInfo: Maybe<AppRuntimeInfo>

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public async loadConfig(): Promise<void> {
    this._appRuntimeInfo = await loadConfig()
  }

  @computed get appRuntimeInfo(): Maybe<AppRuntimeInfo> {
    return this._appRuntimeInfo
  }
}
