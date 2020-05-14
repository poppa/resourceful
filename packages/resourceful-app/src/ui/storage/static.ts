import { computed, observable } from 'mobx'
import { Maybe } from '../../lib/types/types'
import { AppRuntimeInfo } from '../../lib'
import { IpcClient } from '../lib'

let store: Maybe<StaticStore>

export class StaticStore {
  static create(): StaticStore {
    return store ?? (store = new this())
  }

  @observable private _appRuntimeInfo: Maybe<AppRuntimeInfo>

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public async loadConfig(): Promise<void> {
    this._appRuntimeInfo = await IpcClient.loadConfig()
  }

  @computed get appRuntimeInfo(): Maybe<AppRuntimeInfo> {
    return this._appRuntimeInfo
  }
}
