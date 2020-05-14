import { observable, computed } from 'mobx'
import { Maybe } from '../../lib/types/types'
import { isUndefined } from '../../lib/utils/typeguards'
import Result from 'safe-result'
import { staticStore, projectsStore } from '.'

let store: Maybe<PageStateStore>

export enum PageState {
  Initializing,
  HomeScreen,
  Projects,
}

export function isPageState(n: Maybe<number>): boolean {
  if (isUndefined(n)) {
    return false
  }

  return [PageState.HomeScreen, PageState.Projects].includes(n)
}

export class PageStateStore {
  static create(): PageStateStore {
    return store ?? (store = new this())
  }

  private constructor() {
    this.init()
  }

  @observable private _state: PageState = PageState.Initializing

  @computed public get state(): PageState {
    return this._state
  }

  public set state(state: PageState) {
    this._state = state
  }

  private async init(): Promise<void> {
    const x = await Result.all([
      staticStore.loadConfig(),
      projectsStore.loadProjects(),
    ])

    if (x.success) {
      console.log(`All init done`)

      if (projectsStore.hasProjects) {
        this._state = PageState.Projects
      } else {
        this._state = PageState.HomeScreen
      }
    }
  }
}
