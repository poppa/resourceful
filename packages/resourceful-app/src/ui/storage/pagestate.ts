import { observable } from 'mobx'
import { Maybe } from '../../lib/types/types'
import { isUndefined } from '../../lib/utils/typeguards'
import { loadConfig } from '../../lib/ipc/client'

let store: Maybe<PageStateStore>

export enum PageState {
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

  @observable public state: PageState = PageState.Projects

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    loadConfig().then((r) => console.log(`Ipc load config done:`, r.versions))
  }
}
